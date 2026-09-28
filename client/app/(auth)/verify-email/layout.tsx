import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Check your inbox and verify your Anvesh email address to activate your account.",
};

export default function VerifyEmailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
