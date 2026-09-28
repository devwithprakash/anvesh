import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage all your Anvesh workspaces. Organise your research, documents, and AI conversations in one place.",
};

export default function DashboardPageLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
