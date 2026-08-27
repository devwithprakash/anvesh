import { ConversationPageInner } from "./conversation-page-inner";

interface ConversationPageProps {
  params: Promise<{ workspaceId: string; conversationId: string }>;
}

export default async function ConversationPage({
  params, 
}: ConversationPageProps) {
  const { workspaceId, conversationId } = await params;
  return (
    <ConversationPageInner
      workspaceId={workspaceId}
      conversationId={conversationId}
    />
  );
}
