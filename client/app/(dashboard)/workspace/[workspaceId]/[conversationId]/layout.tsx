import { ClientAuthGuard } from '@/components/auth/client-auth-guard';
import { AppNavbar } from '@/components/workspace/app-navbar';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Conversation',
  description:
    'Chat with your sources in Anvesh. Ask questions, get AI-powered answers, and explore your research.',
};

export default function ConversationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClientAuthGuard skeletonVariant="conversation">
      <div className="flex flex-col" style={{ height: '100svh' }}>
        <AppNavbar />
        {children}
      </div>
    </ClientAuthGuard>
  );
}
