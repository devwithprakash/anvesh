"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/providers/app-provider";
import { AppNavbar } from "@/components/workspace/app-navbar";
import { ConversationList } from "@/components/workspace/conversation-list";
import { SourcesPanel } from "@/components/workspace/sources-panel";
import { Plus, MessageSquare, FileText, ArrowRight } from "lucide-react";

export function WorkspacePageInner({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const { workspaces, conversations, createConversation } = useAppState();
  const workspace = workspaces.find((ws) => ws.id === workspaceId);
  const convList = conversations[workspaceId] ?? [];

  const [chatsOpen, setChatsOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  useEffect(() => {
    if (workspaces.length > 0 && !workspace) {
      router.push("/dashboard");
    }
  }, [workspace, workspaces, router]);

  // Close drawers on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setChatsOpen(false);
        setSourcesOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!workspace) return null;

  const handleNewChat = () => {
    const conv = createConversation(workspaceId);
    router.push(`/workspace/${workspaceId}/${conv.id}`);
  };

  return (
    <div className="flex flex-col bg-[#FFFBF0]" style={{ height: "100svh" }}>
      <AppNavbar activeWorkspaceId={workspaceId} />

      {/* Three-panel body */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left sidebar — hidden on mobile */}
        <div className="hidden md:flex md:w-[260px] md:shrink-0 h-full">
          <ConversationList workspaceId={workspaceId} />
        </div>

        {/* Center: workspace overview */}
        <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8 overflow-auto relative">
          {/* dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #000 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Mobile sidebar toggle buttons */}
          <div className="md:hidden flex gap-2 mb-4 relative">
            <button
              onClick={() => setChatsOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border-[2px] border-black bg-white px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <MessageSquare size={12} />
              Chats
            </button>
            <button
              onClick={() => setSourcesOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border-[2px] border-black bg-white px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <FileText size={12} />
              Sources
            </button>
          </div>

          <div className="relative flex flex-col items-center gap-6 text-center max-w-md w-full">
            {/* Title card */}
            <div className="w-full rounded-2xl border-[3px] border-black bg-white shadow-[5px_5px_0px_#000] p-6">
              <h2 className="font-black text-2xl text-black">
                {workspace.title}
              </h2>
              {workspace.description && (
                <p className="text-sm font-semibold text-gray-600 mt-2 leading-relaxed">
                  {workspace.description}
                </p>
              )}

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border-[2px] border-black bg-[#FFFBF0] p-3 text-center shadow-[2px_2px_0px_#000]">
                  <div className="font-black text-2xl text-black">
                    {convList.length}
                  </div>
                  <div className="text-xs font-bold text-gray-600 mt-0.5">
                    Conversations
                  </div>
                </div>
                <div className="rounded-xl border-[2px] border-black bg-[#FFFBF0] p-3 text-center shadow-[2px_2px_0px_#000]">
                  <div className="font-black text-2xl text-black">
                    {workspace.sourceCount}
                  </div>
                  <div className="text-xs font-bold text-gray-600 mt-0.5">
                    Sources
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={handleNewChat}
                className="flex items-center justify-center gap-2 w-full rounded-xl border-[2.5px] border-black bg-[#6C47FF] px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              >
                <Plus size={16} />
                Start new conversation
              </button>

              {convList.length > 0 && (
                <button
                  onClick={() =>
                    router.push(`/workspace/${workspaceId}/${convList[0].id}`)
                  }
                  className="flex items-center justify-center gap-2 w-full rounded-xl border-[2.5px] border-black bg-white px-5 py-3 text-sm font-black text-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  <MessageSquare size={16} />
                  Continue last chat
                </button>
              )}
            </div>

            {/* Recent chats */}
            {convList.length > 0 && (
              <div className="w-full">
                <p className="text-xs font-black text-black mb-2 text-left uppercase tracking-wide">
                  Recent
                </p>
                <div className="flex flex-col gap-1.5">
                  {convList.slice(0, 4).map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() =>
                        router.push(`/workspace/${workspaceId}/${conv.id}`)
                      }
                      className="flex items-center gap-2.5 w-full rounded-xl border-[2px] border-black/10 bg-white px-3 py-2.5 text-left hover:border-black hover:shadow-[3px_3px_0px_#000] transition-all group"
                    >
                      <MessageSquare
                        size={13}
                        className="text-gray-400 shrink-0"
                      />
                      <span className="flex-1 truncate text-xs font-bold text-black">
                        {conv.title}
                      </span>
                      <ArrowRight
                        size={13}
                        className="text-gray-300 group-hover:text-black transition-colors shrink-0"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar — hidden on mobile */}
        <div className="hidden md:flex md:w-[260px] md:shrink-0 h-full">
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
          <div className="relative z-10 flex w-[300px] max-w-[85vw] h-full">
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
          <div className="relative z-10 flex w-[300px] max-w-[85vw] h-full">
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
