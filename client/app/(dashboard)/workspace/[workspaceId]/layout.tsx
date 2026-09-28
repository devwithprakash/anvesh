import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workspace",
  description:
    "View and manage your Anvesh workspace. Add sources, start AI conversations, and explore your research.",
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
