import { api } from "@/lib/api/client";
import { UploadPdfSource } from "./types";

export async function uploadPdfSource({
  workspaceId,
  formData,
}: UploadPdfSource) {

  return api(`/workspaces/${workspaceId}/sources/upload`, {
    method: "POST",
    data: formData,
  });
}
