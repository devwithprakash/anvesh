import type { Request, Response } from "express";
import { checkoutSchema } from "../validators/subscription.validator.js";
import { ValidationError } from "../types/app-error.js";
import { getZodFieldErrors } from "../utils/zod-error.js";
import {
  cancelSubscription,
  getSubscriptionStatus,
  handleWebhookEvent,
  initiateCheckout,
  listPlans,
} from "../services/subscription.service.js";

export async function getSubscription(req: Request, res: Response) {
  const status = await getSubscriptionStatus(req.session.user.id);
  res.json(status);
}

export async function getPlans(req: Request, res: Response) {
  const plans = await listPlans();
  res.json(plans);
}

export async function createCheckout(req: Request, res: Response) {
  const parsed = checkoutSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid plan selection",
      getZodFieldErrors(parsed.error),
    );
  }

  const result = await initiateCheckout(
    req.session.user.id,
    parsed.data.planName,
  );

  res.json(result);
}

export async function cancelUserSubscription(req: Request, res: Response) {
  const result = await cancelSubscription(req.session.user.id);
  res.json(result);
}

export async function handleWebhook(
  req: Request,
  res: Response,
): Promise<void> {
  const eventId = req.headers["x-razorpay-event-id"];

  if (!eventId || Array.isArray(eventId)) {
    res.status(400).json({
      error: "Invalid or missing event ID",
    });
    return;
  }
  
  const signature = req.headers["x-razorpay-signature"] as string;

  if (!signature) {
    res.status(400).json({
      error: "Missing signature header",
    });
    return;
  }

  if (!Buffer.isBuffer(req.body)) {
    console.error("Webhook body is not a Buffer");

    res.status(400).json({
      error: "Invalid webhook body",
    });

    return;
  }

  const rawBody = req.body.toString("utf-8");

  const result = await handleWebhookEvent(rawBody, signature, eventId);

  res.status(200).json(result);
}
