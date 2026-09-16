import type {
  RecordMetadata,
  ScoredPineconeRecord,
} from "@pinecone-database/pinecone";
import { CHAT_MODEL, RAG_TOP_K } from "../ai/ai-config.js";
import { embedTexts } from "../ai/indexing.js";
import openai from "../ai/openai.js";
import { queryWorkspaceVectors } from "../pinecone.js";

export type RetrievedChunk = {
  sourceId: string;
  sourceTitle: string;
  sourceType: string;
  chunkId: string;
  chunkIndex: number;
  page?: number;
  text: string;
  score: number;
};

type AdvancedRagResult = {
  queries: {
    original: string;
    rewritten: string;
    stepBack: string;
    hyde: string;
    subQueries: string[];
  };

  chunks: RetrievedChunk[];
};

export async function retrieveWorkspaceContext(
  workspaceId: string,
  userQuery: string,
): Promise<AdvancedRagResult> {
  const [{ stepBack, rewritten, subQueries }, hyde] = await Promise.all([
    queryRewriting(userQuery),
    hydeDocument(userQuery),
  ]);

  const labelled = [
    { label: "rewritten", text: rewritten },
    { label: "stepback", text: stepBack },
    { label: "hyde", text: hyde },

    ...subQueries.map((q: string, i: number) => ({
      label: `subQuery${i + 1}`,
      text: q,
    })),
  ].filter((q) => typeof q.text === "string" && q.text.trim().length > 0);

  const vectors = await embedTexts(labelled.map((q) => q.text));

  // top_k chunks of every query
  const resultsPerQuery = await Promise.all(
    vectors.map((v) => queryWorkspaceVectors(workspaceId, v, RAG_TOP_K)),
  );

  //typeof of resultsPerQuery:
  // [
  //  {
  //     id: "cmt63f0h80007poil3d9pify3",
  //     score: 0.665719151,
  //     values: [],
  //     sparseValues: undefined,
  //     metadata: [Object],
  //   },
  // ];

  // which query produced which results
  const rankedLists = labelled.map((q, i) => ({
    label: q.label,
    hits: resultsPerQuery[i] ?? [],
  }));

  const fused = await reciprocalRankFusion(rankedLists);
  const chunks = fused.slice(0, 5);

  console.log("Ranked chunks: ", chunks);

  return {
    queries: { original: userQuery, rewritten, stepBack, hyde, subQueries },
    chunks,
  };
}

export type UserMemoryContext = string;

export function buildChatSystemPrompt(input: {
  chunks: RetrievedChunk[];
  conversationSummary?: string | null;
  userMemories?: UserMemoryContext[];
  webSearchEnabled?: boolean;
}) {
  const sections: string[] = [
    `
    You are ANVESH, an assistant that helps users learn from their workspace sources.

    CORE RULE:
    Answer factual questions using only information supported by the allowed evidence provided in this prompt.

    WORKSPACE GROUNDING:
    - Workspace sources are authoritative for claims about workspace materials.
    - Do not use general/pretrained knowledge to answer, explain, classify, identify, describe, or provide context for information missing from the workspace evidence.
    - Do not use pretrained knowledge to provide recommendations or suggestions related to a topic that is unsupported by the workspace.
    - Do not introduce unsupported facts, relationships, causes, examples, or conclusions.
    - If the workspace sources do not contain enough information, say so clearly.
    - Never fabricate citations.

    CITATIONS:
    - Workspace citations use [1], [2], etc.
    - Web citations use [W1], [W2], etc.
    - Every factual claim must be supported by the appropriate evidence.
    - Place citations immediately after the claim they support.
    - Never fabricate citation numbers.

    MEMORY:
    - User memories are for personalization and conversational continuity only.
    - Memories are NOT evidence for workspace-related factual claims.

    CONVERSATION:
    - Conversation summaries are for conversational continuity only.
    - They are NOT evidence for workspace-related factual claims.

    ANSWER STYLE:
    - Answer the user's actual question using only supported evidence.
    - Be accurate, clear, educational, and natural when sufficient evidence is available.
    - If sufficient evidence is unavailable, use the exact fallback response and stop.
    - Do not attempt to be helpful by adding outside knowledge or recommending external resources.
    `,
  ];

  if (input.webSearchEnabled) {
    sections.push(`
      WEB SEARCH:
      You have access to web search for external and up-to-date information.

      Use web search when:
      - the user explicitly asks for web/external information
      - the user asks about recent or current information
      - the question clearly requires information outside the workspace

      Do not use web search to silently fill missing information from workspace sources.

      When web results are used, cite them using [W1], [W2], etc.
    `);
  }

  if (input.userMemories?.length) {
    const memoryBlock = input.userMemories
      .map((memory) => `- ${memory}`)
      .join("\n");

    sections.push(`
    USER MEMORIES:

    These memories may be used only for personalization
    and conversational continuity.

    They are NOT evidence for workspace-related factual claims.
    Never use memories to fill missing information from workspace sources.

    ${memoryBlock}
`);
  }

  const summary = input.conversationSummary?.trim();

  if (summary) {
    sections.push(`
    CONVERSATION SUMMARY:

    Use this summary only to maintain conversational continuity
    and understand references to previous discussion.

    It is NOT authoritative source material.
    Do not use it as evidence for factual claims about workspace documents.

    ${summary}
`);
  }

  if (input.chunks.length === 0) {
    if (input.webSearchEnabled) {
      sections.push(`
    RETRIEVED WORKSPACE CONTEXT:

    No relevant workspace source content was retrieved.

    WEB SEARCH FALLBACK:

    The workspace does not contain enough information to answer
    the user's question.

    You have access to the web_search tool.

    If the user's question requires information outside the
    workspace, you MUST use web_search before answering.

    Do not answer from general or pretrained knowledge without
    using web_search.

    When web search is used, cite factual claims using [W1],
    [W2], etc.
    `);
    } else {
      sections.push(`
    RETRIEVED WORKSPACE CONTEXT:

    No relevant workspace source content was retrieved.

    For workspace-specific factual questions:
    - Do not use general/pretrained knowledge.
    - Do not use memories or conversation summaries as evidence.
    - Respond ONLY with:
      "I couldn't find enough information about this in the provided workspace sources."
    - Do not add any other sentence.
    - Do not provide explanations.
    - Do not provide background information.
    - Do not provide examples.
    - Do not recommend external resources.
    - Do not mention books, articles, websites, anime, manga, or other sources outside the workspace.
    `);
    }

    return sections.join("\n\n");
  }

  const context = input.chunks
    .map((chunk, index) => {
      const label =
        `[${index + 1}] ${chunk.sourceTitle} (${chunk.sourceType})` +
        `${chunk.page ? `, page ${chunk.page}` : ""}`;

      return `${label}\n${chunk.text}`;
    })
    .join("\n\n");

  sections.push(`
    RETRIEVED WORKSPACE CONTEXT:

    Use the following sources as the authoritative evidence for
    claims about workspace materials.

    If the context is insufficient, say so clearly.
    Cite workspace sources using [1], [2], etc.

    ${context}
`);

  return sections.join("\n");
}

