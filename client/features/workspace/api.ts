import { api } from "@/lib/api/client";
import { CreateWorkspaceInput, Workspace } from "./types";

export async function getWorkspaces() {
  return api<Workspace[]>("/workspaces");
}

export async function createWorkspace(data: CreateWorkspaceInput) {
  return api<Workspace>("/workspaces", {
    method: "POST",
    data,
  });
}
