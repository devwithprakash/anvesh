import prisma from "../lib/db.js";
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

export async function deleteWorkspaceRecord(workspaceId: string) {
  await prisma.workspace.delete({
    where: { id: workspaceId },
  });
}

export async function updateUsageRecordByUserId(
  userId: string,
  field: UsageField,
  operation: UsageOperation,
  amount = 1,
) {
  return prisma.usageRecords.update({
    where: { userId },
    data: {
      [field]: {
        [operation]: amount,
      },
    },
  });
}
