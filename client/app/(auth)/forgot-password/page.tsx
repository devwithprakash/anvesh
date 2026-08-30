"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { forgotPassword } from "@/features/auth/auth";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
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
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <div className="bg-[#FFD166] border-b-[3px] border-black px-8 py-5">
                <h1 className="text-2xl font-black text-black tracking-tight">
                  Forgot password? 🔑
                </h1>
                <p className="text-sm font-semibold text-black/70 mt-1">
                  We&apos;ll send a reset link to your inbox
                </p>
              </div>

              <div className="px-8 py-7 space-y-5">
                <motion.p {...fadeIn(0.06)} className="text-sm font-semibold text-gray-600 leading-relaxed">
                  Enter the email address associated with your account and we&apos;ll email you a link to reset your password.
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div {...fadeIn(0.1)} className="space-y-1.5">
                    <label className="block text-sm font-black text-black">Email address</label>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-[2.5px] border-black bg-[#FFFBF0] text-sm font-semibold text-black placeholder:text-black/30 outline-none focus:ring-2 focus:ring-[#6C47FF] focus:ring-offset-1 transition"
                      />
                    </div>
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border-[2px] border-[#FF6B6B] bg-[#FFF0F0] px-3 py-2 text-xs font-bold text-[#FF6B6B]"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.div {...fadeIn(0.16)}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-1 rounded-xl border-[3px] border-black bg-[#6C47FF] text-white text-sm font-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_#000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send reset link
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>
              </div>

              <motion.div
                {...fadeIn(0.2)}
                className="border-t-[3px] border-black bg-[#FFFBF0] px-8 py-4"
              >
                <Link
                  href="/signin"
                  className="flex items-center gap-2 text-sm font-black text-black hover:text-[#6C47FF] transition-colors"
                >
                  <ArrowLeft size={15} />
                  Back to sign in
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4 } }}
            >
              <div className="bg-[#00B87C] border-b-[3px] border-black px-8 py-5">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Email sent! ✉️
                </h1>
                <p className="text-sm font-semibold text-white/80 mt-1">
                  Check your inbox for the reset link
                </p>
              </div>

              <div className="px-8 py-8 space-y-6">
                <div className="flex justify-center">
                  <div className="flex size-20 items-center justify-center rounded-2xl border-[3px] border-black bg-[#F0FFF8] shadow-[4px_4px_0px_#000]">
                    <CheckCircle size={36} className="text-[#00B87C]" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                    We&apos;ve sent a password reset link to
                  </p>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border-[2px] border-black bg-[#EDE9FE] px-3 py-1.5">
                    <Mail size={13} className="text-[#6C47FF]" />
                    <span className="text-sm font-black text-[#6C47FF]">{email}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 leading-relaxed pt-1">
                    The link will expire in 1 hour. If you don&apos;t see it, check your spam folder.
                  </p>
                </div>

                <button
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-[2.5px] border-black bg-white px-4 py-2.5 text-sm font-black text-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                >
                  Try a different email
                </button>
              </div>

              <div className="border-t-[3px] border-black bg-[#FFFBF0] px-8 py-4">
                <Link
                  href="/signin"
                  className="flex items-center gap-2 text-sm font-black text-black hover:text-[#6C47FF] transition-colors"
                >
                  <ArrowLeft size={15} />
                  Back to sign in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.p
        {...fadeIn(0.28)}
        className="mt-5 text-center text-xs font-semibold text-black/40"
      >
        Remember your password?{" "}
        <Link href="/signin" className="underline hover:text-black/70">
          Sign in
        </Link>
      </motion.p>
    </div>
  );
}
