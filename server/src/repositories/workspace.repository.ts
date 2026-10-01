import prisma from '../lib/db.js';
import { ConflictError, NotFoundError } from '../types/app-error.js';

import type { Prisma } from '../generated/prisma/client.js';
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from '../validators/workspace.validator.js';

export const workspaceSelect = {
  id: true,
  title: true,
  description: true,
  icon: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type WorkspaceRecord = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function addOneMonth(presentDate: Date): Date {
  const newDate = new Date(presentDate.getTime());
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
}

// ── Subscription / Plan helpers ──────────────────────────────────────────────

export function getSubscriptionByUserId(userId: string) {
  return prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE' },
  });
}

export function getFreePlan() {
  return prisma.plan.findUnique({
    where: { name: 'FREE' },
  });
}

export function getPlanById(planId: string) {
  return prisma.plan.findUnique({
    where: { id: planId },
  });
}

export function getUsageRecordByUserId(userId: string) {
  return prisma.usageRecords.findFirst({
    where: { userId },
  });
}

// ── Workspace CRUD ───────────────────────────────────────────────────────────

export function findWorkspacesByUserId(userId: string) {
  return prisma.workspace.findMany({
    where: { userId },
    select: workspaceSelect,
    orderBy: { updatedAt: 'desc' },
  });
}

export function findWorkspaceByIdAndUserId(
  workspaceId: string,
  userId: string,
) {
  return prisma.workspace.findFirst({
    where: { id: workspaceId, userId },
    select: workspaceSelect,
  });
}

export function createWorkspaceRecord(
  userId: string,
  data: CreateWorkspaceInput,
) {
  return prisma.workspace.create({
    data: {
      userId,
      title: data.title,
      description: data.description ?? null,
      icon: data.icon ?? null,
    },
    select: workspaceSelect,
  });
}

export function updateWorkspaceRecord(
  workspaceId: string,
  data: UpdateWorkspaceInput,
) {
  return prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.icon !== undefined && {
        icon: data.icon,
      }),
    },
    select: workspaceSelect,
  });
}

export async function deleteWorkspaceRecord(
  workspaceId: string,
  userId: string,
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const workspace = await tx.workspace.findFirst({
      where: { id: workspaceId, userId },
    });

    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    await tx.workspace.delete({
      where: { id: workspaceId },
    });

    // Decrement usage counter if a record exists — don't throw if missing
    await tx.usageRecords.updateMany({
      where: { userId },
      data: { workspaces: { decrement: 1 } },
    });

    // Clamp to zero in case of underflow
    await tx.usageRecords.updateMany({
      where: { userId, workspaces: { lt: 0 } },
      data: { workspaces: 0 },
    });
  });
}

// ── Usage records ────────────────────────────────────────────────────────────

async function ensureUsageRecord(tx: Prisma.TransactionClient, userId: string) {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = addOneMonth(periodStart);

  return tx.usageRecords.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      workspaces: 0,
      AiQueries: 0,
      periodStart,
      periodEnd,
    },
  });
}

async function resetExpiredUsageIfNeeded(
  tx: Prisma.TransactionClient,
  userId: string,
) {
  const now = new Date();

  await tx.usageRecords.updateMany({
    where: {
      userId,
      periodEnd: { lte: now },
    },
    data: {
      AiQueries: 0,
      periodStart: now,
      periodEnd: addOneMonth(now),
    },
  });
}

export async function updateAiQueryUsageRecord(
  userId: string,
  maxAiQueries: number,
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await ensureUsageRecord(tx, userId);
    await resetExpiredUsageIfNeeded(tx, userId);

    const result = await tx.usageRecords.updateMany({
      where: {
        userId,
        AiQueries: { lt: maxAiQueries },
      },
      data: {
        AiQueries: { increment: 1 },
      },
    });

    if (result.count === 0) {
      throw new ConflictError(
        'Monthly AI query limit reached. Upgrade your plan.',
      );
    }

    return result;
  });
}

export async function createWorkspaceWithQuota(
  userId: string,
  input: CreateWorkspaceInput,
  maxWorkspaces: number,
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Ensure usage record exists
    await ensureUsageRecord(tx, userId);

    // Check current count BEFORE incrementing
    const usage = await tx.usageRecords.findUnique({
      where: { userId },
    });

    if (usage && usage.workspaces >= maxWorkspaces) {
      throw new ConflictError(
        'Maximum workspace limit reached. Upgrade your plan.',
      );
    }

    // Now increment
    await tx.usageRecords.update({
      where: { userId },
      data: { workspaces: { increment: 1 } },
    });

    return tx.workspace.create({
      data: {
        userId,
        title: input.title,
        description: input.description ?? null,
        icon: input.icon ?? null,
      },
    });
  });
}
