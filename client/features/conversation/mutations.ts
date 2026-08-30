import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation, deleteConversation } from "./api";
import { DeleteConversation } from "./types";

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteConversation) => deleteConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
