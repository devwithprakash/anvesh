import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Anvesh account and continue your AI-powered research.",
};

export default function SignInLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
