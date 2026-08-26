"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { signIn } from "@/features/auth/auth";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay } as any,
  },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut", delay } as any,
  },
});

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await signIn(form);

      console.log("Signin response: ", response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        {...fadeUp(0)}
        className="bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] overflow-hidden"
      >
        {/* Card header stripe */}
        <div className="bg-[#6C47FF] border-b-[3px] border-black px-8 py-5">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome back 👋
          </h1>
          <p className="text-sm font-semibold text-white/80 mt-1">
            Sign in to your Notebook account
          </p>
        </div>

        <div className="px-8 py-7 space-y-5">
          {/* Google Sign-in */}
          <motion.div {...fadeIn(0.05)}>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-[3px] border-black bg-white font-black text-sm text-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              {/* Google brand SVG */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div {...fadeIn(0.1)} className="flex items-center gap-3">
            <div className="flex-1 h-[2px] bg-black/10" />
            <span className="text-xs font-black text-black/40 uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-[2px] bg-black/10" />
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <motion.div {...fadeIn(0.12)} className="space-y-1.5">
              <label className="block text-sm font-black text-black">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none"
                />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-[2.5px] border-black bg-[#FFFBF0] text-sm font-semibold text-black placeholder:text-black/30 outline-none focus:ring-2 focus:ring-[#6C47FF] focus:ring-offset-1 transition"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div {...fadeIn(0.16)} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-black text-black">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-black text-[#6C47FF] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="w-full pl-10 pr-11 py-3 rounded-xl border-[2.5px] border-black bg-[#FFFBF0] text-sm font-semibold text-black placeholder:text-black/30 outline-none focus:ring-2 focus:ring-[#6C47FF] focus:ring-offset-1 transition"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </motion.div>

            {/* Submit — motion.div wrapper owns the fade, plain button owns CSS hover */}
            <motion.div {...fadeIn(0.2)}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-1 rounded-xl border-[3px] border-black bg-[#6C47FF] text-white text-sm font-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_#000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </div>

        {/* Card footer */}
        <motion.div
          {...fadeIn(0.24)}
          className="border-t-[3px] border-black bg-[#FFFBF0] px-8 py-4 text-center"
        >
          <p className="text-sm font-semibold text-black/70">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-black text-[#6C47FF] hover:underline underline-offset-2"
            >
              Create one free
            </Link>
          </p>
        </motion.div>
      </motion.div>

      {/* Terms note */}
      <motion.p
        {...fadeIn(0.28)}
        className="mt-5 text-center text-xs font-semibold text-black/40"
      >
        By continuing, you agree to Notebook&apos;s{" "}
        <a href="#" className="underline hover:text-black/70">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-black/70">
          Privacy Policy
        </a>
        .
      </motion.p>
    </div>
  );
}
