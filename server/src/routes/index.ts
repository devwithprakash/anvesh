import type { Express } from "express";
import workspaceRoutes from "./workspace.routes.js";
import { sourceRoutes } from "./source.routes.js";

export function registerRoutes(app: Express): void {
  // /api/workspaces/:workspaceId/sources
  workspaceRoutes.use("/:workspaceId/sources", sourceRoutes);
  app.use("/api/workspaces", workspaceRoutes);
}
