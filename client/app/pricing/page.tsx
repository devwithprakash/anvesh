"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  Zap,
  Crown,
  Star,
  Loader,
  Plus,
  Minus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { authClient } from "@/lib/auth-client";
import { useCreateCheckout } from "@/features/subscription/mutations";
import { useSubscriptionStatus } from "@/features/subscription/queries";
import type { CheckoutResponse } from "@/features/subscription/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}


const plans = [
  {
    name: "Free",
    planKey: "FREE",
    price: "₹0",
    period: "forever",
    desc: "Perfect for getting started and exploring your first notebooks.",
    icon: <Star size={22} />,
    iconBg: "bg-[#FFE14D]",
    cardBg: "bg-white",
    cta: "Start for free",
    ctaBg: "bg-white",
    ctaText: "text-black",
    popular: false,
    features: [
      "3 workspaces",
      "Up to 10 sources per workspace",
      "50 AI queries / month",
      "PDF & document upload",
      "Community support",
    ],
  },
  {
    name: "Pro",
    planKey: "PRO",
    price: "₹299",
    period: "per month",
    desc: "For power users who want more workspaces, queries and web search.",
    icon: <Zap size={22} />,
    iconBg: "bg-[#6C47FF]",
    cardBg: "bg-[#6C47FF]",
    cta: "Upgrade to Pro",
    ctaBg: "bg-[#FFE14D]",
    ctaText: "text-black",
    popular: true,
    features: [
      "20 workspaces",
      "Up to 50 sources per workspace",
      "500 AI queries / month",
      "Web search powered answers",
      "Priority support",
      "Early access to new features",
    ],
  },
  {
    name: "Premium",
    planKey: "PREMIUM",
    price: "₹499",
    period: "per month",
    desc: "For teams and power researchers who need maximum capacity.",
    icon: <Crown size={22} />,
    iconBg: "bg-[#C4F0D8]",
    cardBg: "bg-white",
    cta: "Go Premium",
    ctaBg: "bg-black",
    ctaText: "text-white",
    popular: false,
    features: [
      "50 workspaces",
      "Up to 100 sources per workspace",
      "1,000 AI queries / month",
      "Web search powered answers",
      "Priority support",
      "Early access to new features",
    ],
  },
];


const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes. You can upgrade or downgrade your plan at any time from the dashboard. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period.",
  },
  {
    q: "What happens if I hit my AI query limit?",
    a: "Once you reach your monthly AI query limit, the chat feature is temporarily paused until the next billing cycle resets. You can always upgrade your plan to get more queries immediately.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes — all paid plans include a 14-day free trial. You won't be charged until the trial ends, and you can cancel anytime before that.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Absolutely. You can cancel anytime from your dashboard with no cancellation fee. You'll retain access to your paid plan features until the end of the current billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, UPI, and net banking via Razorpay — India's most trusted payment gateway.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All your sources and conversations are stored securely. We never use your uploaded content to train AI models.",
  },
  {
    q: "What kind of files can I upload?",
    a: "You can upload PDFs, Word documents (.docx), plain text files, and Markdown files. You can also paste web page URLs and we'll extract the content automatically.",
  },
];

const accentColors = [
  "bg-[#FFE14D]",
  "bg-[#C4F0D8]",
  "bg-[#E8DFFF]",
  "bg-[#FFD6CC]",
  "bg-[#D0F0FF]",
  "bg-[#FFDAF0]",
  "bg-[#FFE14D]",
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.1 } as any,
  }),
};


function openRazorpayModal(checkout: CheckoutResponse) {
  if (!window.Razorpay) {
    alert("Payment SDK not loaded. Please refresh and try again.");
    return;
  }
  const options = {
    key: checkout.keyId,
    subscription_id: checkout.subscriptionId,
    name: "Notebook LM",
    description: `${checkout.planName} Plan`,
    handler: () => {
      window.location.href = "/dashboard";
    },
    theme: { color: "#6C47FF" },
  };
  new window.Razorpay(options).open();
}

