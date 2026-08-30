import { useQuery } from "@tanstack/react-query";
import { getConversations, getMessages } from "./api";
import { GetConversationOutputSchema, GetMessageInputSchema } from "./types";

export function useConversations(workspaceId: string) {
  return useQuery<GetConversationOutputSchema[]>({
    queryKey: ["conversations", workspaceId],
    queryFn: () => getConversations(workspaceId),
    enabled: Boolean(workspaceId),
  });
}

export function useMessages({ workspaceId, conversationId }: GetMessageInputSchema) {
  return useQuery({
    queryKey: ["messages", workspaceId, conversationId],
    queryFn: () => getMessages({ workspaceId, conversationId }),
    enabled: !!workspaceId && !!conversationId,
  });
}
