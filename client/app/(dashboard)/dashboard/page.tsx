"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Plus,
  Search,
  FileText,
  MessageSquare,
  Trash2,
  MoreHorizontal,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { AppNavbar } from "@/components/workspace/app-navbar";
import { WorkspaceDialog } from "@/components/workspace/workspace-dialog";
import { PlanBanner } from "@/components/workspace/plan-banner";
import { type Workspace } from "@/lib/mock-data";
import { useWorkspaces } from "@/features/workspace/queries";
import { useDeleteWorkspace } from "@/features/workspace/mutations";
import { useSources } from "@/features/source/queries";
import { useConversations } from "@/features/conversation/queries";

// ─── Floating decorative symbols ─────────────────────────────────────────────

const FLOATERS = [
  {
    symbol: "✦",
    color: "#6C47FF",
    size: "text-4xl",
    top: "8%",
    left: "3%",
    delay: "0s",
    dur: "6s",
  },
  {
    symbol: "✳",
    color: "#FFD166",
    size: "text-3xl",
    top: "15%",
    left: "88%",
    delay: "1s",
    dur: "8s",
  },
  {
    symbol: "◆",
    color: "#FF6B6B",
    size: "text-2xl",
    top: "38%",
    left: "95%",
    delay: "2s",
    dur: "7s",
  },
  {
    symbol: "✦",
    color: "#00B87C",
    size: "text-3xl",
    top: "62%",
    left: "2%",
    delay: "0.5s",
    dur: "9s",
  },
  {
    symbol: "✳",
    color: "#6C47FF",
    size: "text-2xl",
    top: "78%",
    left: "91%",
    delay: "3s",
    dur: "6.5s",
  },
  {
    symbol: "◆",
    color: "#FFD166",
    size: "text-4xl",
    top: "88%",
    left: "7%",
    delay: "1.5s",
    dur: "8.5s",
  },
  {
    symbol: "✦",
    color: "#FF6B6B",
    size: "text-xl",
    top: "25%",
    left: "6%",
    delay: "2.5s",
    dur: "7.5s",
  },
  {
    symbol: "✳",
    color: "#00B87C",
    size: "text-2xl",
    top: "50%",
    left: "93%",
    delay: "4s",
    dur: "6s",
  },
];

