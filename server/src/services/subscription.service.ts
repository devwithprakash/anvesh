import { getRazorpayClient, verifyWebhookSignature } from "../lib/razorpay.js";
import {
  createSubscriptionRecord,
  findActiveSubscriptionByUserId,
  findSubscriptionByRazorpayId,
  getPlans as getPlansFromRepo,
  getPlanByName,
  getUsageByUserId,
  updateSubscriptionPeriod,
  updateSubscriptionStatus,
} from "../repositories/subscription.repository.js";
import { getFreePlan } from "../repositories/workspace.repository.js";
import { NotFoundError, ValidationError } from "../types/app-error.js";

export async function getSubscriptionStatus(userId: string) {
  const subscription = await findActiveSubscriptionByUserId(userId);

  let plan;

  if (subscription) {
    plan = subscription.plan;
  } else {
    plan = await getFreePlan();
    if (!plan) {
      throw new Error("FREE plan not found. Run prisma db seed.");
    }
  }

  const usage = await getUsageByUserId(userId);

  return {
    plan: {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      maxWorkspaces: plan.maxWorkspaces,
      maxSourcesPerWorkspace: plan.maxSourcesPerWorkspace,
      maxAiQueries: plan.maxAiQueries,
      webSearchEnabled: plan.webSearchEnabled,
    },
    subscription: subscription
      ? {
          id: subscription.id,
          userId: subscription.userId,
          planId: subscription.planId,
          status: subscription.status,
          razorpaySubscriptionId: subscription.razorpaySubscriptionId,
          currentPeriodStart: subscription.currentPeriodStart.toISOString(),
          currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
        }
      : null,
    usage: usage
      ? {
          workspaces: usage.workspaces,
          AiQueries: usage.AiQueries,
          periodStart: usage.periodStart.toISOString(),
          periodEnd: usage.periodEnd.toISOString(),
        }
      : null,
  };
}

export async function listPlans() {
  return getPlansFromRepo();
}

export async function initiateCheckout(
  userId: string,
  planName: "PRO" | "PREMIUM",
) {
  const plan = await getPlanByName(planName);
  if (!plan) {
    throw new ValidationError(`Plan "${planName}" not found`);
  }

  if (plan.price === 0) {
    throw new ValidationError("Cannot checkout the FREE plan");
  }

  // Check if user already has an active subscription
  const existing = await findActiveSubscriptionByUserId(userId);
  if (existing) {
    throw new ValidationError(
      "You already have an active subscription. Cancel it first to switch plans.",
    );
  }

  const razorpay = getRazorpayClient();

  const razorpayPlanIds = {
    PRO: process.env.RAZORPAY_PRO_PLAN_ID,
    PREMIUM: process.env.RAZORPAY_PREMIUM_PLAN_ID,
  };

  // Create Razorpay subscription
  const razorpayPlanId = razorpayPlanIds[planName];
  if (!razorpayPlanId) {
    throw new Error("RAZORPAY_PLAN_ID not configured");
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: razorpayPlanId,
    total_count: 12, // 12 billing cycles
    quantity: 1,
    notes: {
      userId,
      planName,
      internalPlanId: plan.id,
    },
  });

  return {
    subscriptionId: subscription.id,
    keyId: process.env.RAZORPAY_API_KEY!,
    planName,
    amount: plan.price,
  };
}

export async function cancelSubscription(userId: string) {
  const subscription = await findActiveSubscriptionByUserId(userId);

  if (!subscription) {
    throw new NotFoundError("No active subscription found");
  }

  // Cancel on Razorpay if we have an ID
  if (subscription.razorpaySubscriptionId) {
    try {
      const razorpay = getRazorpayClient();
      await razorpay.subscriptions.cancel(
        subscription.razorpaySubscriptionId,
        false, // cancel at end of billing period
      );
    } catch (error) {
      console.error("Razorpay cancel failed:", error);
      // Still update our DB even if Razorpay call fails
    }
  }

  await updateSubscriptionStatus(subscription.id, "CANCELED");

  return { message: "Subscription cancelled successfully" };
}

export async function handleWebhookEvent(rawBody: string, signature: string) {
  const isValid = verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    throw new ValidationError("Invalid webhook signature");
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event as string;
  const subscriptionEntity = payload.payload?.subscription?.entity;

  if (!subscriptionEntity) {
    console.warn("Webhook event without subscription entity:", event);
    return { received: true };
  }

  const razorpaySubscriptionId = subscriptionEntity.id as string;
  const notes = subscriptionEntity.notes ?? {};

  switch (event) {
    case "subscription.activated": {
      const planName = (notes.planName as string) || "PRO";
      const plan = await getPlanByName(planName);

      if (!plan) {
        console.error(`Plan "${planName}" not found for webhook`);
        return { received: true };
      }

      const userId = notes.userId as string;
      if (!userId) {
        console.error("No userId in subscription notes");
        return { received: true };
      }

      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await createSubscriptionRecord(userId, {
        planId: plan.id,
        status: "ACTIVE",
        razorpayCustomerId: subscriptionEntity.customer_id ?? null,
        razorpaySubscriptionId,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
      });

      break;
    }

    case "subscription.charged": {
      const existing = await findSubscriptionByRazorpayId(
        razorpaySubscriptionId,
      );
      if (existing) {
        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        await updateSubscriptionPeriod(existing.id, now, periodEnd);
      }
      break;
    }

    case "subscription.cancelled": {
      const existing = await findSubscriptionByRazorpayId(
        razorpaySubscriptionId,
      );
      if (existing) {
        await updateSubscriptionStatus(existing.id, "CANCELED");
      }
      break;
    }

    case "subscription.expired": {
      const existing = await findSubscriptionByRazorpayId(
        razorpaySubscriptionId,
      );
      if (existing) {
        await updateSubscriptionStatus(existing.id, "EXPIRED");
      }
      break;
    }

    case "payment.failed": {
      console.warn(`Payment failed for subscription ${razorpaySubscriptionId}`);
      break;
    }

    default:
      console.log(`Unhandled webhook event: ${event}`);
  }

  return { received: true };
}
