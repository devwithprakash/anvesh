import { api } from "@/lib/api/client";
import { CreateConversationOutputSchema, CreateConversationVariables, GetConversationOutputSchema } from "./types";

export async function createConversation({workspaceId, data}:CreateConversationVariables) {
  return api<CreateConversationOutputSchema>(`/workspaces/${workspaceId}/conversation`, {
    method: "POST",
    data
  });
}

export async function getConversations(workspaceId: string) {
    return api<GetConversationOutputSchema[]>(`/workspaces/${workspaceId}/conversation`)
}
