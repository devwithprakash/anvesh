"use client";

import { useEffect, useState } from "react";
import { useAppState } from "@/components/providers/app-provider";
import { AppNavbar } from "@/components/workspace/app-navbar";
import { ConversationList } from "@/components/workspace/conversation-list";
import { SourcesPanel } from "@/components/workspace/sources-panel";
import { ChatInterface } from "@/components/chat/chat-interface";

export function ConversationPageInner({
  workspaceId,
  conversationId,
}: {
  workspaceId: string;
  conversationId: string;
}) {
  const { workspaces } = useAppState();
  const workspace = workspaces.find((ws) => ws.id === workspaceId);

  const [chatsOpen, setChatsOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);


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

  return (
    <div className="flex flex-col bg-[#FFFBF0]" style={{ height: "100svh" }}>
      <AppNavbar activeWorkspaceId={workspaceId} />

      {/* Three-panel body */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* ── Left sidebar: hidden on mobile, always visible on md+ ── */}
        <div className="hidden md:flex md:w-[260px] md:shrink-0 h-full">
          <ConversationList
            workspaceId={workspaceId}
            activeConversationId={conversationId === "new" ? undefined : conversationId}
          />
        </div>

        {/* ── Center: chat (takes remaining space) ── */}
        <ChatInterface
          workspaceId={workspaceId}
          conversationId={conversationId === "new" ? undefined : conversationId}
          onOpenChats={() => setChatsOpen(true)}
          onOpenSources={() => setSourcesOpen(true)}
        />

        {/* ── Right sidebar: hidden on mobile, always visible on md+ ── */}
        <div className="hidden md:flex md:w-[260px] md:shrink-0 h-full">
          <SourcesPanel workspaceId={workspaceId} />
        </div>
      </div>

      {/* ── Mobile: Chats slide-over ── */}
      {chatsOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setChatsOpen(false)}
          />
          {/* Drawer from left */}
          <div className="relative z-10 flex w-[300px] max-w-[85vw] h-full">
            <ConversationList
              workspaceId={workspaceId}
              activeConversationId={conversationId === "new" ? undefined : conversationId}
              onClose={() => setChatsOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Mobile: Sources slide-over ── */}
      {sourcesOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSourcesOpen(false)}
          />
          {/* Drawer from right */}
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
