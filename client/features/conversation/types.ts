import { UIMessage } from "ai";

export type CreateConversation = {
  title?: string;
};

export type CreateConversationVariables = {
  workspaceId: string;
  data?: CreateConversation;
};

export type CreateConversationOutputSchema = {
  id: string;
  workspaceId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type GetConversationOutputSchema = {
  id: string;
  workspaceId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type DeleteConversation = {
  workspaceId: string;
  conversationId: string;
};

export type ChatSchema = {
  conversationId: string;
  messages: UIMessage[];
  model: "gpt-4o-mini" | "gpt-4o";
  webSearch: boolean;
};

export interface StreamChatSchema {
  workspaceId: string;
  chatData: ChatSchema;
}

export interface GetMessageInputSchema {
  workspaceId: string;
  conversationId: string;
}

export interface Citation {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceType: string;
  chunkId?: string;
  chunkIndex?: number;
  page?: number;
  excerpt?: string;
  score?: number;
  url?: string;
}

export interface GetMessageOutputSchema {
  id: string;
  createdAt: Date;
  conversationId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  citations: Citation[];
}
