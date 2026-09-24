"use client";

import { Zap, Crown, Star, ArrowRight, Loader } from "lucide-react";
import { useSubscriptionStatus } from "@/features/subscription/queries";
import { useCreateCheckout } from "@/features/subscription/mutations";
import type { CheckoutResponse } from "@/features/subscription/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLAN_BADGES: Record<
  string,
  { icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  FREE: {
    icon: <Star size={12} />,
    bg: "bg-[#FFE14D]",
    text: "text-black",
    border: "border-black",
  },
  PRO: {
    icon: <Zap size={12} />,
    bg: "bg-[#6C47FF]",
    text: "text-white",
    border: "border-black",
  },
  PREMIUM: {
    icon: <Crown size={12} />,
    bg: "bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B]",
    text: "text-white",
    border: "border-black",
  },
};

function UsageBar({
  label,
  used,
  max,
  color,
}: {
  label: string;
  used: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  const isNearLimit = pct >= 80;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-gray-600">{label}</span>
        <span className={isNearLimit ? "text-[#FF6B6B]" : "text-gray-500"}>
          {used} / {max}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-200 border border-black/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: isNearLimit ? "#FF6B6B" : color,
          }}
        />
      </div>
    </div>
  );
}

function openRazorpayModal(checkout: CheckoutResponse) {
  if (!window.Razorpay) {
    alert("Payment SDK not loaded. Please refresh and try again.");
    return;
  }
  const options = {
    key: checkout.keyId,
    subscription_id: checkout.subscriptionId,
    name: "Anvesh",
    description: `${checkout.planName} Plan Subscription`,
    handler: () => {
      // Payment successful — webhook will handle the rest
      // Force refetch subscription status
      window.location.reload();
    },
    theme: {
      color: "#6C47FF",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

export function PlanBanner() {
  const { data: status, isPending } = useSubscriptionStatus();
  const checkout = useCreateCheckout();

  if (isPending || !status) return null;

  const { plan, usage } = status;
  const badge = PLAN_BADGES[plan.name] ?? PLAN_BADGES.FREE;
  const isFree = plan.name === "FREE";

  const handleUpgrade = async (planName: "PRO" | "PREMIUM") => {
    try {
      const result = await checkout.mutateAsync(planName);

      openRazorpayModal(result);
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <div className="rounded-xl border-[2.5px] border-black bg-white p-4 shadow-[4px_4px_0px_#000] mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Plan badge + info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border-[2px] ${badge.border} ${badge.bg} ${badge.text} px-2.5 py-1 text-[11px] font-black shadow-[2px_2px_0px_#000]`}
          >
            {badge.icon}
            {plan.name}
          </span>

          {usage && (
            <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm">
              <UsageBar
                label="Workspaces"
                used={usage.workspaces}
                max={plan.maxWorkspaces}
                color="#6C47FF"
              />
              <UsageBar
                label="AI Queries"
                used={usage.AiQueries}
                max={plan.maxAiQueries}
                color="#00B87C"
              />
            </div>
          )}
        </div>

        {/* Upgrade button */}
        {isFree && (
          <button
            onClick={() => handleUpgrade("PRO")}
            disabled={checkout.isPending}
            className="flex items-center gap-2 shrink-0 rounded-lg border-[2px] border-black bg-[#6C47FF] px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
          >
            {checkout.isPending ? (
              <Loader size={12} className="animate-spin" />
            ) : (
              <Zap size={12} />
            )}
            Upgrade to Pro
            <ArrowRight size={12} />
          </button>
        )}

        {plan.name === "PRO" && (
          <button
            onClick={() => handleUpgrade("PREMIUM")}
            disabled={checkout.isPending}
            className="flex items-center gap-2 shrink-0 rounded-lg border-[2px] border-black bg-gradient-to-r from-[#6C47FF] to-[#FF6B6B] px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
          >
            {checkout.isPending ? (
              <Loader size={12} className="animate-spin" />
            ) : (
              <Crown size={12} />
            )}
            Upgrade to Premium
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

export function PlanBadge() {
  const { data: status } = useSubscriptionStatus();

  if (!status) return null;

  const badge = PLAN_BADGES[status.plan.name] ?? PLAN_BADGES.FREE;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border-[1.5px] ${badge.border} ${badge.bg} ${badge.text} px-2 py-0.5 text-[10px] font-black shadow-[1px_1px_0px_#000]`}
    >
      {badge.icon}
      {status.plan.name}
    </span>
  );
}
