import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConversation, deleteConversation, streamChat } from "./api";
import { DeleteConversation, StreamChatSchema } from "./types";

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

export function useStreamChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, chatData }: StreamChatSchema) =>
      streamChat({ workspaceId, chatData }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}
