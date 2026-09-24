"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Crown, Star } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    planKey: "FREE",
    price: "₹0",
    period: "forever",
    desc: "Perfect for getting started and exploring your first workspaces.",
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

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.1 } as any,
  }),
};

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="bg-[#FFFBF0] py-20 border-t-[3px] border-black"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block border-[2.5px] border-black bg-[#C4F0D8] px-4 py-1 text-xs font-black shadow-[3px_3px_0px_#000] mb-4 rounded-full">
            PRICING
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-3">
            Simple, honest pricing.
          </h2>
          <p className="text-gray-600 font-semibold text-base max-w-md mx-auto">
            Start free. Upgrade when you need more. Cancel anytime — no
            questions asked.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => {
            const isPopular = plan.popular;
            const textColor = isPopular ? "text-white" : "text-black";
            const subTextColor = isPopular
              ? "text-purple-200"
              : "text-gray-500";
            const featureTextColor = isPopular
              ? "text-purple-100"
              : "text-gray-700";
            const checkBg = isPopular
              ? "bg-white/20 text-white"
              : "bg-[#C4F0D8] text-black";
            const dividerColor = isPopular
              ? "border-purple-400"
              : "border-black";

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
                  <span
                    className={`text-5xl font-black ${textColor} tracking-tight`}
                  >
                    {plan.price}
                  </span>
                  <span className={`text-sm font-bold ml-2 ${subTextColor}`}>
                    / {plan.period}
                  </span>
                </div>

                <p
                  className={`text-sm font-semibold ${subTextColor} mb-6 leading-relaxed`}
                >
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
                      <span
                        className={`text-sm font-semibold ${featureTextColor}`}
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={"/pricing"}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-[2.5px] border-black ${plan.ctaBg} ${plan.ctaText} font-black text-sm shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all`}
                >
                  {plan.cta}
                  <ArrowRight size={15} />
                </Link>
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
  );
}
