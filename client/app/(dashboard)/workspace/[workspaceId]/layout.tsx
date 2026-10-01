import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Workspace',
  description:
    'View and manage your Anvesh workspace. Add sources, start AI conversations, and explore your research.',
};

// Plain passthrough — auth + navbar are handled by WorkspacePageInner directly
// (so the nested ConversationLayout can have its own independent guard without
// a parent guard causing sequential skeletons).
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
