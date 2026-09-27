import { api } from "@/lib/api/client";
import {
  CreateConversationOutputSchema,
  CreateConversationVariables,
  DeleteConversation,
  GetConversationOutputSchema,
  GetMessageInputSchema,
  GetMessageOutputSchema,
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


export async function getMessages({workspaceId, conversationId}: GetMessageInputSchema) {
    return api<GetMessageOutputSchema[]>(`/workspaces/${workspaceId}/conversation/${conversationId}/messages`)
}
