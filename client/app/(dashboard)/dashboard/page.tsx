'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  Plus,
  Search,
  FileText,
  MessageSquare,
  Trash2,
  MoreHorizontal,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PlanBanner } from '@/components/workspace/plan-banner';
import { WorkspaceDialog } from '@/components/workspace/workspace-dialog';
import { useConversations } from '@/features/conversation/queries';
import { useSources } from '@/features/source/queries';
import { useDeleteWorkspace } from '@/features/workspace/mutations';
import { useWorkspaces } from '@/features/workspace/queries';
import { type Workspace } from '@/lib/mock-data';

const FLOATERS = [
  {
    symbol: '✦',
    color: '#6C47FF',
    size: 'text-4xl',
    top: '8%',
    left: '3%',
    delay: '0s',
    dur: '6s',
  },
  {
    symbol: '✳',
    color: '#FFD166',
    size: 'text-3xl',
    top: '15%',
    left: '88%',
    delay: '1s',
    dur: '8s',
  },
  {
    symbol: '◆',
    color: '#FF6B6B',
    size: 'text-2xl',
    top: '38%',
    left: '95%',
    delay: '2s',
    dur: '7s',
  },
  {
    symbol: '✦',
    color: '#00B87C',
    size: 'text-3xl',
    top: '62%',
    left: '2%',
    delay: '0.5s',
    dur: '9s',
  },
  {
    symbol: '✳',
    color: '#6C47FF',
    size: 'text-2xl',
    top: '78%',
    left: '91%',
    delay: '3s',
    dur: '6.5s',
  },
  {
    symbol: '◆',
    color: '#FFD166',
    size: 'text-4xl',
    top: '88%',
    left: '7%',
    delay: '1.5s',
    dur: '8.5s',
  },
  {
    symbol: '✦',
    color: '#FF6B6B',
    size: 'text-xl',
    top: '25%',
    left: '6%',
    delay: '2.5s',
    dur: '7.5s',
  },
  {
    symbol: '✳',
    color: '#00B87C',
    size: 'text-2xl',
    top: '50%',
    left: '93%',
    delay: '4s',
    dur: '6s',
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
          className={`pointer-events-none fixed font-black opacity-[0.18] select-none ${f.size}`}
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

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  const { data: sources, isPending: sourcesPending } = useSources(workspace.id);
  const { data: conversations, isPending: convsPending } = useConversations(
    workspace.id,
  );

  return (
    <div className="group relative h-full">
      <div
        onClick={() => router.push(`/workspace/${workspace.id}`)}
        className="flex h-full cursor-pointer flex-col gap-4 rounded-2xl border-[2.5px] border-black bg-white p-5 shadow-[4px_4px_0px_#000] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="truncate text-base leading-tight font-black text-black">
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
              onClick={e => {
                e.stopPropagation();
                setMenuOpen(v => !v);
              }}
              className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white opacity-0 shadow-[1px_1px_0px_#000] transition-all group-hover:opacity-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <div
                onClick={e => e.stopPropagation()}
                className="absolute top-full right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border-[2px] border-black bg-white shadow-[3px_3px_0px_#000]"
              >
                <div className="p-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      router.push(`/workspace/${workspace.id}`);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-gray-100"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleEditWorkspace(workspace)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(workspace.id);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[#FF6B6B] transition-colors hover:bg-[#FFF0F0]"
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
          className={`line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed ${
            workspace.description
              ? 'font-semibold text-gray-600'
              : 'font-medium text-gray-400 italic'
          }`}
        >
          {workspace.description || 'No description provided.'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 border-t-[2px] border-black/10 pt-3">
          {sourcesPending ? (
            <div className="h-4 w-16 animate-pulse rounded bg-black/5" />
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <FileText size={12} className="text-[#6C47FF]" />
              {sources?.length ?? 0}{' '}
              {sources?.length === 1 ? 'source' : 'sources'}
            </span>
          )}

          {convsPending ? (
            <div className="h-4 w-12 animate-pulse rounded bg-black/5" />
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <MessageSquare size={12} className="text-[#6C47FF]" />
              {conversations?.length ?? 0}{' '}
              {conversations?.length === 1 ? 'chat' : 'chats'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkspaceCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border-[2.5px] border-black bg-white p-5 shadow-[4px_4px_0px_#000]">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <div className="h-5 w-32 animate-pulse rounded-lg bg-black/10" />
          <div className="h-3 w-20 animate-pulse rounded bg-black/10" />
        </div>
        <div className="size-7 animate-pulse rounded-lg bg-black/10" />
      </div>
      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-full animate-pulse rounded bg-black/10" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-black/10" />
      </div>
      {/* Stats */}
      <div className="flex items-center gap-4 border-t-[2px] border-black/10 pt-3">
        <div className="h-4 w-16 animate-pulse rounded bg-black/10" />
        <div className="h-4 w-12 animate-pulse rounded bg-black/10" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null,
  );

  const { data: workspacesList, isPending: workspacesLoading } =
    useWorkspaces();
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
    ws =>
      ws.title.toLowerCase().includes(search.toLowerCase()) ||
      (ws.description?.toLowerCase() ?? '').includes(search.toLowerCase()),
  );

  const totalCount = workspacesList?.length ?? 0;

  return (
    <div>
      <FloatingSymbols />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border-[2px] border-black bg-[#EDE9FE] px-3 py-1 shadow-[2px_2px_0px_#000]">
              <Sparkles size={12} className="text-[#6C47FF]" />
              <span className="text-[11px] font-black tracking-wider text-[#6C47FF] uppercase">
                Your workspace
              </span>
            </div>
            <h1 className="text-4xl leading-tight font-black tracking-tight text-black">
              My Workspaces
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-gray-600">
              Organise your research, documents and AI conversations.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border-[2px] border-black bg-white px-3 py-2 shadow-[2px_2px_0px_#000]">
              <BookOpen size={13} className="text-[#6C47FF]" />
              {workspacesLoading ? (
                <div className="h-4 w-4 animate-pulse rounded bg-black/10" />
              ) : (
                <span className="text-sm font-black text-black">
                  {totalCount}
                </span>
              )}
              <span className="text-xs font-semibold text-gray-500">
                workspace{totalCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <PlanBanner />

        <div className="mb-6 flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search
              size={15}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search workspaces…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border-[2px] border-black bg-white pr-3 pl-9 text-sm font-semibold text-black shadow-[2px_2px_0px_#000] transition-all outline-none placeholder:text-gray-400 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
            />
          </div>
          <button
            onClick={handleCreateWorkspace}
            className="flex h-10 items-center gap-2 rounded-xl border-[2.5px] border-black bg-[#6C47FF] px-4 text-sm font-black text-white shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
          >
            <Plus size={16} />
            New workspace
          </button>
        </div>

        {workspacesLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Dashed "New workspace" placeholder — always visible */}
            <button
              onClick={() => setCreateOpen(true)}
              className="group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border-[2.5px] border-dashed border-black/40 bg-white/50 px-6 py-10 transition-all hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_#000]"
            >
              <div className="flex size-10 items-center justify-center rounded-xl border-[2px] border-black bg-[#EDE9FE] shadow-[2px_2px_0px_#000] transition-all group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none">
                <Plus size={20} className="text-[#6C47FF]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-black">New workspace</p>
                <p className="mt-0.5 text-xs font-semibold text-gray-500">
                  Start a new project
                </p>
              </div>
            </button>
            {/* Skeleton cards */}
            {Array.from({ length: 5 }).map((_, i) => (
              <WorkspaceCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 && !search ? (
          <div className="relative mt-4">
            <div className="overflow-hidden rounded-2xl border-[3px] border-black bg-white shadow-[6px_6px_0px_#000]">
              <div className="h-2 bg-[#6C47FF]" />
              <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center">
                <div className="relative">
                  <div className="flex size-20 items-center justify-center rounded-2xl border-[3px] border-black bg-[#EDE9FE] shadow-[5px_5px_0px_#000]">
                    <BookOpen size={36} className="text-[#6C47FF]" />
                  </div>
                  <span className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-xl border-[2px] border-black bg-[#FFD166] text-base shadow-[2px_2px_0px_#000]">
                    ✦
                  </span>
                </div>

                <div className="max-w-sm space-y-2">
                  <p className="text-2xl leading-tight font-black text-black">
                    Create your first workspace
                  </p>
                  <p className="text-sm leading-relaxed font-semibold text-gray-600">
                    A workspace holds your sources, conversations and AI
                    insights — all in one place.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { emoji: '📄', label: 'Upload PDFs' },
                    { emoji: '🌐', label: 'Import websites' },
                    { emoji: '▶️', label: 'YouTube videos' },
                    { emoji: '💬', label: 'AI chat' },
                  ].map(f => (
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
                  className="flex items-center gap-2 rounded-xl border-[3px] border-black bg-[#6C47FF] px-6 py-3 text-sm font-black text-white shadow-[5px_5px_0px_#000] transition-all hover:translate-x-[5px] hover:translate-y-[5px] hover:shadow-none"
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
              <p className="text-lg font-black text-black">
                No workspaces found
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-600">
                Try a different search term
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => setCreateOpen(true)}
              className="group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border-[2.5px] border-dashed border-black/40 bg-white/50 px-6 py-10 transition-all hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_#000]"
            >
              <div className="flex size-10 items-center justify-center rounded-xl border-[2px] border-black bg-[#EDE9FE] shadow-[2px_2px_0px_#000] transition-all group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none">
                <Plus size={20} className="text-[#6C47FF]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-black">New workspace</p>
                <p className="mt-0.5 text-xs font-semibold text-gray-500">
                  Start a new project
                </p>
              </div>
            </button>

            {filtered.map(ws => (
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

      <footer className="relative z-10 border-t-[2px] border-black/10 bg-[#FFFBF0]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border-[2px] border-black bg-[#6C47FF] text-[10px] font-black text-white shadow-[2px_2px_0px_#000]">
              A
            </span>
            <span className="text-sm font-black text-black">Anvesh</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <a href="/pricing" className="transition-colors hover:text-black">
              Pricing
            </a>
            <span>·</span>
            <a
              href="mailto:support@anvesh.ai"
              className="transition-colors hover:text-black"
            >
              Support
            </a>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B87C]" />
              All systems operational
            </span>
          </div>
          <p className="text-xs font-semibold text-gray-400">
            © {new Date().getFullYear()} Anvesh AI
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
