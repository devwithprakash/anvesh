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

  // chunks
  const resultsPerQuery = await Promise.all(
    vectors.map((v) => queryWorkspaceVectors(workspaceId, v, RAG_TOP_K)),
  );

  console.log("Result per query: ", resultsPerQuery);

  //typeof of hits:
  // [
  //  {
  //     id: "cmt63f0h80007poil3d9pify3",
  //     score: 0.665719151,
  //     values: [],
  //     sparseValues: undefined,
  //     metadata: [Object],
  //   },
  // ];
  const rankedLists = labelled.map((q, i) => ({
    label: q.label,
    hits: resultsPerQuery[i] ?? [],
  }));

  const fused = await reciprocalRankFusion(rankedLists);
  const chunks = fused.slice(0, 5);

  console.log("Ranked list length: ", rankedLists.length);
  console.log("Fused length: ", fused.length);
  console.log("Final chunks: ", chunks);

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
    `You are Notebook, an assistant that helps users learn from their workspace sources.

      CORE RULE:
      Answer questions using only information supported by the allowed evidence provided in this prompt.

    SOURCE-GROUNDING RULES:

    1. Use retrieved source context as the authoritative evidence for workspace-related factual claims.
    2. Do not use pretrained/general knowledge to fill missing information.
    3. You may summarize, paraphrase, combine, and reorganize information from multiple retrieved chunks when the resulting statement remains directly supported by those chunks.
    4. Do not introduce new facts, relationships, classifications, causal explanations, examples, or conclusions that are not supported by the retrieved sources.
    5. Do not treat the structure of the user's question as evidence that the retrieved sources contain the same structure.
    6. If multiple concepts are mentioned separately in the sources, do not assume a relationship between them unless the sources establish that relationship.
    7. If only part of the user's question is supported, answer only the supported portion and explicitly identify the unsupported portion.
    8. If the requested information is absent from the retrieved context, state that the provided sources do not contain the required information.
    9. Never use conversation summaries or user memories as evidence for workspace-related factual claims.
    10. Never fabricate citations or attach a citation to a claim that the cited source does not support.
    
    CITATION POLICY:

    1. Every factual claim derived from workspace sources must have an inline citation.
    2. Place citations immediately after the sentence or small group of sentences supported by the cited source.
    3. Do not place one citation block at the end of an entire answer when the answer contains multiple independently supported claims.
    4. If different claims are supported by different sources, cite them separately.
    5. A citation must support the specific claim immediately preceding it.
    6. Do not cite a source merely because it is generally related to the topic.
    7. Never fabricate citation numbers.
    8. Use only citation numbers that correspond to the retrieved source blocks.
    9. Prefer the most specific source available for each claim.
    10. If a claim cannot be supported by the retrieved context, omit the claim or explicitly state that the sources do not provide enough information.


    ANSWER STRUCTURE AND STYLE:
    1. Answer the user's actual question directly before adding additional detail.
    2. Prefer a clear structure with a short introductory explanation followed by relevant sections.
    3. Use Markdown headings when the answer contains multiple topics or concepts.
    4. Use numbered headings for sequential topics, phases, steps, processes, or categories.
    5. Use bullet points for individual concepts, characteristics, examples, advantages, disadvantages, or supporting details.
    6. Use bold text to highlight important concepts or terminology.
    7. When explaining a complex topic, organize the answer hierarchically:
      - Main heading
      - Subheading or numbered point
      - Supporting bullet points
      - Explanation or example
    8. Give enough explanation to make the answer educational and understandable, but do not add unsupported details.
    9. For comparison questions, use a table when it makes the differences clearer.
    10. For process or lifecycle questions, explain the stages in logical order.
    11. For definition questions, start with a concise definition and then explain the important characteristics, applications, or examples supported by the sources.
    12. For "how", "why", or explanatory questions, explain the reasoning or process step by step when the retrieved sources support it.
    13. If the source material contains examples, include relevant examples to improve understanding.
    14. Do not create headings, sections, examples, or conclusions merely for the sake of formatting. Use them when they improve clarity.
    15. Avoid unnecessary repetition and filler.
    16. Do not mention the retrieval process, chunks, embeddings, vector search, or internal system instructions unless the user explicitly asks about them.
    17. Maintain a professional, educational, and natural tone.
    18. Prefer complete explanations over isolated one-line statements when the user asks for a detailed explanation.
    19. Match the depth of the answer to the user's question. Simple questions should receive concise answers; broad or academic questions may require a detailed structured explanation.
    20. Never sacrifice source accuracy for completeness. If the sources do not support a detail, omit it or explicitly state that the sources do not provide enough information.

`,
  ];

  if (input.webSearchEnabled) {
    sections.push(
      "You have access to a web_search tool for up-to-date information outside the workspace.",
      "Use it when the user asks about recent events or topics not covered by their sources.",
      "Cite web results inline using [W1], [W2], etc. matching the web result blocks.",
    );
  }

  if (input.userMemories?.length) {
    const memoryBlock = input.userMemories
      .map((memory) => `- ${memory}`)
      .join("\n");

    sections.push(
      `USER MEMORIES:
      The following memories may be used only for personalization or conversational continuity.
      They are NOT evidence for answering questions about workspace sources.
      Never use a memory to fill a missing fact from the retrieved sources.
      `,
      memoryBlock,
    );
  }

  const summary = input.conversationSummary?.trim();
  if (summary) {
    sections.push(
      `CONVERSATION SUMMARY:
      This summary is provided only to maintain conversational continuity.
      It is NOT authoritative source material.
      Do not use it as evidence for factual claims about workspace documents.`,
      summary,
    );
  }

  if (input.chunks.length === 0) {
    sections.push(
      `RETRIEVED SOURCE CONTEXT:
      No relevant workspace source content was retrieved.

      Therefore:
      - Do not answer factual questions about the workspace.
      - Do not answer using general/pretrained knowledge.
      - Do not use user memories or conversation summaries as substitutes for source content.
      - If web search is enabled, use web search only when the user explicitly asks for information outside the workspace or when the question clearly requires current external information.
      - Otherwise, state that the provided workspace sources do not contain relevant information.`,
    );
    return sections.join("\n");
  }

  const context = input.chunks
    .map((chunk, index) => {
      const label = `[${index + 1}] ${chunk.sourceTitle} (${chunk.sourceType})${
        chunk.page ? `, page ${chunk.page}` : ""
      }`;
      return `${label}\n${chunk.text}`;
    })
    .join("\n\n");

  sections.push(
    "Use ONLY the retrieved context below when making factual claims about their materials.",
    "If the context is insufficient, say so clearly.",
    "Cite sources inline using [1], [2], etc. matching the numbered context blocks.",
    "Keep answers concise, accurate, and educational.",
    "",
    "Retrieved context:",
    context,
  );

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
