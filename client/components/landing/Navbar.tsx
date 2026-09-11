"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { authClient } from "../../lib/auth-client";
import { signOut } from "@/features/auth/auth";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" } as any,
  },
};

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Faq", href: "/#faq" },
    ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="sticky top-0 z-50 w-full bg-[#FFFBF0] border-b-[3px] border-black"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <motion.a
          variants={itemVariants}
          href="/"
          className="flex items-center gap-2.5 shrink-0"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border-2 border-black bg-[#6C47FF] text-white font-black text-sm shadow-[3px_3px_0px_#000] select-none">
            N
          </span>
          <span className="font-black text-lg text-black tracking-tight">
            Notebook
          </span>
        </motion.a>

        {/* Nav Links */}
        <motion.ul
          variants={containerVariants}
          className="hidden md:flex items-center gap-1"
        >
          {navLinks.map((link) => (
            <motion.li key={link.label} variants={itemVariants}>
              <a
                href={link.href}
                className="px-3 py-1.5 text-sm font-bold text-black rounded-lg hover:bg-black hover:text-[#FFFBF0] transition-colors"
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </motion.ul>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 shrink-0"
        >
          {user ? (
            <button
              onClick={handleLogOut}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl border-2 border-black bg-white text-black text-sm font-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Log Out
            </button>
          ) : (
            <a
              href="/signin"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl border-2 border-black bg-white text-black text-sm font-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            >
              Log in
            </a>
          )}

          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black bg-[#6C47FF] text-white text-sm font-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            Start for free
            <ArrowRight size={15} />
          </a>
        </motion.div>
      </div>
    </motion.nav>
  );
}