function FloatingSymbols() {
  return (
    <>
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(15deg); }
        }
      `}</style>
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className={`fixed pointer-events-none select-none font-black opacity-[0.18] ${f.size}`}
          style={{
            top: f.top,
            left: f.left,
            color: f.color,
            animation: `floatY ${f.dur} ease-in-out ${f.delay} infinite`,
            zIndex: 0,
          }}
        >
          {f.symbol}
        </span>
      ))}
    </>
  );
}

// ─── Workspace Card ───────────────────────────────────────────────────────────

function WorkspaceCard({
  workspace,
  onDelete,
  handleEditWorkspace,
}: {
  workspace: Workspace;
  onDelete: (id: string) => void;
  handleEditWorkspace: (workspace: Workspace) => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = () => {
      setMenuOpen(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  const { data: sources } = useSources(workspace.id);
  const { data: conversations } = useConversations(workspace.id);

  return (
    <div className="relative group h-full">
      <div
        onClick={() => router.push(`/workspace/${workspace.id}`)}
        className="flex flex-col gap-4 rounded-2xl border-[2.5px] border-black bg-white p-5 cursor-pointer shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all h-full"
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-black text-base text-black truncate leading-tight">
              {workspace.title}
            </h3>
            <span className="text-xs font-semibold text-gray-500">
              {formatDistanceToNow(new Date(workspace.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Menu button */}
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white opacity-0 group-hover:opacity-100 shadow-[1px_1px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 z-20 w-36 rounded-xl border-[2px] border-black bg-white shadow-[3px_3px_0px_#000] overflow-hidden"
              >
                <div className="p-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(`/workspace/${workspace.id}`);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold hover:bg-gray-100 transition-colors"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleEditWorkspace(workspace)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(workspace.id);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[#FF6B6B] hover:bg-[#FFF0F0] transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p
          className={`text-xs line-clamp-2 leading-relaxed min-h-[2.5rem] ${
            workspace.description
              ? "font-semibold text-gray-600"
              : "font-medium text-gray-400 italic"
          }`}
        >
          {workspace.description || "No description provided."}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 pt-3 border-t-[2px] border-black/10">
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <FileText size={12} />
            {sources?.length ?? 0} sources
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <MessageSquare size={12} />
            {conversations?.length ?? 0} chats
          </span>
          <span className="ml-auto rounded-full border-[1.5px] border-black bg-[#EDE9FE] px-2 py-0.5 text-[10px] font-black text-[#6C47FF]">
            {workspace.defaultModel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null,
  );

  const { data: workspacesList, error } = useWorkspaces();
  const deleteWorkspace = useDeleteWorkspace();

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      await deleteWorkspace.mutateAsync(workspaceId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateWorkspace = () => {
    setEditingWorkspace(null);
    setCreateOpen(true);
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setCreateOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setCreateOpen(open);

    if (!open) {
      setEditingWorkspace(null);
    }
  };

  const filtered = (workspacesList ?? []).filter(
    (ws) =>
      ws.title.toLowerCase().includes(search.toLowerCase()) ||
      (ws.description?.toLowerCase() ?? "").includes(search.toLowerCase()),
  );

  const totalCount = workspacesList?.length ?? 0;

  return (
    <div className="flex flex-col flex-1 min-h-svh bg-[#FFFBF0]">
      {/* Dot grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <FloatingSymbols />

      <AppNavbar />

      <main className="relative z-10 flex-1 mx-auto w-full max-w-5xl px-6 py-10">
        {/* ── Hero header ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-[2px] border-black bg-[#EDE9FE] px-3 py-1 mb-3 shadow-[2px_2px_0px_#000]">
              <Sparkles size={12} className="text-[#6C47FF]" />
              <span className="text-[11px] font-black text-[#6C47FF] uppercase tracking-wider">
                Your workspace
              </span>
            </div>
            <h1 className="font-black text-4xl text-black tracking-tight leading-tight">
              My Workspaces
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-gray-600">
              Organise your research, documents and AI conversations.
            </p>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 rounded-xl border-[2px] border-black bg-white px-3 py-2 shadow-[2px_2px_0px_#000]">
              <BookOpen size={13} className="text-[#6C47FF]" />
              <span className="text-sm font-black text-black">
                {totalCount}
              </span>
              <span className="text-xs font-semibold text-gray-500">
                workspace{totalCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* ── Plan & Usage Banner ── */}
        <PlanBanner />

        {/* ── Toolbar ── */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search workspaces…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border-[2px] border-black bg-white pl-9 pr-3 text-sm font-semibold text-black placeholder:text-gray-400 shadow-[2px_2px_0px_#000] outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
            />
          </div>
          <button
            onClick={handleCreateWorkspace}
            className="flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[#6C47FF] px-4 h-10 text-sm font-black text-white shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            <Plus size={16} />
            New workspace
          </button>
        </div>

        {/* ── Grid / Empty state ── */}
        {filtered.length === 0 && !search ? (
          /* Beautiful empty state */
          <div className="relative mt-4">
            {/* Big hero empty card */}
            <div className="rounded-2xl border-[3px] border-black bg-white shadow-[6px_6px_0px_#000] overflow-hidden">
              {/* Coloured top stripe */}
              <div className="h-2 bg-[#6C47FF]" />
              <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center">
                {/* Icon cluster */}
                <div className="relative">
                  <div className="flex size-20 items-center justify-center rounded-2xl border-[3px] border-black bg-[#EDE9FE] shadow-[5px_5px_0px_#000]">
                    <BookOpen size={36} className="text-[#6C47FF]" />
                  </div>
                  <span className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-xl border-[2px] border-black bg-[#FFD166] shadow-[2px_2px_0px_#000] text-base">
                    ✦
                  </span>
                </div>

                <div className="space-y-2 max-w-sm">
                  <p className="font-black text-2xl text-black leading-tight">
                    Create your first workspace
                  </p>
                  <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                    A workspace holds your sources, conversations and AI
                    insights — all in one place.
                  </p>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { emoji: "📄", label: "Upload PDFs" },
                    { emoji: "🌐", label: "Import websites" },
                    { emoji: "▶️", label: "YouTube videos" },
                    { emoji: "💬", label: "AI chat" },
                  ].map((f) => (
                    <span
                      key={f.label}
                      className="inline-flex items-center gap-1.5 rounded-full border-[2px] border-black bg-[#FFFBF0] px-3 py-1 text-xs font-bold shadow-[1px_1px_0px_#000]"
                    >
                      {f.emoji} {f.label}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setCreateOpen(true)}
                  className="flex items-center gap-2 rounded-xl border-[3px] border-black bg-[#6C47FF] px-6 py-3 text-sm font-black text-white shadow-[5px_5px_0px_#000] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
                >
                  <Plus size={16} />
                  Create my first workspace
                </button>
              </div>
            </div>
          </div>
        ) : filtered.length === 0 && search ? (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border-[3px] border-black bg-white shadow-[4px_4px_0px_#000]">
              <Search size={24} className="text-black" />
            </div>
            <div>
              <p className="font-black text-lg text-black">
                No workspaces found
              </p>
              <p className="text-sm font-semibold text-gray-600 mt-1">
                Try a different search term
              </p>
            </div>
          </div>
        ) : (
          /* Workspace grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Create new card */}
            <button
              onClick={() => setCreateOpen(true)}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border-[2.5px] border-dashed border-black/40 bg-white/50 px-6 py-10 hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_#000] transition-all min-h-[180px] group"
            >
              <div className="flex size-10 items-center justify-center rounded-xl border-[2px] border-black bg-[#EDE9FE] shadow-[2px_2px_0px_#000] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                <Plus size={20} className="text-[#6C47FF]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-black">New workspace</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">
                  Start a new project
                </p>
              </div>
            </button>

            {filtered.map((ws) => (
              <WorkspaceCard
                key={ws.id}
                workspace={ws}
                onDelete={handleDeleteWorkspace}
                handleEditWorkspace={handleEditWorkspace}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t-[2px] border-black/10 bg-[#FFFBF0]">
        <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md border-[2px] border-black bg-[#6C47FF] text-white font-black text-[10px] shadow-[2px_2px_0px_#000]">
              N
            </span>
            <span className="font-black text-sm text-black">Notebook</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <a href="/pricing" className="hover:text-black transition-colors">
              Pricing
            </a>
            <span>·</span>
            <a
              href="mailto:support@notebook.ai"
              className="hover:text-black transition-colors"
            >
              Support
            </a>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B87C] animate-pulse" />
              All systems operational
            </span>
          </div>
          <p className="text-xs font-semibold text-gray-400">
            © {new Date().getFullYear()} Notebook AI
          </p>
        </div>
      </footer>

      <WorkspaceDialog
        workspace={editingWorkspace}
        open={createOpen}
        onOpenChange={handleDialogChange}
      />
    </div>
  );
}
