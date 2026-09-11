import { Router } from "express";
import express from "express";
import { asyncHandler } from "../utils/async-handler.js";
import {
  cancelUserSubscription,
  createCheckout,
  getPlans,
  getSubscription,
  handleWebhook,
} from "../controllers/subscription.controller.js";
import { requireAuth } from "../middleware/require-auth-middleware.js";

export const subscriptionRoutes = Router();

// Webhook must be BEFORE auth middleware — Razorpay calls this directly
// subscriptionRoutes.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   asyncHandler(handleWebhook),
// );

// Auth-gated routes
subscriptionRoutes.use(requireAuth);
subscriptionRoutes.get("/", asyncHandler(getSubscription));
subscriptionRoutes.get("/plans", asyncHandler(getPlans));
subscriptionRoutes.post("/checkout", asyncHandler(createCheckout));
subscriptionRoutes.post("/cancel", asyncHandler(cancelUserSubscription));
