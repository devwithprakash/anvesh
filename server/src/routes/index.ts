import type { Express } from "express";
import workspaceRoutes from "./workspace.routes.js";
import { sourceRoutes } from "./source.routes.js";
import { conversationRoutes } from "./chat.routes.js";
import { memoryRoutes } from "./memory.routes.js";

export function registerRoutes(app: Express): void {
  workspaceRoutes.use("/:workspaceId/sources", sourceRoutes);
  workspaceRoutes.use("/:workspaceId/conversation", conversationRoutes);
  workspaceRoutes.use("/:workspaceId/chat", conversationRoutes);
  app.use("/api/workspaces", workspaceRoutes);
  app.use("/api/memory", memoryRoutes);
}
