import { ClientAuthGuard } from '@/components/auth/client-auth-guard';
import { AppNavbar } from '@/components/workspace/app-navbar';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Manage all your Anvesh workspaces. Organise your research, documents, and AI conversations in one place.',
};

export default function DashboardPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClientAuthGuard skeletonVariant="dashboard">
      <div className="flex min-h-svh flex-1 flex-col bg-[#FFFBF0]">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <AppNavbar />
        {children}
      </div>
    </ClientAuthGuard>
  );
}
