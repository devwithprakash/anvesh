"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Plus,
  Search,
  FileText,
  MessageSquare,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { useAppState } from "@/components/providers/app-provider";
import { AppNavbar } from "@/components/workspace/app-navbar";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { type Workspace } from "@/lib/mock-data";
import { useWorkspaces } from "@/features/workspace/queries";
import { useDeleteWorkspace } from "@/features/workspace/mutations";
import { useSources } from "@/features/source/queries";
import { useConversations } from "@/features/conversation/queries";

// ─── Workspace Card ───────────────────────────────────────────────────────────

function WorkspaceCard({
  workspace,
  onDelete,
}: {
  workspace: Workspace;
  onDelete: (id: string) => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: sources } = useSources(workspace.id);
  const { data: conversations } = useConversations(workspace.id);

  return (
    <div className="relative group">
      <div
        onClick={() => router.push(`/workspace/${workspace.id}`)}
        className="flex flex-col gap-4 rounded-2xl border-[2.5px] border-black bg-white p-5 cursor-pointer shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
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
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-36 rounded-xl border-[2px] border-black bg-white shadow-[3px_3px_0px_#000] overflow-hidden">
                  <div className="p-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        router.push(`/workspace/${workspace.id}`);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold hover:bg-gray-100 transition-colors"
                    >
                      Open
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {workspace.description && (
          <p className="text-xs font-semibold text-gray-600 line-clamp-2 leading-relaxed">
            {workspace.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 pt-3 border-t-[2px] border-black/10">
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <FileText size={12} />
            {sources?.length} sources
          </span>
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <MessageSquare size={12} />
            {conversations?.length} chats
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
  const { workspaces } = useAppState();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = workspaces.filter(
    (ws) =>
      ws.title.toLowerCase().includes(search.toLowerCase()) ||
      (ws.description?.toLowerCase() ?? "").includes(search.toLowerCase()),
  );

  const { data: workspacesList, error } = useWorkspaces();

  const deleteWorkspace = useDeleteWorkspace();

  const handleDeleteWorkspace = async (workspaceId: string) => {
    try {
      const response = await deleteWorkspace.mutateAsync(workspaceId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-svh bg-[#FFFBF0]">
      {/* Dot grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <AppNavbar />

      <main className="relative flex-1 mx-auto w-full max-w-5xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-black text-3xl text-black tracking-tight">
            My Workspaces
          </h1>
          <p className="mt-1.5 text-sm font-semibold text-gray-600">
            Organise your research, documents and AI conversations.
          </p>
        </div>

        {/* Toolbar */}
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
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[#6C47FF] px-4 h-10 text-sm font-black text-white shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            <Plus size={16} />
            New workspace
          </button>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border-[3px] border-black bg-white shadow-[4px_4px_0px_#000]">
              <FileText size={28} className="text-black" />
            </div>
            <div>
              <p className="font-black text-lg text-black">
                {search ? "No workspaces found" : "No workspaces yet"}
              </p>
              <p className="text-sm font-semibold text-gray-600 mt-1">
                {search
                  ? "Try a different search term"
                  : "Create your first workspace to get started"}
              </p>
            </div>
            {!search && (
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-[#6C47FF] px-5 py-2.5 text-sm font-black text-white shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
              >
                <Plus size={16} />
                Create workspace
              </button>
            )}
          </div>
        ) : (
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

            {workspacesList?.map((ws) => (
              <WorkspaceCard
                key={ws.id}
                workspace={ws}
                onDelete={handleDeleteWorkspace}
              />
            ))}
          </div>
        )}

        {/* Decorative symbols section to keep visual balance */}
        <div className="mt-16 pt-8 border-t-[2px] border-black/10 flex items-center justify-center gap-12 overflow-hidden pointer-events-none select-none">
          <span className="text-3xl text-[#6C47FF] opacity-40 font-black animate-pulse">
            ✳
          </span>
          <span
            className="text-4xl text-[#FFE14D] font-black"
            style={{ WebkitTextStroke: "1.5px black" }}
          >
            ✦
          </span>
          <span className="text-2xl text-[#FF6B6B] opacity-50 font-black">
            ✦
          </span>
          <span className="text-3xl text-[#00B87C] opacity-40 font-black">
            ✳
          </span>
        </div>
      </main>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
