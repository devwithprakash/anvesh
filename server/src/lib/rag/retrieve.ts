import type {
  RecordMetadata,
  ScoredPineconeRecord,
} from "@pinecone-database/pinecone";
import { CHAT_MODEL, RAG_MIN_SCORE, RAG_TOP_K } from "../ai/ai-config.js";
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

  console.log("Stepback: ", stepBack)
  console.log("rewritten: ", rewritten)
  console.log("sub queries: ", subQueries)
  console.log("Hyde: ", hyde)

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
  const chunks = fused
    .slice(0, 5)
    .filter((chunk) => chunk.bestScore >= RAG_MIN_SCORE);


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
    `You are ANVESH, a research assistant that helps users learn from their workspace sources.

=== WORKSPACE GROUNDING ===

- Use ONLY information from the RETRIEVED WORKSPACE CONTEXT below to answer factual questions.
- Do NOT use your general training knowledge to fill gaps.
- Do NOT introduce facts, examples, or conclusions not present in the retrieved context.
- If the workspace context does not contain enough information, say so clearly.

=== MEMORY & CONVERSATION SUMMARY ===

- User memories and conversation summaries are for conversational continuity only.

=== ANSWER STYLE ===

- Answer the user's actual question clearly and naturally.
- Use bullet points and **bold** labels where they aid readability.`,
  ];

  if (input.webSearchEnabled) {
    sections.push(`=== WEB SEARCH ===

You have access to the web_search tool for external or up-to-date information.

Use web search when:
- The user explicitly asks for current/recent/external information.
- The workspace context is insufficient to answer.

Do not silently use web search to fill missing workspace information.`);
  }

  if (input.userMemories?.length) {
    const memoryBlock = input.userMemories
      .map((memory) => `- ${memory}`)
      .join("\n");

    sections.push(`=== USER MEMORIES (personalisation only — NOT evidence) ===

${memoryBlock}`);
  }

  const summary = input.conversationSummary?.trim();

  if (summary) {
    sections.push(`=== CONVERSATION SUMMARY (continuity only — NOT evidence) ===

${summary}`);
  }

  if (input.chunks.length === 0) {
    if (input.webSearchEnabled) {
      sections.push(`=== RETRIEVED WORKSPACE CONTEXT ===

No relevant workspace content was retrieved.

You have access to the web_search tool.
If the user's question requires external information, you MUST call web_search before answering.
Do NOT answer from general knowledge without using web_search first.`);
    } else {
      sections.push(`=== RETRIEVED WORKSPACE CONTEXT ===

No relevant workspace content was retrieved.

Respond ONLY with:
"I couldn't find enough information about this in the provided workspace sources."

Do not add any other sentence, explanation, background, or examples.`);
    }

    return sections.join("\n\n");
  }

  const context = input.chunks
    .map((chunk, index) => {
      const label =
        `SOURCE ${index + 1}: ${chunk.sourceTitle} (${chunk.sourceType})` +
        `${chunk.page ? `, page ${chunk.page}` : ""}`;

      return `--- ${label} ---\n${chunk.text}\n---`;
    })
    .join("\n\n");

  sections.push(`=== RETRIEVED WORKSPACE CONTEXT ===

Use the sources below as the only authoritative evidence.

${context}`);

  return sections.join("\n\n");
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
          sourceId: h.metadata?.sourceId ?? null,
          sourceTitle: h.metadata?.sourceTitle ?? "",
          sourceType: h.metadata?.sourceType ?? "",
          chunkId: h.metadata?.chunkId ?? null,
          chunkIndex: h.metadata?.chunkIndex ?? null,
          page: h.metadata?.page ?? undefined,
          bestScore: h.score ?? 0,
          rrfScore: contribution,
          matchedBy: [label],
        });
      }
    });
  }

  return [...fused.values()].sort((a, b) => b.rrfScore - a.rrfScore);
}
