import { openai } from "@ai-sdk/openai";
import type { Response } from "express";
import { z } from "zod";
import {
  convertToModelMessages,
  createUIMessageStream,
  isStepCount,
  pipeUIMessageStreamToResponse,
  streamText,
  toUIMessageStream,
  tool,
  type UIMessage,
} from "ai";
import {
  CHAT_MODEL,
  CHAT_MODELS,
  CONVERSATION_SUMMARY_INTERVAL,
  RECENT_MESSAGE_WINDOW,
} from "../lib/ai/ai-config.js";
import { enqueueConversationSummarize } from "../lib/events/conversation-events.js";
import {
  buildChatSystemPrompt,
  retrieveWorkspaceContext,
} from "../lib/rag/retrieve.js";
import {
  createConversationRecord,
  findConversationByIdAndWorkspaceId,
  findConversationsByWorkspaceId,
  touchConversation,
  updateConversationRecord,
  deleteConversationRecord,
} from "../repositories/conversation.repository.js";
import {
  createMessageRecord,
  countMessagesByConversationId,
  findMessagesByConversationId,
} from "../repositories/message.repository.js";

import {
  formatTavilyResultsForPrompt,
  searchWeb,
  type TavilySearchResponse,
} from "../lib/external/tavily.js";
import { NotFoundError, ValidationError } from "../types/app-error.js";
import {
  buildConversationTitle,
  getLastUserMessageText,
  getTextFromUIMessage,
} from "../utils/chat-message.js";
import { getWorkspaceByIdForUser } from "./workspace.service.js";
import {
  getFreePlan,
  getPlanById,
  getSubscriptionByUserId,
  updateAiQueryUsageRecord,
} from "../repositories/workspace.repository.js";
import { logger } from "better-auth";

export async function listConversationsForWorkspace(
  workspaceId: string,
  userId: string,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);
  return findConversationsByWorkspaceId(workspaceId);
}

export async function createConversationForWorkspace(
  workspaceId: string,
  userId: string,
  title?: string,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);
  return createConversationRecord(workspaceId, title);
}

export async function getConversationMessagesForWorkspace(
  workspaceId: string,
  conversationId: string,
  userId: string,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  const conversation = await findConversationByIdAndWorkspaceId(
    conversationId,
    workspaceId,
  );

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  return findMessagesByConversationId(conversationId);
}

export async function deleteConversationForWorkspace(
  workspaceId: string,
  conversationId: string,
  userId: string,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  const conversation = await findConversationByIdAndWorkspaceId(
    conversationId,
    workspaceId,
  );

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  await deleteConversationRecord(conversationId);
}

async function resolveConversation(
  workspaceId: string,
  conversationId: string | undefined,
  firstMessage: string,
) {
  if (conversationId) {
    const existing = await findConversationByIdAndWorkspaceId(
      conversationId,
      workspaceId,
    );

    if (!existing) {
      throw new NotFoundError("Conversation not found");
    }

    return existing;
  }

  return createConversationRecord(
    workspaceId,
    buildConversationTitle(firstMessage),
  );
}

export async function streamWorkspaceChat(
  res: Response,
  workspaceId: string,
  userId: string,
  input: {
    conversationId?: string;
    messages: UIMessage[];
    model?: string;
    webSearch?: boolean;
  },
) {
  try {
    const subscription = await getSubscriptionByUserId(userId);

    const plan = subscription
      ? await getPlanById(subscription.planId)
      : await getFreePlan();

    if (!plan) throw new Error("Plan not found");

    await updateAiQueryUsageRecord(userId, plan.maxAiQueries);

    const chatModel = CHAT_MODEL;

    const webSearchEnabled =
      input.webSearch === true &&
      plan.webSearchEnabled === true &&
      !!process.env.TAVILY_API_KEY?.trim();

    const userText = getLastUserMessageText(input.messages);

    if (!userText) throw new ValidationError("A user message is required");

    // get the conversation, if not exist then first create and then get
    const conversation = await resolveConversation(
      workspaceId,
      input.conversationId,
      userText,
    );

    logger.info("AI query started", {
      workspaceId,
      conversationId: conversation.id,
      model: chatModel,
      webSearchEnabled,
    });

    await createMessageRecord({
      conversationId: conversation.id,
      role: "USER",
      content: userText,
    });

    const [retrievedChunks] = await Promise.all([
      retrieveWorkspaceContext(workspaceId, userText),
    ]);

    logger.debug("Workspace context retrieved", {
      workspaceId,
      conversationId: conversation.id,
      chunkCount: retrievedChunks.chunks.length,
    });

    const systemPrompt = buildChatSystemPrompt({
      chunks: retrievedChunks.chunks,
      conversationSummary: conversation.summary,
      webSearchEnabled,
    });

    // Limit conversation history, give only recent RECENT_MESSAGE_WINDOW=12 messages for context
    const contextMessages =
      conversation.summary && input.messages.length > RECENT_MESSAGE_WINDOW
        ? input.messages.slice(-RECENT_MESSAGE_WINDOW)
        : input.messages;

    let webSearchResults: TavilySearchResponse | null = null;

    const stream = createUIMessageStream({
      originalMessages: input.messages,
      execute: async ({ writer }) => {
        const tools = webSearchEnabled
          ? {
              web_search: tool({
                description:
                  "Search the web for up-to-date information outside the workspace sources.",
                inputSchema: z.object({
                  query: z
                    .string()
                    .describe("The search query for current web information"),
                }),
                execute: async ({ query }) => {
                  logger.info("Web search started", {
                    workspaceId,
                    conversationId: conversation.id,
                  });

                  webSearchResults = await searchWeb(query);

                  logger.debug("Web search completed", {
                    workspaceId,
                    conversationId: conversation.id,
                    resultCount: webSearchResults?.results?.length ?? 0,
                  });

                  return formatTavilyResultsForPrompt(webSearchResults);
                },
              }),
            }
          : undefined;

        const result = streamText({
          model: openai(chatModel),
          system: systemPrompt,
          messages: await convertToModelMessages(contextMessages),
          ...(tools !== undefined && { tools }),
          stopWhen: webSearchEnabled ? isStepCount(3) : undefined,
        });

        // Pipe to frontend AND drain the stream fully before continuing
        writer.merge(toUIMessageStream({ stream: result.stream }));
        await result.consumeStream(); // ✅ waits until LLM is fully done
      },

      onFinish: async ({ responseMessage, isAborted }) => {
        if (isAborted) return;

        const assistantText = getTextFromUIMessage(responseMessage).trim();
        if (!assistantText) return;

        await createMessageRecord({
          conversationId: conversation.id,
          role: "ASSISTANT",
          content: assistantText,
        });

        await touchConversation(conversation.id);

        if (!conversation.title) {
          await updateConversationRecord(conversation.id, {
            title: buildConversationTitle(userText),
          });
        }

        const messageCount = await countMessagesByConversationId(
          conversation.id,
        );

        if (messageCount % CONVERSATION_SUMMARY_INTERVAL === 0) {
          await enqueueConversationSummarize({
            conversationId: conversation.id,
            userId,
          });
        }

        logger.info("AI query completed", {
          workspaceId,
          conversationId: conversation.id,
          model: chatModel,
          webSearchUsed: webSearchResults !== null,
        });
      },
    });

    // send streamed HTTP response to frontend
    await pipeUIMessageStreamToResponse({
      response: res,
      stream,
      headers: {
        "X-Conversation-Id": conversation.id,
      },
    });
  } catch (error) {
    logger.error("AI query failed", {
      workspaceId,
      conversationId: input.conversationId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error;
  }
}
