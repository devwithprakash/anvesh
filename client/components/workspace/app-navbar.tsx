"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, Plus } from "lucide-react";
import { useAppState } from "@/components/providers/app-provider";
import { WorkspaceDialog } from "@/components/workspace/workspace-dialog";
import { PlanBadge } from "@/components/workspace/plan-banner";
import { authClient } from "@/lib/auth-client";
import { signOut } from "@/features/auth/auth";

interface AppNavbarProps {
  activeWorkspaceId?: string;
}

export function AppNavbar({ activeWorkspaceId }: AppNavbarProps) {
  const router = useRouter();
  const { workspaces } = useAppState();
  const [wsOpen, setWsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const activeWs = workspaces.find((ws) => ws.id === activeWorkspaceId);

  const handleLogOut = async () => {
    try {
      await signOut();

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#FFFBF0] border-b-[3px] border-black">
        <div className="flex items-center justify-between px-5 h-14 gap-4">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2.5 shrink-0"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border-[2px] border-black bg-[#6C47FF] text-white font-black text-sm shadow-[2px_2px_0px_#000]">
              N
            </span>
            <span className="font-black text-base text-black tracking-tight hidden sm:block">
              Notebook
            </span>
          </button>

          {/* Workspace switcher — center */}
          {activeWs ? (
            <div className="relative flex-1 flex justify-center">
              <button
                onClick={() => setWsOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-[2px] border-black bg-white font-bold text-sm text-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all max-w-xs"
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
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-20 min-w-[220px] rounded-xl border-[2.5px] border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden">
                    <div className="p-1.5 flex flex-col gap-0.5">
                      {workspaces.map((ws) => (
                        <button
                          key={ws.id}
                          onClick={() => {
                            router.push(`/workspace/${ws.id}`);
                            setWsOpen(false);
                          }}
                          className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm text-left font-bold transition-colors ${
                            ws.id === activeWorkspaceId
                              ? "bg-[#EDE9FE] text-[#6C47FF]"
                              : "hover:bg-gray-100 text-black"
                          }`}
                        >
                          <span className="truncate">{ws.title}</span>
                          {ws.id === activeWorkspaceId && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6C47FF] shrink-0" />
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
                        className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-bold text-black hover:bg-gray-100 transition-colors"
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
          <div className="flex items-center gap-2 shrink-0">
            <PlanBadge />
            <div className="relative">
            <button
              onClick={() => setUserOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-[2px] border-black bg-white font-bold text-sm text-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EDE9FE] border-[1.5px] border-black text-[10px] font-black text-[#6C47FF]">
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
                <div className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border-[2.5px] border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden">
                  <div className="p-1.5 flex flex-col gap-0.5">
                    <button className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm font-bold text-black hover:bg-gray-100 transition-colors">
                      <Settings size={14} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogOut}
                      className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-sm font-bold text-[#FF6B6B] hover:bg-[#FFF0F0] transition-colors"
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
