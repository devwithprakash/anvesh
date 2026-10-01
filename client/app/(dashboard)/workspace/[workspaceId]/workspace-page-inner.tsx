'use client';

import { Plus, MessageSquare, FileText, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppNavbar } from '@/components/workspace/app-navbar';
import { ConversationList } from '@/components/workspace/conversation-list';
import { SourcesPanel } from '@/components/workspace/sources-panel';
import { useConversations } from '@/features/conversation/queries';
import { useSources } from '@/features/source/queries';
import { useGetWorkspace } from '@/features/workspace/queries';

export function WorkspacePageInner({ workspaceId }: { workspaceId: string }) {
  const [chatsOpen, setChatsOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const router = useRouter();

  const { data: workspace } = useGetWorkspace(workspaceId);
  const { data: conversations, isPending } = useConversations(workspaceId);
  const { data: sources } = useSources(workspaceId);

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

  if (isPending || !conversations) {
    return <div>Loading...</div>;
  }

  if (!workspace) return null;

  const handleNewChat = () => {
    router.push(`/workspace/${workspaceId}/new`);
  };

  return (
    <div className="flex flex-col bg-[#FFFBF0]" style={{ height: '100svh' }}>
      <AppNavbar />

      {/* Three-panel body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left sidebar — hidden on mobile */}
        <div className="hidden h-full md:flex md:w-[260px] md:shrink-0">
          <ConversationList workspaceId={workspaceId} />
        </div>

        {/* Center: workspace overview */}
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-auto p-4 sm:p-8">
          {/* dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Mobile sidebar toggle buttons */}
          <div className="relative mb-4 flex gap-2 md:hidden">
            <button
              onClick={() => setChatsOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border-[2px] border-black bg-white px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              <MessageSquare size={12} />
              Chats
            </button>
            <button
              onClick={() => setSourcesOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border-[2px] border-black bg-white px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              <FileText size={12} />
              Sources
            </button>
          </div>

          <div className="relative flex w-full max-w-md flex-col items-center gap-6 text-center">
            {/* Title card */}
            <div className="w-full rounded-2xl border-[3px] border-black bg-white p-6 shadow-[5px_5px_0px_#000]">
              <h2 className="text-2xl font-black text-black">
                {workspace.title}
              </h2>
              {workspace.description && (
                <p className="mt-2 text-sm leading-relaxed font-semibold text-gray-600">
                  {workspace.description}
                </p>
              )}

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border-[2px] border-black bg-[#FFFBF0] p-3 text-center shadow-[2px_2px_0px_#000]">
                  <div className="text-2xl font-black text-black">
                    {conversations?.length ?? 0}
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-gray-600">
                    Conversations
                  </div>
                </div>
                <div className="rounded-xl border-[2px] border-black bg-[#FFFBF0] p-3 text-center shadow-[2px_2px_0px_#000]">
                  <div className="text-2xl font-black text-black">
                    {sources?.length}
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-gray-600">
                    Sources
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-2.5">
              <button
                onClick={handleNewChat}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-[2.5px] border-black bg-[#6C47FF] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
              >
                <Plus size={16} />
                Start new conversation
              </button>

              {conversations.length > 0 && (
                <button
                  onClick={() =>
                    router.push(
                      `/workspace/${workspaceId}/${conversations[0].id}`,
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-[2.5px] border-black bg-white px-5 py-3 text-sm font-black text-black shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
                >
                  <MessageSquare size={16} />
                  Continue last chat
                </button>
              )}
            </div>

            {/* Recent chats */}
            {conversations.length > 0 && (
              <div className="w-full">
                <p className="mb-2 text-left text-xs font-black tracking-wide text-black uppercase">
                  Recent
                </p>
                <div className="flex flex-col gap-1.5">
                  {conversations.slice(0, 4).map(conv => (
                    <button
                      key={conv.id}
                      onClick={() =>
                        router.push(`/workspace/${workspaceId}/${conv.id}`)
                      }
                      className="group flex w-full items-center gap-2.5 rounded-xl border-[2px] border-black/10 bg-white px-3 py-2.5 text-left transition-all hover:border-black hover:shadow-[3px_3px_0px_#000]"
                    >
                      <MessageSquare
                        size={13}
                        className="shrink-0 text-gray-400"
                      />
                      <span className="flex-1 truncate text-xs font-bold text-black">
                        {conv.title}
                      </span>
                      <ArrowRight
                        size={13}
                        className="shrink-0 text-gray-300 transition-colors group-hover:text-black"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar — hidden on mobile */}
        <div className="hidden h-full md:flex md:w-[260px] md:shrink-0">
          <SourcesPanel workspaceId={workspaceId} />
        </div>
      </div>

      {/* ── Mobile: Chats slide-over ── */}
      {chatsOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setChatsOpen(false)}
          />
          <div className="relative z-10 flex h-full w-[300px] max-w-[85vw]">
            <ConversationList
              workspaceId={workspaceId}
              onClose={() => setChatsOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Mobile: Sources slide-over ── */}
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
