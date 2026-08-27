import { useQuery } from "@tanstack/react-query";
import { getConversations } from "./api";

export function useConversations(workspaceId: string) {
  return useQuery({
    queryKey: ["conversations", workspaceId],
    queryFn: () => getConversations(workspaceId),
    enabled: !!workspaceId,
  });
}
    