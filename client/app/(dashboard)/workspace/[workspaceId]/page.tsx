import { WorkspacePageInner } from "./workspace-page-inner";

interface WorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceId } = await params;
  return <WorkspacePageInner workspaceId={workspaceId} />;
}
