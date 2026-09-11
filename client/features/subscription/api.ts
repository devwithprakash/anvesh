import { api } from "@/lib/api/client";
import { SubscriptionStatus, CheckoutResponse, Plan } from "./types";

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  return api<SubscriptionStatus>("/subscription");
}

export async function createCheckout(planName: string): Promise<CheckoutResponse> {
  console.log("Inside the API")
  return api<CheckoutResponse>("/subscription/checkout", { method: "POST", data: { planName } });
}

export async function cancelSubscription(): Promise<void> {
  return api<void>("/subscription/cancel", { method: "POST" });
}

export async function getPlans(): Promise<Plan[]> {
  return api<Plan[]>("/subscription/plans");
}
