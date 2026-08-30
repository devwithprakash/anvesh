import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSource,
  uploadPdfSource,
  uploadWebsiteSource,
  uploadYoutubeSource,
} from "./api";
import {
  DeleteSource,
  UploadPdfSource,
  UploadWebsiteInput,
  UploadYoutubeInput,
} from "./types";

export function useUploadPdfSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, title, formData }: UploadPdfSource) =>
      uploadPdfSource({ workspaceId, title, formData }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sources", variables.workspaceId],
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
        queryKey: ["sources", variables.workspaceId],
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
        queryKey: ["sources", variables.workspaceId],
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
        queryKey: ["sources", variables.workspaceId],
      });
    },
  });
}
