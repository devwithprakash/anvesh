'use client';

import { useRequireAuth } from '@/hooks/use-require-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isPending } = useRequireAuth();

  if (isPending) return <div>Loading...</div>;
  if (!session) return null;

  return <div>{children}</div>;
}
