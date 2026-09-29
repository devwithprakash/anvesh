"use client";

import { Easing, motion } from "framer-motion";
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
    icon: <FileText size={24} />,
    tag: "UPLOAD",
    tagColor: "bg-[#FFE14D]",
    title: "Upload any source",
    desc: "PDFs, docs, notes, web pages — if it has text, Anvesh can learn from it.",
    bg: "bg-[#FFE14D]",
    rotate: "-rotate-1",
  },
  {
    icon: <Search size={24} />,
    tag: "SUMMARIZE",
    tagColor: "bg-[#C4F0D8]",
    title: "Instant summaries",
    desc: "Get concise summaries of any document or workspace at the click of a button.",
    bg: "bg-[#C4F0D8]",
    rotate: "rotate-1",
  },
  {
    icon: <ShieldCheck size={24} />,
    tag: "PRIVACY",
    tagColor: "bg-[#E8DFFF]",
    title: "Private by default",
    desc: "Your data stays yours. Nothing is used for training. Full control, always.",
    bg: "bg-[#E8DFFF]",
    rotate: "-rotate-1",
  },
  {
    icon: <RefreshCw size={24} />,
    tag: "SYNC",
    tagColor: "bg-[#FFD6CC]",
    title: "Always up to date",
    desc: "Re-upload updated documents and your AI instantly reflects the latest knowledge.",
    bg: "bg-[#FFD6CC]",
    rotate: "rotate-1",
  },
  {
    icon: <BookOpen size={24} />,
    tag: "MULTI-DOC",
    tagColor: "bg-[#D0F0FF]",
    title: "Multi-source reasoning",
    desc: "Ask questions that span multiple documents. Anvesh finds connections you might miss.",
    bg: "bg-[#D0F0FF]",
    rotate: "-rotate-1",
  },
  {
    icon: <Zap size={24} />,
    tag: "SPEED",
    tagColor: "bg-[#FFDAF0]",
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
    transition: { duration: 0.5, ease: "easeOut" as Easing, delay: i * 0.08 },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className={`${feat.bg} ${feat.rotate} border-[2.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_#000] hover:shadow-[7px_7px_0px_#000] transition-shadow`}
            >
              {/* Tag + Icon row */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black tracking-wider text-black/70 bg-white/60 border-[1.5px] border-black/20 px-2 py-0.5 rounded-md">
                  {feat.tag}
                </span>
                <div className="inline-flex items-center justify-center w-10 h-10 border-[2.5px] border-black bg-white rounded-xl shadow-[3px_3px_0px_#000] text-black">
                  {feat.icon}
                </div>
              </div>

              <h3 className="text-[1.1rem] font-black text-black mb-1.5">{feat.title}</h3>
              <p className="text-[13px] font-semibold text-gray-700 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
