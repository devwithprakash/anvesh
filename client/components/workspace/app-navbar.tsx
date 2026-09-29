'use client';

import { Easing, motion } from 'framer-motion';
import { ChevronDown, LogOut, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAppState } from '@/components/providers/app-provider';
import { PlanBadge } from '@/components/workspace/plan-banner';
import { WorkspaceDialog } from '@/components/workspace/workspace-dialog';
import { signOut } from '@/features/auth/auth';
import { authClient } from '@/lib/auth-client';

interface AppNavbarProps {
  activeWorkspaceId?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as Easing },
  },
};

export function AppNavbar({ activeWorkspaceId }: AppNavbarProps) {
  const router = useRouter();
  const { workspaces } = useAppState();
  const [wsOpen, setWsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const user = session?.user;

  const activeWs = workspaces.find(ws => ws.id === activeWorkspaceId);

  const handleLogOut = async () => {
    try {
      await signOut();

      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-[#FFFBF0]">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          {/* Logo */}
          <motion.a
            variants={itemVariants}
            href="/"
            className="flex shrink-0 items-center"
          >
            <svg
              className="anvesh-logo"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className="anvesh-shadow">
                <rect
                  x="34"
                  y="34"
                  width="132"
                  height="132"
                  rx="32"
                  fill="#0D0D0D"
                />
              </g>
              <g className="anvesh-body">
                <rect
                  x="26"
                  y="26"
                  width="132"
                  height="132"
                  rx="32"
                  fill="#6C5CE7"
                  stroke="#0D0D0D"
                  strokeWidth="6"
                />
                <circle
                  cx="80"
                  cy="86"
                  r="32"
                  fill="none"
                  stroke="#FBF7EC"
                  strokeWidth="9"
                />
                <path
                  d="M67,98 L80,64 L93,98"
                  fill="none"
                  stroke="#FBF7EC"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g className="anvesh-handle">
                  <line
                    x1="103"
                    y1="109"
                    x2="122"
                    y2="128"
                    stroke="#FBF7EC"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <line
                    x1="122"
                    y1="128"
                    x2="136"
                    y2="142"
                    stroke="#0D0D0D"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            </svg>
            <span className="text-lg font-black tracking-tight text-black">
              Anvesh
            </span>
          </motion.a>

          {activeWs ? (
            <div className="relative flex flex-1 justify-center">
              <button
                onClick={() => setWsOpen(v => !v)}
                className="flex max-w-xs items-center gap-2 rounded-lg border-[2px] border-black bg-white px-3 py-1.5 text-sm font-bold text-black shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <span className="truncate">{activeWs.title}</span>
                <ChevronDown size={14} className="shrink-0" />
              </button>

              {wsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setWsOpen(false)}
                  />
                  <div className="absolute top-full left-1/2 z-20 mt-2 min-w-[220px] -translate-x-1/2 overflow-hidden rounded-xl border-[2.5px] border-black bg-white shadow-[4px_4px_0px_#000]">
                    <div className="flex flex-col gap-0.5 p-1.5">
                      {workspaces.map(ws => (
                        <button
                          key={ws.id}
                          onClick={() => {
                            router.push(`/workspace/${ws.id}`);
                            setWsOpen(false);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-bold transition-colors ${
                            ws.id === activeWorkspaceId
                              ? 'bg-[#EDE9FE] text-[#6C47FF]'
                              : 'text-black hover:bg-gray-100'
                          }`}
                        >
                          <span className="truncate">{ws.title}</span>
                          {ws.id === activeWorkspaceId && (
                            <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#6C47FF]" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="border-t-[2px] border-black p-1.5">
                      <button
                        onClick={() => {
                          setWsOpen(false);
                          setCreateOpen(true);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-100"
                      >
                        <Plus size={14} />
                        New workspace
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* User menu — right */}
          <div className="flex shrink-0 items-center gap-2">
            <PlanBadge />
            <div className="relative">
              <button
                onClick={() => setUserOpen(v => !v)}
                className="flex items-center gap-2 rounded-lg border-[2px] border-black bg-white px-3 py-1.5 text-sm font-bold text-black shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-black bg-[#EDE9FE] text-[10px] font-black text-[#6C47FF]">
                  {user?.name[0]}
                </span>
                <span className="hidden sm:block">{user?.name}</span>
                <ChevronDown size={14} />
              </button>

              {userOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserOpen(false)}
                  />
                  <div className="absolute top-full right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border-[2.5px] border-black bg-white shadow-[4px_4px_0px_#000]">
                    <div className="flex flex-col gap-0.5 p-1.5">
                      <button
                        onClick={handleLogOut}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-bold text-[#FF6B6B] transition-colors hover:bg-[#FFF0F0]"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <WorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
