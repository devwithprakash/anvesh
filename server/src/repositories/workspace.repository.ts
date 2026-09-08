import prisma from "../lib/db.js";
import { ConflictError, NotFoundError } from "../types/app-error.js";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "../validators/workspace.validator.js";

export const workspaceSelect = {
  id: true,
  title: true,
  description: true,
  icon: true,
  defaultModel: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type WorkspaceRecord = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  defaultModel: string;
  createdAt: Date;
  updatedAt: Date;
};

type UsageField = "workspaces" | "sources" | "aiQueries";
type UsageOperation = "increment" | "decrement";

function addOneMonth(presentDate: Date): Date {
  const newDate = new Date(presentDate.getTime());

  newDate.setMonth(newDate.getMonth() + 1);

  return newDate;
}

export function getSubscriptionByUserId(userId: string) {
  return prisma.subscription.findFirst({
    where: { userId },
  });
}

export function getFreePlan() {
  return prisma.plan.findFirst({
    where: { name: "FREE" },
  });
}

export function getPlanById(planId: string) {
  return prisma.plan.findUnique({
    where: { id: planId },
  });
}
export function getUageRecordByUserId(userId: string) {
  return prisma.usageRecords.findFirst({
    where: { userId },
  });
}

export function findWorkspacesByUserId(userId: string) {
  return prisma.workspace.findMany({
    where: { userId },
    select: workspaceSelect,
    orderBy: { updatedAt: "desc" },
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
      defaultModel: data.defaultModel ?? "gpt-4o-mini",
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
      ...(data.defaultModel !== undefined && {
        defaultModel: data.defaultModel,
      }),
    },
    select: workspaceSelect,
  });
}

export async function deleteWorkspaceRecord(
  workspaceId: string,
  userId: string,
) {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.findFirst({
      where: {
        id: workspaceId,
        userId,
      },
    });

    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    const usage = await tx.usageRecords.findFirst({
      where: {
        userId,
        periodStart: {
          lte: now,
        },
        periodEnd: {
          gt: now,
        },
      },
    });

    if (!usage) {
      throw new NotFoundError("Active usage record not found");
    }

    await tx.workspace.delete({
      where: {
        id: workspaceId,
      },
    });

    await tx.usageRecords.update({
      where: {
        id: usage.id,
      },
      data: {
        workspaces: {
          decrement: 1,
        },
      },
    });
  });
}

export async function updateUsageRecordByUserId(
  userId: string,
  field: UsageField,
  operation: UsageOperation,
  amount = 1,
) {
  const now = new Date();
  return prisma.usageRecords.update({
    where: {
      userId_periodStart: {
        userId,
        periodStart: now,
      },
    },
    data: {
      [field]: {
        [operation]: amount,
      },
    },
  });
}

export async function createWorkspaceWithQuota(
  userId: string,
  input: CreateWorkspaceInput,
  maxWorkspaces: number,
) {
  return prisma.$transaction(async (tx) => {
    const now = new Date();
    await tx.usageRecords.upsert({
      where: {
        userId_periodStart: {
          userId,
          periodStart: now,
        },
      },
      create: {
        userId,
        workspaces: 0,
        AiQueries: 0,
        sources: 0,
        periodStart: now,
        periodEnd: addOneMonth(now),
      },
      update: {},
    });

    const result = await tx.usageRecords.updateMany({
      where: {
        userId,
        workspaces: {
          lt: maxWorkspaces,
        },
      },
      data: {
        workspaces: {
          increment: 1,
        },
      },
    });

    if (result.count === 0) {
      throw new ConflictError(
        "Maximum workspace limit reached upgrade your plan.",
      );
    }

    return tx.workspace.create({
      data: {
        userId,
        title: input.title,
        description: input.description ?? null,
        icon: input.icon ?? null,
        defaultModel: input.defaultModel ?? "gpt-4o-mini",
      },
    });
  });
}
