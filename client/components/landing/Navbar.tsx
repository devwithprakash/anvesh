'use client';

import { Easing, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { signOut } from '@/features/auth/auth';

import { authClient } from '../../lib/auth-client';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as Easing },
  },
};

export default function Navbar() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const handleLogOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Faq', href: '/#faq' },
  ];

  const links = user
    ? [...navLinks, { label: 'Dashboard', href: '/dashboard' }]
    : navLinks;

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-[#FFFBF0]"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6">
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

        {/* Nav Links */}

        {!authLoading && (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden items-center gap-1 lg:flex"
          >
            {links.map(link => (
              <motion.li key={link.label} variants={itemVariants}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-1.5 text-sm font-bold text-black transition-colors hover:bg-black hover:text-[#FFFBF0]"
                >
                  {link.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex shrink-0 items-center gap-3"
        >
          {user ? (
            <button
              onClick={handleLogOut}
              className="hidden items-center rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-black text-black shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none sm:inline-flex"
            >
              Log Out
            </button>
          ) : (
            <a
              href="/signin"
              className="hidden items-center rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-black text-black shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none sm:inline-flex"
            >
              Log in
            </a>
          )}

          <a
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#6C47FF] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
          >
            Start for free
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </motion.nav>
  );
}
