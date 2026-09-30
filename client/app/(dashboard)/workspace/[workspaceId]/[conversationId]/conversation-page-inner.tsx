'use client';

import { useEffect, useState } from 'react';

import { ChatInterface } from '@/components/chat/chat-interface';
import { AppNavbar } from '@/components/workspace/app-navbar';
import { ConversationList } from '@/components/workspace/conversation-list';
import { SourcesPanel } from '@/components/workspace/sources-panel';

export function ConversationPageInner({
  workspaceId,
  conversationId,
}: {
  workspaceId: string;
  conversationId: string;
}) {
  const [chatsOpen, setChatsOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // Close drawers on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setChatsOpen(false);
        setSourcesOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex flex-col bg-[#FFFBF0]" style={{ height: '100svh' }}>
      <AppNavbar />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden h-full md:flex md:w-[260px] md:shrink-0">
          <ConversationList
            workspaceId={workspaceId}
            activeConversationId={
              conversationId === 'new' ? undefined : conversationId
            }
          />
        </div>

        <ChatInterface
          workspaceId={workspaceId}
          conversationId={conversationId === 'new' ? undefined : conversationId}
          onOpenChats={() => setChatsOpen(true)}
          onOpenSources={() => setSourcesOpen(true)}
        />

        <div className="hidden h-full md:flex md:w-[260px] md:shrink-0">
          <SourcesPanel workspaceId={workspaceId} />
        </div>
      </div>

      {chatsOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setChatsOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[300px] max-w-[85vw]">
            <ConversationList
              workspaceId={workspaceId}
              activeConversationId={
                conversationId === 'new' ? undefined : conversationId
              }
              onClose={() => setChatsOpen(false)}
            />
          </div>
        </div>
      )}

      {sourcesOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSourcesOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[300px] max-w-[85vw]">
            <SourcesPanel
              workspaceId={workspaceId}
              onClose={() => setSourcesOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
