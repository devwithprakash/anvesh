import type { Express } from "express";
import workspaceRoutes from "./workspace.routes.js";
import { sourceRoutes } from "./source.routes.js";
import { conversationRoutes } from "./conversation.routes.js";

export function registerRoutes(app: Express): void {
  // /api/workspaces/:workspaceId/sources
  workspaceRoutes.use("/:workspaceId/sources", sourceRoutes);
  conversationRoutes.use("/:workspaceId/conversation", conversationRoutes);
  app.use("/api/workspaces", workspaceRoutes);
}
