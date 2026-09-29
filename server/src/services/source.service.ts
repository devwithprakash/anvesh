import { uploadFileToCloudinary } from "../lib/cloudinary.js";
import { scrapeWebsite } from "../lib/external/firecrawl.js";
import { enqueueSourceProcessing } from "../lib/events/source-events.js";
import { fetchYoutubeTranscript } from "../lib/youtube.js";
import {
  createSourceRecord,
  deleteSourceRecord,
  findSourceByIdAndWorkspaceId,
  findSourcesByWorkspaceId,
  type SourceRecord,
} from "../repositories/source.repository.js";
import { NotFoundError } from "../types/app-error.js";
import type {
  CreateSourceInput,
  ImportWebsiteInput,
  ImportYoutubeInput,
  ListSourcesQuery,
} from "../validators/source.validator.js";
import { getWorkspaceByIdForUser } from "./workspace.service.js";
import {
  getFreePlan,
  getPlanById,
  getSubscriptionByUserId,
} from "../repositories/workspace.repository.js";

async function assertWorkspaceAccess(workspaceId: string, userId: string) {
  await getWorkspaceByIdForUser(workspaceId, userId);
}

async function createAndProcessSource(
  data: Parameters<typeof createSourceRecord>[0],
  userId: string,
) {
  const subscription = await getSubscriptionByUserId(userId);

  const plan = subscription
    ? await getPlanById(subscription.planId)
    : await getFreePlan();

  if (!plan) {
    throw new Error("Plan not found");
  }

  const source = await createSourceRecord(data, plan.maxSourcesPerWorkspace);

  await enqueueSourceProcessing({
    sourceId: source.id,
    workspaceId: source.workspaceId,
  });

  return source;
}

export async function listSourcesForWorkspace(
  workspaceId: string,
  userId: string,
  filters: ListSourcesQuery = {},
) {
  await assertWorkspaceAccess(workspaceId, userId);
  return findSourcesByWorkspaceId(workspaceId, filters);
}

export async function getSourceForWorkspace(
  workspaceId: string,
  sourceId: string,
  userId: string,
): Promise<SourceRecord> {
  await assertWorkspaceAccess(workspaceId, userId);

  const source = await findSourceByIdAndWorkspaceId(sourceId, workspaceId);

  if (!source) {
    throw new NotFoundError("Source not found");
  }

  return source;
}

export async function deleteSourceForWorkspace(
  workspaceId: string,
  sourceId: string,
  userId: string,
) {
  await getSourceForWorkspace(workspaceId, sourceId, userId);
  await deleteSourceRecord(sourceId);
}

export async function bulkDeleteSourcesForWorkspace(
  workspaceId: string,
  userId: string,
  sourceIds: string[],
) {
  await assertWorkspaceAccess(workspaceId, userId);

  for (const sourceId of sourceIds) {
    await deleteSourceForWorkspace(workspaceId, sourceId, userId);
  }
}

export async function createTextOrMarkdownSource(
  workspaceId: string,
  userId: string,
  input: CreateSourceInput,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  return createAndProcessSource(
    {
      workspaceId,
      type: input.type,
      title: input.title,
      content: input.content,
      status: "PENDING",
    },
    userId,
  );
}

export async function uploadFileSource(
  workspaceId: string,
  userId: string,
  file: Express.Multer.File,
  title?: string,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  const upload = await uploadFileToCloudinary(file.buffer, file.originalname);

  const extension = file.originalname
    .toLowerCase()
    .slice(file.originalname.lastIndexOf("."));

  const sourceType =
    extension === ".pdf" ? "PDF" : extension === ".md" ? "MARKDOWN" : "TEXT";

  const originalNameWithoutExtension = file.originalname.replace(
    /\.[^/.]+$/,
    "",
  );

  return createAndProcessSource(
    {
      workspaceId,
      type: sourceType,
      title: title?.trim() || originalNameWithoutExtension,
      content: null,
      status: "PENDING",
      metadata: {
        fileUrl: upload.secureUrl,
        fileName: upload.originalFileName,
        fileSize: upload.bytes,
        publicId: upload.publicId,
        resourceType: upload.resourceType,
      },
    },
    userId,
  );
} 

export async function importWebsiteSource(
  workspaceId: string,
  userId: string,
  input: ImportWebsiteInput,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  const scraped = await scrapeWebsite(input.url);

  return createAndProcessSource(
    {
      workspaceId,
      type: "WEBSITE",
      title: input.title || scraped.title || input.url,
      content: scraped.markdown,
      url: scraped.sourceUrl,
      status: "PENDING",
      metadata: {
        importedFrom: scraped.sourceUrl,
      },
    },
    userId,
  );
}

export async function importYoutubeSource(
  workspaceId: string,
  userId: string,
  input: ImportYoutubeInput,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  const transcript = await fetchYoutubeTranscript(input.url);

  return createAndProcessSource(
    {
      workspaceId,
      type: "YOUTUBE",
      title: input.title || `YouTube: ${transcript.videoId}`,
      content: transcript.content,
      url: input.url,
      status: "PENDING",
      metadata: {
        videoId: transcript.videoId,
      },
    },
    userId,
  );
}
