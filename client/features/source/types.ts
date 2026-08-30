export type UploadPdfSource = {
  workspaceId: string;
  title?: string;
  formData: FormData;
};


export type ExternalSource = {
  url: string;
  title?: string;
};

export type UploadWebsiteInput = {
  workspaceId: string;
  data: ExternalSource;
};

export type UploadYoutubeInput = {
  workspaceId: string;
  data: ExternalSource;
};

export type GetSources = {
  workspaceId: string
}

export type SourceType = "PDF" | "WEBSITE" | "YOUTUBE" | "TEXT" | "MARKDOWN";

export type SourceStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export interface SourceMetadata {
  videoId?: string;
  indexedAt?: string;
  chunkCount?: number;
  [key: string]: unknown;
}

export interface Source {
  id: string;
  workspaceId: string;
  type: SourceType;
  title: string;
  content: string;
  url: string;
  status: SourceStatus;
  metadata: SourceMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteSource {
    workspaceId: string;
    sourceId: string
}
