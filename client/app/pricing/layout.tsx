import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, honest pricing for Anvesh. Start free, upgrade when you need more. Cancel anytime — no questions asked.",
  openGraph: {
    title: "Pricing | Anvesh",
    description:
      "Start free. Upgrade when you need more. Cancel anytime — no questions asked.",
    type: "website",
  },
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
