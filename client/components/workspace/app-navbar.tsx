'use client';

import { Easing, motion } from 'framer-motion';
import { ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PlanBadge } from '@/components/workspace/plan-banner';
import { WorkspaceDialog } from '@/components/workspace/workspace-dialog';
import { signOut } from '@/features/auth/auth';
import { authClient } from '@/lib/auth-client';

const itemVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as Easing },
  },
};

export function AppNavbar() {
  const router = useRouter();
  const [userOpen, setUserOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: session } = authClient.useSession();

  const user = session?.user;

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

          <div className="flex shrink-0 items-center gap-2">
            <PlanBadge />
            <div className="relative">
              <button
                onClick={() => setUserOpen(v => !v)}
                className="flex items-center gap-2 rounded-lg border-[2px] border-black bg-white px-3 py-1.5 text-sm font-bold text-black shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-black bg-[#EDE9FE] text-[10px] font-black text-[#6C47FF]">
                  {user?.name?.[0]}
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
