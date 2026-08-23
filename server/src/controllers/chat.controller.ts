import type { Request, Response } from "express";
import { workspaceIdParamSchema } from "../validators/workspace.validator.js";
import {
  chatBodySchema,
  conversationIdParamSchema,
  createConversationSchema,
} from "../validators/chat.validator.js";
import {
  createConversationForWorkspace,
  deleteConversationForWorkspace,
  getConversationMessagesForWorkspace,
  listConversationsForWorkspace,
  streamWorkspaceChat,
} from "../services/chat.service.js";
import type { UIMessage } from "ai";

export async function createConversation(req: Request, res: Response) {
  const { workspaceId } = workspaceIdParamSchema.parse(req.params);

  const input = createConversationSchema.parse(req.body ?? {});

  const conversation = await createConversationForWorkspace(
    workspaceId,
    req.session.user.id,
    input.title,
  );

  res.status(201).json(conversation);
}

export async function listConversation(req: Request, res: Response) {
  const { workspaceId } = workspaceIdParamSchema.parse(req.params);

  const conversations = await listConversationsForWorkspace(
    workspaceId,
    req.session.user.id,
  );

  res.json(conversations);
}

export async function listConversationMessages(req: Request, res: Response) {
  const { conversationId, workspaceId } = conversationIdParamSchema.parse(
    req.params,
  );

  const messages = await getConversationMessagesForWorkspace(
    workspaceId,
    conversationId,
    req.session.user.id,
  );

  res.json(messages);
}

export async function deleteConversation(req: Request, res: Response) {
  const { workspaceId, conversationId } = conversationIdParamSchema.parse(
    req.params,
  );

  await deleteConversationForWorkspace(
    workspaceId,
    conversationId,
    req.session.user.id,
  );

  res.status(204).send();
}

export async function streamChat(req: Request, res: Response) {
  const { workspaceId } = workspaceIdParamSchema.parse(req.params);
  const body = chatBodySchema.parse(req.body);

  await streamWorkspaceChat(res, workspaceId, req.session.user.id, {
    messages: body.messages as unknown as UIMessage[],

    ...(body.conversationId !== undefined && {
      conversationId: body.conversationId,
    }),

    ...(body.model !== undefined && {
      model: body.model,
    }),

    ...(body.webSearch !== undefined && {
      webSearch: body.webSearch,
    }),
  });
}
