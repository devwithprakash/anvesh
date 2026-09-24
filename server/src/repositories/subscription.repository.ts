import type { Prisma, SubscriptionStatus } from "../generated/prisma/client.js";
import prisma from "../lib/db.js";

// ── Subscription ─────────────────────────────────────────────────────────────

export function findActiveSubscriptionByUserId(userId: string) {
  return prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { plan: true },
  });
}

export function findSubscriptionByRazorpayId(razorpaySubscriptionId: string) {
  return prisma.subscription.findFirst({
    where: { razorpaySubscriptionId },
    include: { plan: true },
  });
}

export function upsertSubscription(
  userId: string,
  data: {
    planId: string;
    status: SubscriptionStatus;
    razorpayCustomerId?: string | null;
    razorpaySubscriptionId?: string | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  },
) {
  const where = data.razorpaySubscriptionId
    ? { razorpaySubscriptionId: data.razorpaySubscriptionId }
    : undefined;

  // If we have a razorpay subscription id, try to find and update it
  if (where) {
    return prisma.subscription.upsert({
      where: {
        id: "nonexistent-placeholder",
        ...({} as any),
      },
      update: {
        status: data.status,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        ...(data.razorpayCustomerId !== undefined && {
          razorpayCustomerId: data.razorpayCustomerId,
        }),
      },
      create: {
        userId,
        planId: data.planId,
        status: data.status,
        razorpayCustomerId: data.razorpayCustomerId ?? null,
        razorpaySubscriptionId: data.razorpaySubscriptionId ?? null,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
      },
    });
  }

  // Otherwise just create a new one
  return prisma.subscription.create({
    data: {
      userId,
      planId: data.planId,
      status: data.status,
      razorpayCustomerId: data.razorpayCustomerId ?? null,
      razorpaySubscriptionId: data.razorpaySubscriptionId ?? null,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
    },
  });
}

export async function createSubscriptionRecord(
  userId: string,
  data: {
    planId: string;
    status: SubscriptionStatus;
    razorpayCustomerId?: string | null;
    razorpaySubscriptionId?: string | null;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  },
) {
  // Cancel any existing active subscriptions first
  await prisma.subscription.updateMany({
    where: { userId, status: "ACTIVE" },
    data: { status: "CANCELED" },
  });

  return prisma.subscription.create({
    data: {
      userId,
      planId: data.planId,
      status: data.status,
      razorpayCustomerId: data.razorpayCustomerId ?? null,
      razorpaySubscriptionId: data.razorpaySubscriptionId ?? null,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
    },
    include: { plan: true },
  });
}

export function updateSubscriptionStatus(
  id: string,
  status: SubscriptionStatus,
) {
  return prisma.subscription.update({
    where: { id },
    data: { status },
  });
}

export function updateSubscriptionPeriod(
  id: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
) {
  return prisma.subscription.update({
    where: { id },
    data: { currentPeriodStart, currentPeriodEnd },
  });
}

// ── Plans ────────────────────────────────────────────────────────────────────

export function getPlans() {
  return prisma.plan.findMany({
    orderBy: { price: "asc" },
  });
}

export function getPlanByName(name: string) {
  return prisma.plan.findUnique({
    where: { name },
  });
}

// ── Usage ────────────────────────────────────────────────────────────────────

export function getUsageByUserId(userId: string) {
  return prisma.usageRecords.findFirst({
    where: { userId },
  });
}

export function getWebhookEventById(eventId: string) {
  return prisma.webhookEvent.findUnique({
    where: { eventId },
  });
}

export function createWebhookEvent(
  eventId: string,
  event: string,
  payload: Prisma.InputJsonValue,
  signature: string,
) {
  return prisma.webhookEvent.create({
    data: {
      eventId,
      eventType: event,
      payload,
      signature,
      status: "RECEIVED",
    },
  });
}

export function markWebhookEventProcessed(eventId: string) {
  return prisma.webhookEvent.update({
    where: {
      eventId,
    },
    data: {
      status: "PROCESSED",
      processdAt: new Date(),
    },
  });
}
export function markWebhookEventFailed(eventId: string, errorMessage: string) {
  return prisma.webhookEvent.update({
    where: {
      eventId,
    },
    data: {
      status: "FAILED",
      errorMessage: errorMessage,
    },
  });
}
