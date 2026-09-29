'use client';

import { Easing, motion } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { sendVerificationEmail } from '@/features/auth/auth';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as Easing, delay },
  },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' as Easing, delay },
  },
});

const RESEND_COOLDOWN = 60;

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || cooldown > 0 || isSending) return;
    setIsSending(true);
    try {
      await sendVerificationEmail(email);
      setSent(true);
      setCooldown(RESEND_COOLDOWN);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        {...fadeUp(0)}
        className="overflow-hidden rounded-2xl border-[3px] border-black bg-white shadow-[6px_6px_0px_#000]"
      >
        <div className="border-b-[3px] border-black bg-[#00B87C] px-8 py-5">
          <h1 className="text-2xl font-black tracking-tight text-white">
            Check your inbox 📬
          </h1>
          <p className="mt-1 text-sm font-semibold text-white/80">
            We&apos;ve sent you a verification link
          </p>
        </div>

        <div className="space-y-6 px-8 py-8">
          <motion.div {...fadeIn(0.08)} className="flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-2xl border-[3px] border-black bg-[#FFFBF0] shadow-[4px_4px_0px_#000]">
              <Mail size={36} className="text-black" />
            </div>
          </motion.div>

          <motion.div {...fadeIn(0.12)} className="space-y-2 text-center">
            <p className="text-sm leading-relaxed font-semibold text-gray-700">
              We sent a verification email to
            </p>
            {email && (
              <div className="inline-flex items-center gap-1.5 rounded-lg border-[2px] border-black bg-[#EDE9FE] px-3 py-1.5">
                <Mail size={13} className="text-[#6C47FF]" />
                <span className="text-sm font-black text-[#6C47FF]">
                  {email}
                </span>
              </div>
            )}
            <p className="pt-1 text-sm leading-relaxed font-semibold text-gray-600">
              Click the link in the email to verify your account and get
              started.
            </p>
          </motion.div>

          <motion.div
            {...fadeIn(0.16)}
            className="space-y-2.5 rounded-xl border-[2px] border-black bg-[#FFFBF0] p-4"
          >
            {[
              'Open the email from Anvesh',
              'Click the "Verify email" button',
              "You'll be signed in automatically",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-[2px] border-black bg-white text-[10px] font-black">
                  {i + 1}
                </span>
                <span className="text-xs leading-5 font-semibold text-gray-700">
                  {step}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div {...fadeIn(0.2)} className="space-y-2">
            {sent && (
              <div className="flex items-center gap-2 rounded-lg border-[2px] border-[#00B87C] bg-[#F0FFF8] px-3 py-2">
                <CheckCircle size={14} className="text-[#00B87C]" />
                <span className="text-xs font-bold text-[#00B87C]">
                  Verification email resent!
                </span>
              </div>
            )}
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || isSending || !email}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-[2.5px] border-black bg-white px-4 py-2.5 text-sm font-black text-black shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0px_#000]"
            >
              {isSending ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
              ) : (
                <RefreshCw size={14} />
              )}
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : 'Resend verification email'}
            </button>
          </motion.div>
        </div>

        <motion.div
          {...fadeIn(0.24)}
          className="border-t-[3px] border-black bg-[#FFFBF0] px-8 py-4"
        >
          <Link
            href="/signin"
            className="flex items-center gap-2 text-sm font-black text-black transition-colors hover:text-[#6C47FF]"
          >
            <ArrowLeft size={15} />
            Back to sign in
          </Link>
        </motion.div>
      </motion.div>

      <motion.p
        {...fadeIn(0.28)}
        className="mt-5 text-center text-xs font-semibold text-black/40"
      >
        Didn&apos;t receive anything? Check your spam folder.
      </motion.p>
    </div>
  );
}
