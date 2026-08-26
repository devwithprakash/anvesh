import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, deleteWorkspace } from "./api";
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

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => deleteWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
}
