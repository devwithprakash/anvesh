// Mock data for UI development - no API integration

export type SourceType = "PDF" | "WEBSITE" | "YOUTUBE" | "TEXT" | "MARKDOWN";
export type SourceStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export interface Workspace {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  defaultModel: string;
  createdAt: string;
  sourceCount?: number;
  conversationCount?: number;
}

export interface Conversation {
  id: string;
  workspaceId: string;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  citations?: Citation[];
  createdAt: string;
}

export interface Citation {
  sourceId: string;
  sourceTitle: string;
  sourceType: SourceType;
  chunkIndex: number;
  text: string;
}

export interface Source {
  id: string;
  workspaceId: string;
  type: SourceType;
  title: string;
  content?: string;
  url?: string;
  status: SourceStatus;
  createdAt: string;
}

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: "ws-1",
    title: "AI Research Papers",
    description: "Collection of papers on LLMs, transformers, and RAG systems",
    icon: "🧠",
    defaultModel: "gpt-4o-mini",
    createdAt: "2026-08-20T10:00:00Z",
    sourceCount: 8,
    conversationCount: 12,
  },
  {
    id: "ws-2",
    title: "Product Roadmap",
    description: "Q4 product strategy and planning documents",
    icon: "🗺️",
    defaultModel: "gpt-4o",
    createdAt: "2026-08-22T14:30:00Z",
    sourceCount: 3,
    conversationCount: 5,
  },
  {
    id: "ws-3",
    title: "History of Rome",
    description: "Books and articles about ancient Roman history",
    icon: "🏛️",
    defaultModel: "gpt-4o-mini",
    createdAt: "2026-08-24T09:15:00Z",
    sourceCount: 6,
    conversationCount: 3,
  },
  {
    id: "ws-4",
    title: "Legal Documents",
    description: "Contracts and legal review materials",
    icon: "⚖️",
    defaultModel: "gpt-4o",
    createdAt: "2026-08-25T11:00:00Z",
    sourceCount: 2,
    conversationCount: 1,
  },
];

export const MOCK_CONVERSATIONS: Record<string, Conversation[]> = {
  "ws-1": [
    {
      id: "conv-1",
      workspaceId: "ws-1",
      title: "How does RAG work?",
      createdAt: "2026-08-25T15:00:00Z",
      updatedAt: "2026-08-25T15:30:00Z",
    },
    {
      id: "conv-2",
      workspaceId: "ws-1",
      title: "Transformer architecture explained",
      createdAt: "2026-08-24T10:00:00Z",
      updatedAt: "2026-08-24T11:00:00Z",
    },
    {
      id: "conv-3",
      workspaceId: "ws-1",
      title: "Fine-tuning vs prompt engineering",
      createdAt: "2026-08-23T09:00:00Z",
      updatedAt: "2026-08-23T09:45:00Z",
    },
    {
      id: "conv-4",
      workspaceId: "ws-1",
      title: "Vector databases comparison",
      createdAt: "2026-08-22T14:00:00Z",
      updatedAt: "2026-08-22T15:00:00Z",
    },
  ],
  "ws-2": [
    {
      id: "conv-5",
      workspaceId: "ws-2",
      title: "Q4 priorities and OKRs",
      createdAt: "2026-08-25T10:00:00Z",
      updatedAt: "2026-08-25T10:45:00Z",
    },
    {
      id: "conv-6",
      workspaceId: "ws-2",
      title: "Feature prioritization framework",
      createdAt: "2026-08-23T16:00:00Z",
      updatedAt: "2026-08-23T17:00:00Z",
    },
  ],
  "ws-3": [
    {
      id: "conv-7",
      workspaceId: "ws-3",
      title: "Fall of the Roman Republic",
      createdAt: "2026-08-25T08:00:00Z",
      updatedAt: "2026-08-25T09:00:00Z",
    },
  ],
  "ws-4": [
    {
      id: "conv-8",
      workspaceId: "ws-4",
      title: "Contract review session",
      createdAt: "2026-08-25T12:00:00Z",
      updatedAt: "2026-08-25T12:30:00Z",
    },
  ],
};

