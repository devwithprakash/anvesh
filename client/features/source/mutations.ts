import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadPdfSource } from "./api";
import { UploadPdfSource } from "./types";

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
