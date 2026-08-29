import { useQuery } from "@tanstack/react-query";
import { getConversations } from "./api";
import { GetConversationOutputSchema } from "./types";

export function useConversations(workspaceId: string) {
  return useQuery<GetConversationOutputSchema[]>({
    queryKey: ["conversations", workspaceId],
    queryFn: () => getConversations(workspaceId),
    enabled: !!workspaceId,
  });
} 