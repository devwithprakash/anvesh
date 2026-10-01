'use client';

import { ConversationSkeleton } from '@/components/workspace/conversation-skeleton';
import { DashboardSkeleton } from '@/components/workspace/dashboard-skeleton';
import { WorkspaceSkeleton } from '@/components/workspace/workspace-skeleton';
import { useRequireAuth } from '@/hooks/use-require-auth';

export type SkeletonVariant = 'dashboard' | 'workspace' | 'conversation';

interface ClientAuthGuardProps {
  children: React.ReactNode;
  skeletonVariant?: SkeletonVariant;
}

function renderSkeleton(variant: SkeletonVariant) {
  switch (variant) {
    case 'workspace':
      return <WorkspaceSkeleton />;
    case 'conversation':
      return <ConversationSkeleton />;
    default:
      return <DashboardSkeleton />;
  }
}

export function ClientAuthGuard({
  children,
  skeletonVariant = 'dashboard',
}: ClientAuthGuardProps) {
  const { session, isPending } = useRequireAuth();

  if (isPending) return renderSkeleton(skeletonVariant);

  if (!session) return null;

  return <>{children}</>;
}
