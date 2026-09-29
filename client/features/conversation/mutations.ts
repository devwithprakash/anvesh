import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createConversation, deleteConversation } from './api';
import { CreateConversationVariables, DeleteConversation } from './types';

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: CreateConversationVariables) =>
      createConversation({ workspaceId, data }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', variables.workspaceId],
      });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteConversation) => deleteConversation(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['conversations', variables.workspaceId],
      });
    },

    onError: error => {
      console.error('Failed to delete conversation:', error);
    },
  });
}