export const MOCK_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      role: "USER",
      content: "Can you explain how Retrieval-Augmented Generation (RAG) works?",
      createdAt: "2026-08-25T15:00:00Z",
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      role: "ASSISTANT",
      content: `Retrieval-Augmented Generation (RAG) is a technique that enhances large language models by allowing them to access external knowledge at inference time.

**How it works:**

1. **Indexing Phase**: Your documents are split into chunks, converted to vector embeddings, and stored in a vector database like Pinecone.

2. **Retrieval Phase**: When you ask a question, the query is also embedded and the most semantically similar chunks are retrieved from the vector database.

3. **Generation Phase**: The retrieved chunks are injected into the LLM's context window as additional context, allowing it to generate accurate, grounded responses.

**Key Benefits:**
- Reduces hallucinations by grounding responses in actual documents
- Allows LLMs to access up-to-date or private information
- More cost-effective than fine-tuning for knowledge-intensive tasks

The system you're using right now implements advanced RAG with query rewriting, HyDE (Hypothetical Document Embeddings), and Reciprocal Rank Fusion for better retrieval quality.`,
      citations: [
        {
          sourceId: "src-1",
          sourceTitle: "Attention Is All You Need",
          sourceType: "PDF",
          chunkIndex: 3,
          text: "The transformer architecture uses self-attention mechanisms to process sequences in parallel...",
        },
        {
          sourceId: "src-2",
          sourceTitle: "RAG Survey 2024",
          sourceType: "PDF",
          chunkIndex: 7,
          text: "Retrieval-augmented generation combines parametric and non-parametric memory...",
        },
      ],
      createdAt: "2026-08-25T15:01:00Z",
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      role: "USER",
      content:
        "What are the main challenges with RAG systems in production?",
      createdAt: "2026-08-25T15:10:00Z",
    },
    {
      id: "msg-4",
      conversationId: "conv-1",
      role: "ASSISTANT",
      content: `Production RAG systems face several important challenges:

**1. Retrieval Quality**
- Semantic search can miss exact matches or domain-specific terminology
- Chunk size and overlap affect context quality significantly
- Multi-hop reasoning requires retrieving from multiple chunks

**2. Latency**
- Embedding queries and searching vector databases adds overhead
- Advanced techniques like query rewriting multiply API calls

**3. Context Window Management**
- Retrieved chunks compete with conversation history for context space
- Long conversations require summarization strategies

**4. Evaluation**
- Hard to measure retrieval quality without ground truth
- End-to-end evaluation requires human judgment

**5. Data Freshness**
- Re-indexing updated documents is costly
- Incremental updates can leave stale vectors

The current system addresses several of these with conversation summarization (every 8 messages) and Reciprocal Rank Fusion across multiple query variants.`,
      citations: [
        {
          sourceId: "src-3",
          sourceTitle: "Production ML Systems",
          sourceType: "WEBSITE",
          chunkIndex: 12,
          text: "Latency in retrieval pipelines is a primary concern for user-facing applications...",
        },
      ],
      createdAt: "2026-08-25T15:11:00Z",
    },
  ],
  "conv-2": [
    {
      id: "msg-5",
      conversationId: "conv-2",
      role: "USER",
      content: "Explain the transformer architecture to me.",
      createdAt: "2026-08-24T10:00:00Z",
    },
    {
      id: "msg-6",
      conversationId: "conv-2",
      role: "ASSISTANT",
      content: `The Transformer architecture, introduced in "Attention Is All You Need" (Vaswani et al., 2017), revolutionized NLP by replacing recurrent networks with self-attention.

**Core Components:**

- **Multi-Head Self-Attention**: Allows the model to attend to different positions simultaneously across multiple representation subspaces
- **Feed-Forward Networks**: Applied position-wise after attention layers
- **Positional Encoding**: Injects sequence order information since attention is permutation-invariant
- **Layer Normalization**: Stabilizes training

The encoder-decoder structure processes input sequences to produce output sequences, which is the basis for most modern LLMs.`,
      createdAt: "2026-08-24T10:01:30Z",
    },
  ],
};

