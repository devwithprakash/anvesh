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
  conversationId: string
}