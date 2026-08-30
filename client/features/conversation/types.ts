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
  sourceId: string;
  chunkId?: string;
  content?: string;
  page?: number;
  score?: number;
}

export interface GetMessageOutputSchema {
  id: string;
  createdAt: Date;
  conversationId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  citations: Citation[];
}
