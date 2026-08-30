import { api } from "@/lib/api/client";
import { CreateWorkspaceInput, DeleteWorkspaceInput, Workspace } from "./types";

export async function getWorkspaces() {
  return api<Workspace[]>("/workspaces");
}

export async function getWorkspaceById(workspaceId: string) {
  return api<Workspace>(`/workspaces/${workspaceId}`, {
    method: "GET",
  })
}

export async function createWorkspace(data: CreateWorkspaceInput) {
  return api<Workspace>("/workspaces", {
    method: "POST",
    data,
  });
}

export async function deleteWorkspace(workspaceId: string) {
  return api(`/workspaces/${workspaceId}`, {
    method: "DELETE",
  });
}