export async function queryRewriting(query: string) {
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.2,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "query_rewriting",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            stepBack: {
              type: "string",
              description:
                "A broader, higher-level 'step-back' question whose answer gives useful background for the original query.",
            },
            rewritten: {
              type: "string",
              description:
                "The original query with spelling/grammar fixed and made clear and self-contained. Preserve the original intent.",
            },
            subQueries: {
              type: "array",
              description:
                "Exactly 3 focused sub-questions the original query can be decomposed into.",
              items: { type: "string" },
            },
          },
          required: ["stepBack", "rewritten", "subQueries"],
        },
      },
    },
    messages: [
      {
        role: "system",
        content:
          "You are a query understanding assistant for a retrieval system. " +
          "Given a user's question, produce query variants that help retrieve relevant documents. " +
          "Apply three techniques: (1) step-back prompting -> one broader background question; " +
          "(2) query rewriting -> fix typos/grammar and make the query explicit and self-contained; " +
          "(3) sub-query decomposition -> break the query into exactly 3 focused sub-questions. " +
          "Respond ONLY with the structured JSON.",
      },
      { role: "user", content: query },
    ],
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");

  return {
    stepBack: parsed.stepBack ?? "",
    rewritten: parsed.rewritten ?? query,
    // Guard against the model returning more/fewer than 3.
    subQueries: Array.isArray(parsed.subQueries)
      ? parsed.subQueries.slice(0, 3)
      : [],
  };
}

export async function hydeDocument(query: string) {
  const PROMPT = `
      You are an expert writer. Write a concise, factual passage (3-5 sentences) that directly answers " +
      "the user's question, as if it were an excerpt from a relevant reference document. " +
      "Write confidently in a neutral, encyclopedic tone. Do not add disclaimers or say you are unsure.

      user query
      ${query}
     `;
  const completion = await openai.responses.create({
    model: CHAT_MODEL,
    input: PROMPT,
  });

  return completion.output_text ?? "";
}

export async function reciprocalRankFusion(
  rankedLists: {
    label: string;
    hits: ScoredPineconeRecord<RecordMetadata>[];
  }[],
  k = 60,
) {
  const fused = new Map();

  for (const { label, hits } of rankedLists) {
    hits.forEach((h, index) => {
      const rank = index + 1;
      const contribution = 1 / (k + rank);
      const existing = fused.get(h.id);

      if (existing) {
        existing.rrfScore += contribution;
        existing.bestScore = Math.max(existing.bestScore, h.score ?? 0);
        existing.matchedBy.push(label);
      } else {
        fused.set(h.id, {
          id: h.id,
          text: h.metadata?.text ?? "",
          source: h.metadata?.source ?? null,
          chunkIndex: h.metadata?.chunkIndex ?? null,
          bestScore: h.score ?? 0,
          rrfScore: contribution,
          matchedBy: [label],
        });
      }
    });
  }

  return [...fused.values()].sort((a, b) => b.rrfScore - a.rrfScore);
}
