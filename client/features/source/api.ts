import { api } from "@/lib/api/client";
import {
  DeleteSource,
  Source,
  UploadPdfSource,
  UploadWebsiteInput,
  UploadYoutubeInput,
} from "./types";

export async function uploadPdfSource({
  workspaceId,
  formData,
}: UploadPdfSource) {
  return api(`/workspaces/${workspaceId}/sources/upload`, {
    method: "POST",
    data: formData,
  });
}

export async function uploadWebsiteSource({
  workspaceId,
  data,
}: UploadWebsiteInput) {
  return api(`/workspaces/${workspaceId}/sources/import/website`, {
    method: "POST",
    data,
  });
}

export async function uploadYoutubeSource({
  workspaceId,
  data,
}: UploadYoutubeInput) {
  return api(`/workspaces/${workspaceId}/sources/import/youtube`, {
    method: "POST",
    data,
  });
}

export async function getSources(workspaceId: string) {
  return api<Source[]>(`/workspaces/${workspaceId}/sources`);
}

export async function deleteSource({ workspaceId, sourceId }: DeleteSource) {
  return api(`/workspaces/${workspaceId}/sources/${sourceId}`, {
    method: "DELETE",
  });
}
