import { deleteWorkspaceVectors } from '../lib/pinecone.js';
import {
  createWorkspaceWithQuota,
  deleteWorkspaceRecord,
  findWorkspaceByIdAndUserId,
  findWorkspacesByUserId,
  getFreePlan,
  getPlanById,
  getSubscriptionByUserId,
  updateWorkspaceRecord,
  type WorkspaceRecord,
} from '../repositories/workspace.repository.js';
import { NotFoundError } from '../types/app-error.js';

import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from '../validators/workspace.validator.js';

export function listWorkspacesByUser(userId: string) {
  return findWorkspacesByUserId(userId);
}

export async function getWorkspaceByIdForUser(
  workspaceId: string,
  userId: string,
): Promise<WorkspaceRecord> {
  const workspace = await findWorkspaceByIdAndUserId(workspaceId, userId);

  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  return workspace;
}

export async function createWorkspaceForUser(
  userId: string,
  input: CreateWorkspaceInput,
) {
  const subscription = await getSubscriptionByUserId(userId);

  const plan = subscription
    ? await getPlanById(subscription.planId)
    : await getFreePlan();

  if (!plan) {
    throw new Error('Plan not found');
  }

  const result = await createWorkspaceWithQuota(
    userId,
    input,
    plan.maxWorkspaces,
  );

  return result;
}

export async function updateWorkspaceForUser(
  workspaceId: string,
  userId: string,
  input: UpdateWorkspaceInput,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);
  return updateWorkspaceRecord(workspaceId, input);
}

export async function deleteWorkspaceForUser(
  workspaceId: string,
  userId: string,
) {
  await getWorkspaceByIdForUser(workspaceId, userId);

  try {
    await deleteWorkspaceVectors(workspaceId);
  } catch (error) {
    console.error('Failed to delete Pinecone namespace:', error);
  }

  await deleteWorkspaceRecord(workspaceId, userId);
}
