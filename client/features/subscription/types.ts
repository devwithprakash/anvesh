export interface Plan {
  id: string;
  name: string;
  price: number;
  maxWorkspaces: number;
  maxSourcesPerWorkspace: number;
  maxAiQueries: number;
  webSearchEnabled: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELED";
  razorpaySubscriptionId: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface Usage {
  workspaces: number;
  AiQueries: number;
  periodStart: string;
  periodEnd: string;
}

export interface SubscriptionStatus {
  plan: Plan;
  subscription: Subscription | null;
  usage: Usage | null;
}

export interface CheckoutResponse {
  subscriptionId: string;
  keyId: string;
  planName: string;
  amount: number;
}
