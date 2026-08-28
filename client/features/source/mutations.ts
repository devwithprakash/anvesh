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
  UploadWebisteInput,
  UploadYoutubeInput,
} from "./types";

export function useUploadPdfSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, title, formData }: UploadPdfSource) =>
      uploadPdfSource({ workspaceId, title, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });
    },
  });
}

export function useUploadWebisteSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: UploadWebisteInput) =>
      uploadWebsiteSource({ workspaceId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });
    },
  });
}

export function useUploadYoutubeSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, data }: UploadYoutubeInput) =>
      uploadYoutubeSource({ workspaceId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });
    },
  });
}

export function useDeleteSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceId, sourceId }: DeleteSource) =>
      deleteSource({ workspaceId, sourceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });
    },
  });
}
