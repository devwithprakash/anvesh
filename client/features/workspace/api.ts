import { api } from '@/lib/api/client';

import { CreateWorkspaceInput, UpdateWorkspaceInput, Workspace } from './types';

export async function getWorkspaces() {
  return api<Workspace[]>('/workspaces');
}

export async function getWorkspaceById(workspaceId: string) {
  return api<Workspace>(`/workspaces/${workspaceId}`, {
    method: 'GET',
  });
}

export async function createWorkspace(data: CreateWorkspaceInput) {
  return api<Workspace>('/workspaces', {
    method: 'POST',
    data,
  });
}
export async function updateWorkspace(data: UpdateWorkspaceInput) {
  return api<Workspace>(`/workspaces/${data.workspaceId}`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteWorkspace(workspaceId: string) {
  return api(`/workspaces/${workspaceId}`, {
    method: 'DELETE',
  });
}
