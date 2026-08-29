import { api } from "@/lib/api/client";
import {
  CreateConversationOutputSchema,
  CreateConversationVariables,
  DeleteConversation,
  GetConversationOutputSchema,
  StreamChatSchema,
} from "./types";

export async function createConversation({
  workspaceId,
  data,
}: CreateConversationVariables) {
  return api<CreateConversationOutputSchema>(
    `/workspaces/${workspaceId}/conversation`,
    {
      method: "POST",
      data,
    },
  );
}

export async function getConversations(workspaceId: string) {
  return api<GetConversationOutputSchema[]>(
    `/workspaces/${workspaceId}/conversation`,
  );
}

export async function deleteConversation({
  workspaceId,
  conversationId,
}: DeleteConversation) {
  return api(`/workspaces/${workspaceId}/conversation/${conversationId}`, {
    method: "DELETE",
  });
}

export async function streamChat({ workspaceId, chatData }: StreamChatSchema) {
  return api(`/workspaces/${workspaceId}/chat`, {
    method: "POST",
    data: chatData,
  });
}
