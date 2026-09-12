"use client";

import { motion } from "framer-motion";
import {
  FolderOpen,
  MessageCircle,
  Search,
  Layers,
  FileText,
  Globe,
  StickyNote,
  SendHorizontal,
  Sparkles,
} from "lucide-react";

/* ─── Mini visual demos for each step ────────────────────── */

function AddSourcesDemo() {
  return (
    <div className="mb-5 rounded-xl border-[1.5px] border-dashed border-black/40 bg-white/60 p-3">
      {/* Drop zone */}
      <div className="flex items-center justify-center gap-2 mb-2.5">
        <FolderOpen size={16} className="text-gray-400" />
        <span className="text-[9px] font-bold text-gray-400">Drop files here or browse</span>
      </div>
      {/* Mini file pills */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { label: "notes.pdf", icon: <FileText size={9} />, color: "bg-red-50 border-red-200" },
          { label: "arxiv.org", icon: <Globe size={9} />, color: "bg-amber-50 border-amber-200" },
          { label: "lecture.md", icon: <StickyNote size={9} />, color: "bg-blue-50 border-blue-200" },
        ].map((f) => (
          <span
            key={f.label}
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[8px] font-bold text-gray-600 ${f.color}`}
          >
            {f.icon}
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AskAnythingDemo() {
  return (
    <div className="mb-5 rounded-xl border-[1.5px] border-black bg-white p-2 shadow-[2px_2px_0px_#000]">
      <div className="flex items-center gap-2">
        <span className="flex-1 text-[9px] text-gray-700 font-semibold truncate">
          What are the key findings in chapter 3?
        </span>
        <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#6C47FF] border-[1.5px] border-black shadow-[1.5px_1.5px_0px_#000] shrink-0">
          <SendHorizontal size={9} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function GroundedAnswersDemo() {
  return (
    <div className="mb-5 rounded-xl border-[1.5px] border-black bg-white p-2.5 shadow-[2px_2px_0px_#000]">
      {/* AI avatar + response */}
      <div className="flex items-start gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-[#00D4AA] border-[1.5px] border-black flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]">
          <Sparkles size={8} className="text-white" />
        </div>
        <div className="min-w-0">
          <div className="h-1 w-full rounded-full bg-gray-200 mb-1" />
          <div className="h-1 w-4/5 rounded-full bg-gray-200 mb-1" />
          <div className="h-1 w-3/5 rounded-full bg-gray-200" />
        </div>
      </div>
      {/* Citation badges */}
      <div className="flex items-center gap-1.5 pl-7">
        <span className="text-[7px] font-bold text-[#6C47FF] bg-[#EDE9FE] px-1.5 py-0.5 rounded border border-[#C4B5FD]">[1] pg.12</span>
        <span className="text-[7px] font-bold text-[#6C47FF] bg-[#EDE9FE] px-1.5 py-0.5 rounded border border-[#C4B5FD]">[2] pg.34</span>
      </div>
    </div>
  );
}

function GoDeeperDemo() {
  return (
    <div className="mb-5 flex flex-wrap gap-1.5">
      {[
        { label: "Tell me more →", color: "bg-[#EDE9FE] border-[#C4B5FD]" },
        { label: "Compare with Ch.4", color: "bg-[#FFF8E1] border-amber-200" },
        { label: "Summarize all", color: "bg-[#EAFFF6] border-[#86EFAC]" },
      ].map((chip) => (
        <span
          key={chip.label}
          className={`inline-flex items-center px-2 py-1 rounded-lg border-[1.5px] border-black bg-white shadow-[2px_2px_0px_#000] text-[8px] font-bold text-gray-700`}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}

/* ─── Steps data ─────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    icon: <FolderOpen size={28} />,
    demo: <AddSourcesDemo />,
    title: "Add your sources",
    desc: "Upload PDFs, docs, notes, or paste links to the content you care about.",
    bg: "bg-[#FFF9E6]",
    iconBg: "bg-[#FFE14D]",
    numberBg: "bg-[#FFE14D]",
  },
  {
    number: "02",
    icon: <MessageCircle size={28} />,
    demo: <AskAnythingDemo />,
    title: "Ask anything",
    desc: "Ask natural-language questions about your workspace.",
    bg: "bg-[#EDE9FE]",
    iconBg: "bg-[#C4B5FD]",
    numberBg: "bg-[#C4B5FD]",
  },
  {
    number: "03",
    icon: <Search size={28} />,
    demo: <GroundedAnswersDemo />,
    title: "Get grounded answers",
    desc: "Receive structured answers with citations from your sources.",
    bg: "bg-[#DCFCE7]",
    iconBg: "bg-[#86EFAC]",
    numberBg: "bg-[#86EFAC]",
  },
  {
    number: "04",
    icon: <Layers size={28} />,
    demo: <GoDeeperDemo />,
    title: "Go deeper",
    desc: "Explore follow-ups, related insights, and keep building your knowledge.",
    bg: "bg-[#FFE4E1]",
    iconBg: "bg-[#FCA5A5]",
    numberBg: "bg-[#FCA5A5]",
  },
];

/* ─── Dashed arrow connector ─────────────────────────────── */
function DashedArrow() {
  return (
    <div className="hidden lg:flex items-center shrink-0 w-10">
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <line
          x1="0" y1="10" x2="32" y2="10"
          stroke="#000"
          strokeWidth="2"
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
        <path
          d="M30 5 L38 10 L30 15"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: "easeOut", delay: i * 0.1 } as any,
  }),
};

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#FFFBF0] py-20 border-t-[3px] border-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-14"
        >
          {/* Left arrow */}
          <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
            <path d="M26 8H2M2 8L8 2M2 8L8 14" stroke="#6C47FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight">
            How it works
          </h2>

          {/* Right arrow */}
          <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
            <path d="M2 8h24M26 8l-6-6M26 8l-6 6" stroke="#6C47FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* ── Steps row ── */}
        <div className="flex flex-col lg:flex-row items-stretch gap-5 lg:gap-0">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col lg:flex-row items-center flex-1">
              {/* Card */}
              <motion.div
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.15 } }}
                className={`flex-1 w-full ${step.bg} border-[2.5px] border-black rounded-2xl p-5 shadow-[5px_5px_0px_#000] hover:shadow-[7px_7px_0px_#000] transition-shadow`}
              >
                {/* Number badge + Icon row */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border-[2px] border-black ${step.numberBg} text-black text-xs font-black shadow-[2px_2px_0px_#000]`}
                  >
                    {step.number}
                  </span>
                  <div
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border-[2px] border-black ${step.iconBg} text-black shadow-[2px_2px_0px_#000]`}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Visual demo area */}
                {step.demo}

                <h3 className="text-[1.05rem] font-black text-black mb-2">{step.title}</h3>
                <p className="text-sm font-semibold text-gray-700 leading-relaxed">{step.desc}</p>
              </motion.div>

              {/* Connector arrow (between cards, not after last) */}
              {i < steps.length - 1 && <DashedArrow />}
            </div>
          ))}
        </div>

        {/* ── Social proof bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 border-[2.5px] border-black rounded-2xl bg-white shadow-[5px_5px_0px_#000] px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          {/* Avatars + count */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {["bg-[#FFE14D]", "bg-[#86EFAC]", "bg-[#C4B5FD]", "bg-[#FCA5A5]"].map((color, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full border-[2px] border-black ${color} flex items-center justify-center text-xs font-black`}
                >
                  {["A", "B", "C", "D"][i]}
                </div>
              ))}
            </div>
            <span className="text-sm font-black text-black border-[2px] border-black rounded-full px-3 py-1 bg-[#FFFBF0] shadow-[2px_2px_0px_#000]">
              +2K
            </span>
            <p className="text-sm font-bold text-gray-700 ml-1">
              Trusted by researchers, students, and teams worldwide
            </p>
          </div>

          {/* Trust icons */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-700">
            {[
              { label: "Secure by default", emoji: "🛡" },
              { label: "Your data, your control", emoji: "🔐" },
              { label: "Built for privacy", emoji: "🔒" },
              { label: "Backed by modern infra", emoji: "☁" },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <span>{item.emoji}</span>
                {item.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
