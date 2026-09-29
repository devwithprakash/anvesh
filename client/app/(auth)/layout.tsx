'use client';

import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { authClient } from '@/lib/auth-client';

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace('/dashboard');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return null;
  }

  if (session?.user) {
    return null;
  }
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF0]">
      <header className="w-full border-b-[3px] border-black bg-[#FFFBF0]">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
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
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="border-t-[3px] border-black bg-[#FFFBF0] py-4 text-center text-xs font-bold text-black/50">
        © {new Date().getFullYear()} Anvesh. All rights reserved.
      </footer>
    </div>
  );
}
