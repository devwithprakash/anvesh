"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Search,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: <FileText size={28} />,
    title: "Upload any source",
    desc: "PDFs, docs, notes, web pages — if it has text, Notebook can learn from it.",
    bg: "bg-[#FFE14D]",
    rotate: "-rotate-1",
  },
  {
    icon: <Search size={28} />,
    title: "Grounded answers",
    desc: "Every response is tied to your documents with precise citations so you always know the source.",
    bg: "bg-[#C4F0D8]",
    rotate: "rotate-1",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Private by default",
    desc: "Your data stays yours. Nothing is used for training. You stay in full control at all times.",
    bg: "bg-[#E8DFFF]",
    rotate: "-rotate-1",
  },
  {
    icon: <RefreshCw size={28} />,
    title: "Always up to date",
    desc: "Re-upload updated documents and your AI instantly reflects the latest knowledge.",
    bg: "bg-[#FFD6CC]",
    rotate: "rotate-1",
  },
  {
    icon: <BookOpen size={28} />,
    title: "Multi-source reasoning",
    desc: "Ask questions that span multiple documents. Notebook finds connections you might miss.",
    bg: "bg-[#D0F0FF]",
    rotate: "-rotate-1",
  },
  {
    icon: <Zap size={28} />,
    title: "Instant answers",
    desc: "No waiting, no loading spinners. Get answers in seconds even for complex queries.",
    bg: "bg-[#FFDAF0]",
    rotate: "rotate-1",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 } as any,
  }),
};

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#FFFBF0] py-20 border-t-[3px] border-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block border-[2.5px] border-black bg-[#FFE14D] px-4 py-1 text-xs font-black shadow-[3px_3px_0px_#000] mb-4 rounded-full">
            FEATURES
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight">
            Everything you need to{" "}
            <span className="text-[#6C47FF]">think deeper.</span>
          </h2>
        </motion.div>

        {/* ── Feature grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className={`${feat.bg} ${feat.rotate} border-[2.5px] border-black rounded-2xl p-6 shadow-[5px_5px_0px_#000] hover:shadow-[7px_7px_0px_#000] transition-shadow`}
            >
              {/* Icon box */}
              <div className="inline-flex items-center justify-center w-12 h-12 border-[2.5px] border-black bg-white rounded-xl shadow-[3px_3px_0px_#000] mb-4 text-black">
                {feat.icon}
              </div>
              <h3 className="text-lg font-black text-black mb-2">{feat.title}</h3>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
