"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/features/auth/auth";

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

function getStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#FF6B6B" };
  if (score <= 2) return { score, label: "Fair", color: "#FFD166" };
  if (score <= 3) return { score, label: "Good", color: "#00B87C" };
  return { score, label: "Strong", color: "#00B87C" };
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const strength = useMemo(() => getStrength(password), [password]);
  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!token) { setError("Reset token is missing. Please use the link from your email."); return; }
    setIsLoading(true);
    setError("");
    try {
      await resetPassword(password, token);
      setSuccess(true);
      setTimeout(() => router.push("/signin"), 3000);
    } catch (err: any) {
      setError(err?.message ?? "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <motion.div {...fadeUp(0)} className="bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] overflow-hidden">
          <div className="bg-[#FF6B6B] border-b-[3px] border-black px-8 py-5">
            <h1 className="text-2xl font-black text-white tracking-tight">Invalid link 😕</h1>
            <p className="text-sm font-semibold text-white/80 mt-1">This reset link is missing or has expired</p>
          </div>
          <div className="px-8 py-8 space-y-4">
            <p className="text-sm font-semibold text-gray-600 leading-relaxed">
              Password reset links are single-use and expire after 1 hour. Please request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="flex items-center justify-center gap-2 w-full rounded-xl border-[3px] border-black bg-[#6C47FF] px-4 py-3 text-sm font-black text-white shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              Request new reset link
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <motion.div {...fadeUp(0)} className="bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] overflow-hidden">
          <div className="bg-[#00B87C] border-b-[3px] border-black px-8 py-5">
            <h1 className="text-2xl font-black text-white tracking-tight">Password updated! 🎉</h1>
            <p className="text-sm font-semibold text-white/80 mt-1">You&apos;re being redirected to sign in…</p>
          </div>
          <div className="px-8 py-8 flex flex-col items-center gap-5">
            <div className="flex size-20 items-center justify-center rounded-2xl border-[3px] border-black bg-[#F0FFF8] shadow-[4px_4px_0px_#000]">
              <CheckCircle size={36} className="text-[#00B87C]" />
            </div>
            <p className="text-sm font-semibold text-gray-600 text-center leading-relaxed">
              Your password has been reset. Redirecting you to sign in in a moment…
            </p>
            <Link
              href="/signin"
              className="flex items-center justify-center gap-2 w-full rounded-xl border-[3px] border-black bg-[#6C47FF] px-4 py-3 text-sm font-black text-white shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              Go to sign in <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <motion.div {...fadeUp(0)} className="bg-white border-[3px] border-black rounded-2xl shadow-[6px_6px_0px_#000] overflow-hidden">
        <div className="bg-[#6C47FF] border-b-[3px] border-black px-8 py-5">
          <h1 className="text-2xl font-black text-white tracking-tight">Set new password 🔒</h1>
          <p className="text-sm font-semibold text-white/80 mt-1">Choose a strong password for your account</p>
        </div>

        <div className="px-8 py-7 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New password */}
            <motion.div {...fadeIn(0.08)} className="space-y-1.5">
              <label className="block text-sm font-black text-black">New password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border-[2.5px] border-black bg-[#FFFBF0] text-sm font-semibold text-black placeholder:text-black/30 outline-none focus:ring-2 focus:ring-[#6C47FF] focus:ring-offset-1 transition"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="space-y-1 pt-0.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: strength.score >= i ? strength.color : "#E5E7EB" }} />
                    ))}
                  </div>
                  {strength.label && <p className="text-[11px] font-black" style={{ color: strength.color }}>{strength.label}</p>}
                </div>
              )}
            </motion.div>

            {/* Confirm password */}
            <motion.div {...fadeIn(0.12)} className="space-y-1.5">
              <label className="block text-sm font-black text-black">Confirm password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" />
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border-[2.5px] bg-[#FFFBF0] text-sm font-semibold text-black placeholder:text-black/30 outline-none focus:ring-2 focus:ring-offset-1 transition ${mismatch ? "border-[#FF6B6B] focus:ring-[#FF6B6B]" : "border-black focus:ring-[#6C47FF]"}`}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors">
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {mismatch && <p className="text-[11px] font-black text-[#FF6B6B]">Passwords do not match</p>}
            </motion.div>

            {/* Hint */}
            <motion.div {...fadeIn(0.15)} className="rounded-xl border-[2px] border-black/10 bg-[#FFFBF0] px-3 py-2.5">
              <p className="text-[11px] font-bold text-gray-500 leading-relaxed">
                Use at least 8 characters with a mix of uppercase, numbers, and symbols for a strong password.
              </p>
            </motion.div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border-[2px] border-[#FF6B6B] bg-[#FFF0F0] px-3 py-2 text-xs font-bold text-[#FF6B6B]">
                {error}
              </motion.div>
            )}

            <motion.div {...fadeIn(0.2)}>
              <button
                type="submit"
                disabled={isLoading || mismatch || password.length < 8}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-1 rounded-xl border-[3px] border-black bg-[#6C47FF] text-white text-sm font-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_#000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Reset password <ArrowRight size={15} /></>
                )}
              </button>
            </motion.div>
          </form>
        </div>

        <motion.div {...fadeIn(0.24)} className="border-t-[3px] border-black bg-[#FFFBF0] px-8 py-4 text-center">
          <p className="text-sm font-semibold text-black/70">
            Remember your password?{" "}
            <Link href="/signin" className="font-black text-[#6C47FF] hover:underline underline-offset-2">Sign in</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
