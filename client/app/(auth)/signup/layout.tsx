import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a free Anvesh account and start researching smarter with AI. No credit card required.",
};

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