// ─── FAQ Item — exact clone of FAQSection FAQItem ────────────────────────────

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.07 }}
      className="border-[2.5px] border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-shadow"
    >
      {/* Question row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white text-left group"
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border-[2px] border-black ${accentColors[index % accentColors.length]} text-[11px] font-black shadow-[2px_2px_0px_#000] shrink-0`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-black text-black text-[0.95rem] leading-snug">
            {faq.q}
          </span>
        </div>
        <span
          className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] transition-colors ${isOpen ? "bg-black text-white" : "bg-white text-black group-hover:bg-black group-hover:text-white"}`}
        >
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={`px-6 pb-5 pt-1 border-t-[2px] border-black ${accentColors[index % accentColors.length]}`}
            >
              <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const { data: subStatus } = useSubscriptionStatus();
  const currentPlanName = subStatus?.plan?.name ?? "FREE";

  const checkout = useCreateCheckout();

  const handleCtaClick = async (planKey: string) => {
    if (planKey === "FREE") {
      router.push("/signup");
      return;
    }
    if (!isLoggedIn) {
      router.push("/signup");
      return;
    }
    setLoadingPlan(planKey);
    try {
      const result = await checkout.mutateAsync(planKey as "PRO" | "PREMIUM");
      openRazorpayModal(result);
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF0]">
      <Navbar />

      <main className="flex-1">

        {/* ── Hero — same style as other landing section headings ── */}
        <section className="bg-[#FFFBF0] pt-20 pb-14 px-6 border-b-[3px] border-black">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className="inline-block border-[2.5px] border-black bg-[#C4F0D8] px-4 py-1 text-xs font-black shadow-[3px_3px_0px_#000] mb-4 rounded-full">
              PRICING
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-3">
              Simple, honest pricing.
            </h1>
            <p className="text-gray-600 font-semibold text-base max-w-md mx-auto">
              Start free. Upgrade when you need more. Cancel anytime — no questions asked.
            </p>
          </motion.div>
        </section>

        {/* ── Plan cards — exact same markup as PricingSection.tsx ── */}
        <section className="bg-[#FFFBF0] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {plans.map((plan, i) => {
                const isPopular = plan.popular;
                const textColor = isPopular ? "text-white" : "text-black";
                const subTextColor = isPopular ? "text-purple-200" : "text-gray-500";
                const featureTextColor = isPopular ? "text-purple-100" : "text-gray-700";
                const checkBg = isPopular ? "bg-white/20 text-white" : "bg-[#C4F0D8] text-black";
                const dividerColor = isPopular ? "border-purple-400" : "border-black";
                const isCurrentPlan = isLoggedIn && currentPlanName === plan.planKey;
                const isLoading = loadingPlan === plan.planKey;

                return (
                  <motion.div
                    key={plan.name}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    whileHover={{ y: -6, transition: { duration: 0.15 } }}
                    className={`relative ${plan.cardBg} border-[2.5px] border-black rounded-2xl p-7 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-shadow flex flex-col`}
                  >
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 border-[2px] border-black bg-[#FFE14D] px-4 py-1 rounded-full text-[11px] font-black text-black shadow-[3px_3px_0px_#000] whitespace-nowrap">
                        ⚡ MOST POPULAR
                      </div>
                    )}

                    {/* Current plan ribbon */}
                    {isCurrentPlan && !isPopular && (
                      <div className="absolute -top-4 right-4 border-[2px] border-black bg-[#C4F0D8] px-3 py-1 rounded-full text-[11px] font-black text-black shadow-[2px_2px_0px_#000]">
                        ✓ Active
                      </div>
                    )}
                    {isCurrentPlan && isPopular && (
                      <div className="absolute -top-4 right-4 border-[2px] border-black bg-[#C4F0D8] px-3 py-1 rounded-full text-[11px] font-black text-black shadow-[2px_2px_0px_#000]">
                        ✓ Active
                      </div>
                    )}

                    {/* Icon + Name */}
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border-[2px] border-black ${plan.iconBg} ${isPopular ? "text-white" : "text-black"} shadow-[2px_2px_0px_#000]`}
                      >
                        {plan.icon}
                      </span>
                      <span className={`text-xl font-black ${textColor}`}>
                        {plan.name}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      <span className={`text-5xl font-black ${textColor} tracking-tight`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm font-bold ml-2 ${subTextColor}`}>
                        / {plan.period}
                      </span>
                    </div>

                    <p className={`text-sm font-semibold ${subTextColor} mb-6 leading-relaxed`}>
                      {plan.desc}
                    </p>

                    {/* Divider */}
                    <div className={`border-t-[2px] ${dividerColor} mb-6`} />

                    {/* Features */}
                    <ul className="space-y-3 flex-1 mb-8">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <span
                            className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-[2px] border-black shrink-0 mt-0.5 ${checkBg}`}
                          >
                            <Check size={10} />
                          </span>
                          <span className={`text-sm font-semibold ${featureTextColor}`}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA — identical classes to PricingSection.tsx, no disabled attr */}
                    <button
                      onClick={() => handleCtaClick(plan.planKey)}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-[2.5px] border-black ${plan.ctaBg} ${plan.ctaText} font-black text-sm shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all`}
                    >
                      {isLoading ? (
                        <Loader size={14} className="animate-spin" />
                      ) : (
                        <>
                          {isCurrentPlan ? plan.cta : plan.cta}
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center text-sm font-bold text-gray-500 mt-10"
            >
              All paid plans include a{" "}
              <span className="text-black underline decoration-[#FFE14D] decoration-2 underline-offset-2">
                14-day free trial
              </span>
              . No credit card required to start.
            </motion.p>
          </div>
        </section>

        {/* ── Feature comparison table ── */}
        <section className="bg-white py-20 px-6 border-t-[3px] border-black">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block border-[2.5px] border-black bg-[#E8DFFF] px-4 py-1 text-xs font-black shadow-[3px_3px_0px_#000] mb-4 rounded-full">
                COMPARE
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-3">
                Everything at a glance.
              </h2>
              <p className="text-gray-600 font-semibold text-base">
                Every feature, every plan — side by side.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border-[2.5px] border-black overflow-hidden shadow-[6px_6px_0px_#000]"
            >
              {/* Table header */}
              <div className="grid grid-cols-4 border-b-[2.5px] border-black bg-[#FFFBF0]">
                <div className="p-4 font-black text-xs text-gray-500 uppercase tracking-widest">
                  Feature
                </div>
                {plans.map((p) => (
                  <div
                    key={p.planKey}
                    className={`p-4 text-center font-black text-sm border-l-[2px] border-black ${p.popular ? "bg-[#6C47FF] text-white" : "text-black"}`}
                  >
                    {p.name}
                  </div>
                ))}
              </div>

              {/* Table rows */}
              {[
                { label: "Workspaces",           values: ["3", "20", "50"] },
                { label: "Sources / workspace",  values: ["10", "50", "100"] },
                { label: "AI queries / month",   values: ["50", "500", "1,000"] },
                { label: "PDF upload",           values: [true, true, true] },
                { label: "Website import",       values: [true, true, true] },
                { label: "YouTube import",       values: [true, true, true] },
                { label: "Web search",           values: [false, true, true] },
                { label: "Priority support",     values: [false, true, true] },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-4 border-b-[1px] border-gray-200 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}`}
                >
                  <div className="p-4 text-sm font-bold text-gray-700">
                    {row.label}
                  </div>
                  {row.values.map((val, idx) => (
                    <div
                      key={idx}
                      className={`p-4 flex items-center justify-center border-l-[1px] border-gray-200 ${idx === 1 ? "bg-purple-50" : ""}`}
                    >
                      {typeof val === "boolean" ? (
                        val ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C4F0D8] border-[2px] border-black">
                            <Check size={10} className="text-black" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 border-[1px] border-gray-300">
                            <X size={10} className="text-gray-400" />
                          </span>
                        )
                      ) : (
                        <span className={`text-sm font-black ${idx === 1 ? "text-[#6C47FF]" : "text-black"}`}>
                          {val}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FAQ — exact same style as FAQSection.tsx ── */}
        <section className="bg-[#FFFBF0] py-20 border-t-[3px] border-black">
          <div className="max-w-3xl mx-auto px-6">
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <span className="inline-block border-[2.5px] border-black bg-[#FFD6CC] px-4 py-1 text-xs font-black shadow-[3px_3px_0px_#000] mb-4 rounded-full">
                FAQ
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-3">
                Got questions?
              </h2>
              <p className="text-gray-600 font-semibold text-base">
                Here are the ones we get asked the most.
              </p>
            </motion.div>

            {/* FAQ list */}
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  index={i}
                  isOpen={openFaqIndex === i}
                  onToggle={() =>
                    setOpenFaqIndex(openFaqIndex === i ? null : i)
                  }
                />
              ))}
            </div>

            {/* CTA below FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <p className="text-sm font-bold text-gray-600 mb-4">
                Still have questions? We are happy to help.
              </p>
              <a
                href="mailto:support@notebook.ai"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-[2.5px] border-black bg-black text-white font-black text-sm shadow-[5px_5px_0px_#6C47FF] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
              >
                Contact support
              </a>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
