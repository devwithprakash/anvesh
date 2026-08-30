import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, deleteWorkspace } from "./api";
import { CreateWorkspaceInput } from "./types";

export const workspaceKeys = {
  all: ["workspaces"] as const,

  detail: (workspaceId: string) => ["workspace", workspaceId] as const,
};

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceInput) => createWorkspace(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.all,
      });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => deleteWorkspace(workspaceId),

    onSuccess: (_, workspaceId) => {
      // Invalidate workspace list
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.all,
      });

      // Remove deleted workspace from detail cache
      queryClient.removeQueries({
        queryKey: workspaceKeys.detail(workspaceId),
      });
    },
  });
}
