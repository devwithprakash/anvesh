"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Search,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  Zap,
  Globe,
  StickyNote,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* ─── Mini illustrations for each feature card ───────────── */

function UploadIllustration() {
  return (
    <div className="flex items-end gap-1.5 mb-4">
      {[
        { label: "PDF", color: "bg-red-100 text-red-600 border-red-200", icon: <FileText size={10} /> },
        { label: "DOC", color: "bg-blue-100 text-blue-600 border-blue-200", icon: <StickyNote size={10} /> },
        { label: "URL", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Globe size={10} /> },
      ].map((file, i) => (
        <div
          key={file.label}
          className={`flex items-center gap-1 px-2 py-1 rounded-md border-[1.5px] border-black bg-white shadow-[2px_2px_0px_#000] text-[8px] font-black`}
          style={{ transform: `rotate(${(i - 1) * 4}deg)` }}
        >
          {file.icon}
          <span className={`px-1 py-0.5 rounded text-[7px] border ${file.color}`}>{file.label}</span>
        </div>
      ))}
    </div>
  );
}

function GroundedIllustration() {
  return (
    <div className="mb-4 bg-white rounded-lg border-[1.5px] border-black p-2 shadow-[2px_2px_0px_#000] max-w-[200px]">
      <p className="text-[8.5px] text-gray-600 leading-relaxed mb-1.5">
        &ldquo;Transformers use self-attention to process sequences in parallel…&rdquo;
      </p>
      <div className="flex items-center gap-2">
        <span className="text-[7px] font-bold text-[#6C47FF] bg-[#EDE9FE] px-1.5 py-0.5 rounded border border-[#C4B5FD]">[1] Page 12</span>
        <span className="text-[7px] font-bold text-[#6C47FF] bg-[#EDE9FE] px-1.5 py-0.5 rounded border border-[#C4B5FD]">[2] Page 34</span>
      </div>
    </div>
  );
}

function PrivacyIllustration() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl border-[1.5px] border-black bg-white shadow-[2px_2px_0px_#000]">
        <ShieldCheck size={20} className="text-[#00B87C]" />
      </div>
      <div className="space-y-1">
        {["Your data stays local", "Zero training usage"].map((text) => (
          <div key={text} className="flex items-center gap-1">
            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-[#EAFFF6] border border-[#00B87C]">
              <Check size={7} className="text-[#00B87C]" />
            </span>
            <span className="text-[8px] font-bold text-gray-600">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RefreshIllustration() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex flex-col items-center">
        <div className="px-2 py-1 rounded-md border-[1.5px] border-black bg-white shadow-[1.5px_1.5px_0px_#000] text-[8px] font-bold text-gray-400 line-through">
          v1.2
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <ArrowRight size={12} className="text-black" />
        <RefreshCw size={9} className="text-[#6C47FF] animate-spin" style={{ animationDuration: "3s" }} />
      </div>
      <div className="flex flex-col items-center">
        <div className="px-2 py-1 rounded-md border-[1.5px] border-black bg-white shadow-[1.5px_1.5px_0px_#000] text-[8px] font-black text-black">
          v2.0
        </div>
        <span className="text-[7px] font-bold text-[#00B87C] mt-0.5">synced ✓</span>
      </div>
    </div>
  );
}

function MultiSourceIllustration() {
  return (
    <div className="flex items-center gap-1 mb-4">
      <div className="px-1.5 py-1 rounded-md border-[1.5px] border-black bg-white shadow-[1.5px_1.5px_0px_#000]">
        <FileText size={12} className="text-gray-500" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-4 h-[1.5px] bg-black/30" />
        <div className="w-4 h-[1.5px] bg-black/30" />
      </div>
      <div className="flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] border-black bg-[#6C47FF] shadow-[1.5px_1.5px_0px_#000]">
        <Sparkles size={10} className="text-white" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-4 h-[1.5px] bg-black/30" />
        <div className="w-4 h-[1.5px] bg-black/30" />
      </div>
      <div className="px-1.5 py-1 rounded-md border-[1.5px] border-black bg-white shadow-[1.5px_1.5px_0px_#000]">
        <BookOpen size={12} className="text-gray-500" />
      </div>
    </div>
  );
}

function SpeedIllustration() {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex-1 h-2.5 rounded-full border-[1.5px] border-black bg-white overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-[#6C47FF] to-[#00B87C] rounded-full" />
        </div>
        <Zap size={12} className="text-[#FFB800]" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black text-[#00B87C]">100%</span>
        <span className="text-[8px] font-bold text-gray-500 bg-white border border-gray-200 rounded px-1.5 py-0.5">&lt; 2s response</span>
      </div>
    </div>
  );
}

/* ─── Feature data ───────────────────────────────────────── */
const features = [
  {
    illustration: <UploadIllustration />,
    icon: <FileText size={28} />,
    title: "Upload any source",
    desc: "PDFs, docs, notes, web pages — if it has text, Notebook can learn from it.",
    bg: "bg-[#FFE14D]",
    rotate: "-rotate-1",
  },
  {
    illustration: <GroundedIllustration />,
    icon: <Search size={28} />,
    title: "Grounded answers",
    desc: "Every response is tied to your documents with precise citations so you always know the source.",
    bg: "bg-[#C4F0D8]",
    rotate: "rotate-1",
  },
  {
    illustration: <PrivacyIllustration />,
    icon: <ShieldCheck size={28} />,
    title: "Private by default",
    desc: "Your data stays yours. Nothing is used for training. You stay in full control at all times.",
    bg: "bg-[#E8DFFF]",
    rotate: "-rotate-1",
  },
  {
    illustration: <RefreshIllustration />,
    icon: <RefreshCw size={28} />,
    title: "Always up to date",
    desc: "Re-upload updated documents and your AI instantly reflects the latest knowledge.",
    bg: "bg-[#FFD6CC]",
    rotate: "rotate-1",
  },
  {
    illustration: <MultiSourceIllustration />,
    icon: <BookOpen size={28} />,
    title: "Multi-source reasoning",
    desc: "Ask questions that span multiple documents. Notebook finds connections you might miss.",
    bg: "bg-[#D0F0FF]",
    rotate: "-rotate-1",
  },
  {
    illustration: <SpeedIllustration />,
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
              {/* Mini illustration */}
              {feat.illustration}

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
