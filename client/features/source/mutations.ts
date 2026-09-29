import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  deleteSource,
  uploadFileSource,
  uploadTextSource,
  uploadWebsiteSource,
  uploadYoutubeSource,
} from './api';
import {
  DeleteSource,
  UploadFileSource,
  UploadTextInput,
  UploadWebsiteInput,
  UploadYoutubeInput,
} from './types';

export function useUploadFileSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, title, formData }: UploadFileSource) =>
      uploadFileSource({ workspaceId, title, formData }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['sources', variables.workspaceId],
      });
    },
  });
}

export function useUploadWebsiteSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: UploadWebsiteInput) =>
      uploadWebsiteSource({ workspaceId, data }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['sources', variables.workspaceId],
      });
    },
  });
}

export function useUploadYoutubeSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: UploadYoutubeInput) =>
      uploadYoutubeSource({ workspaceId, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['sources', variables.workspaceId],
      });
    },
  });
}
export function useUploadTextSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: UploadTextInput) =>
      uploadTextSource({ workspaceId, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['sources', variables.workspaceId],
      });
    },
  });
}

export function useDeleteSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, sourceId }: DeleteSource) =>
      deleteSource({ workspaceId, sourceId }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['sources', variables.workspaceId],
      });
    },
  });
}