export const MOCK_SOURCES: Record<string, Source[]> = {
  "ws-1": [
    {
      id: "src-1",
      workspaceId: "ws-1",
      type: "PDF",
      title: "Attention Is All You Need",
      status: "READY",
      createdAt: "2026-08-20T10:00:00Z",
    },
    {
      id: "src-2",
      workspaceId: "ws-1",
      type: "PDF",
      title: "RAG Survey 2024",
      status: "READY",
      createdAt: "2026-08-20T10:05:00Z",
    },
    {
      id: "src-3",
      workspaceId: "ws-1",
      type: "WEBSITE",
      title: "Production ML Systems",
      url: "https://eugeneyan.com/writing/llm-patterns/",
      status: "READY",
      createdAt: "2026-08-21T09:00:00Z",
    },
    {
      id: "src-4",
      workspaceId: "ws-1",
      type: "YOUTUBE",
      title: "Andrej Karpathy: Let's build GPT",
      url: "https://youtube.com/watch?v=kCc8FmEb1nY",
      status: "READY",
      createdAt: "2026-08-22T11:00:00Z",
    },
    {
      id: "src-5",
      workspaceId: "ws-1",
      type: "TEXT",
      title: "Research Notes",
      status: "READY",
      createdAt: "2026-08-23T14:00:00Z",
    },
    {
      id: "src-6",
      workspaceId: "ws-1",
      type: "PDF",
      title: "BERT: Pre-training of Deep Bidirectional Transformers",
      status: "PROCESSING",
      createdAt: "2026-08-25T22:00:00Z",
    },
    {
      id: "src-7",
      workspaceId: "ws-1",
      type: "WEBSITE",
      title: "Pinecone RAG Guide",
      url: "https://pinecone.io/learn/rag",
      status: "PENDING",
      createdAt: "2026-08-25T23:30:00Z",
    },
    {
      id: "src-8",
      workspaceId: "ws-1",
      type: "MARKDOWN",
      title: "Meeting Notes Q3",
      status: "FAILED",
      createdAt: "2026-08-24T16:00:00Z",
    },
  ],
  "ws-2": [
    {
      id: "src-9",
      workspaceId: "ws-2",
      type: "PDF",
      title: "Product Strategy Q4 2026",
      status: "READY",
      createdAt: "2026-08-22T09:00:00Z",
    },
    {
      id: "src-10",
      workspaceId: "ws-2",
      type: "TEXT",
      title: "OKR Framework Notes",
      status: "READY",
      createdAt: "2026-08-23T10:00:00Z",
    },
    {
      id: "src-11",
      workspaceId: "ws-2",
      type: "WEBSITE",
      title: "Competitor Analysis Blog",
      url: "https://example.com/blog",
      status: "READY",
      createdAt: "2026-08-24T11:00:00Z",
    },
  ],
  "ws-3": [
    {
      id: "src-12",
      workspaceId: "ws-3",
      type: "PDF",
      title: "SPQR: A History of Ancient Rome",
      status: "READY",
      createdAt: "2026-08-24T09:00:00Z",
    },
    {
      id: "src-13",
      workspaceId: "ws-3",
      type: "YOUTUBE",
      title: "Fall of Rome Documentary",
      url: "https://youtube.com/watch?v=example",
      status: "READY",
      createdAt: "2026-08-24T10:00:00Z",
    },
  ],
  "ws-4": [
    {
      id: "src-14",
      workspaceId: "ws-4",
      type: "PDF",
      title: "Service Agreement Draft",
      status: "READY",
      createdAt: "2026-08-25T11:00:00Z",
    },
    {
      id: "src-15",
      workspaceId: "ws-4",
      type: "PDF",
      title: "NDA Template",
      status: "READY",
      createdAt: "2026-08-25T11:05:00Z",
    },
  ],
};

export const AVAILABLE_MODELS = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini", description: "Fast & efficient" },
  { value: "gpt-4o", label: "GPT-4o", description: "Most capable" },
];

export const WORKSPACE_ICONS = [
  "🧠", "📚", "🗺️", "🏛️", "⚖️", "🔬", "💡", "🎯",
  "📊", "🚀", "🌍", "🎨", "🏗️", "📝", "🔒", "💼",
  "🌿", "⭐", "🎵", "🏋️", "🧪", "🖥️", "📱", "🤖",
];
