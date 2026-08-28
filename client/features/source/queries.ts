import { useQuery } from "@tanstack/react-query";
import { getSources } from "./api";

export function useSources(workspaceId: string) {
  return useQuery({
    queryKey: ["sources"],
    queryFn: () => getSources(workspaceId),
    enabled: !!workspaceId,
  });
}
