import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace } from "./api";
import { CreateWorkspaceInput } from "./types";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) => createWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
}
