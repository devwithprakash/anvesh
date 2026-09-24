"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileText,
  Globe,
  StickyNote,
  Sparkles,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay } as any,
  },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.93, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay } as any,
  },
});

const fadePop = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.4 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "backOut", delay } as any,
  },
});

const sources = [
  {
    icon: <FileText size={14} />,
    label: "PDFs & Docs",
    file: "research-paper.pdf",
    bg: "bg-[#EDE9FE]",
    delay: 0.4,
    rotate: "-rotate-2",
  },
  {
    icon: <Globe size={14} />,
    label: "Web Pages",
    file: "arxiv.org/abs/2401...",
    bg: "bg-[#FFE4E1]",
    delay: 0.55,
    rotate: "rotate-1",
  },
  {
    icon: <StickyNote size={14} />,
    label: "Your Notes",
    file: "lecture-notes.md",
    bg: "bg-[#DCFCE7]",
    delay: 0.7,
    rotate: "rotate-2",
  },
];

function FlowDots({ delay = 0 }: { delay?: number }) {
  return (
    <div className="flex justify-center items-center gap-3 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
            y: [0, 6, 0],
          }}
          transition={
            {
              duration: 2.2,
              ease: "easeInOut",
              delay: delay + i * 0.3,
              repeat: Infinity,
            } as any
          }
          className="w-1.5 h-1.5 rounded-full bg-[#6C47FF]"
        />
      ))}
    </div>
  );
}

function HeroVisual() {
  return (
    <motion.div
      {...scaleIn(0.3)}
      className="relative w-full max-w-[520px] flex flex-col items-center"
    >
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 w-full">
        {sources.map((src) => (
          <motion.div
            key={src.label}
            {...fadePop(src.delay)}
            className={`${src.bg} ${src.rotate} flex-1 min-w-[110px] max-w-[140px] rounded-lg border-[2px] border-black px-2.5 py-2 shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-y-1 transition-all`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-md border-[1.5px] border-black bg-white shadow-[1.5px_1.5px_0px_#000]">
                {src.icon}
              </div>
              <span className="text-[10px] font-black text-black leading-tight">
                {src.label}
              </span>
            </div>
            <div className="space-y-1">
              <div className="h-1 w-full rounded-full bg-black/10" />
              <div className="h-1 w-3/4 rounded-full bg-black/10" />
            </div>
            <p className="text-[8px] text-gray-500 font-medium mt-1.5 truncate">
              {src.file}
            </p>
          </motion.div>
        ))}
      </div>

      <FlowDots delay={1.0} />

      <motion.div
        {...scaleIn(0.85)}
        className="relative flex items-center justify-center my-1"
      >
        <motion.div
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.25, 0, 0.25],
          }}
          transition={
            {
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            } as any
          }
          className="absolute w-20 h-20 rounded-full bg-[#6C47FF]/20"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0, 0.15],
          }}
          transition={
            {
              duration: 3,
              ease: "easeInOut",
              delay: 0.5,
              repeat: Infinity,
            } as any
          }
          className="absolute w-20 h-20 rounded-full bg-[#6C47FF]/15"
        />
        {/* Orb */}
        <div className="relative w-16 h-16 rounded-full border-[3px] border-black bg-[#6C47FF] shadow-[4px_4px_0px_#000] flex items-center justify-center z-10">
          <Sparkles size={24} className="text-white" />
        </div>
        <motion.div
          {...fadeUp(1.0)}
          className="absolute -right-28 top-1/2 -translate-y-1/2 bg-white border-[2px] border-black rounded-lg px-2.5 py-1 shadow-[2px_2px_0px_#000] whitespace-nowrap hidden sm:block"
        >
          <span className="text-[10px] font-black text-[#6C47FF]">
            AI Synthesis
          </span>
        </motion.div>
      </motion.div>

      <FlowDots delay={1.5} />

      <motion.div
        {...fadeUp(1.1)}
        className="w-full max-w-[400px] rounded-xl border-[2.5px] border-black bg-white p-4 shadow-[5px_5px_0px_#000]"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg border-[2px] border-black bg-[#EAFFF6] shadow-[2px_2px_0px_#000]">
            <Sparkles size={13} className="text-[#00B87C]" />
          </div>
          <span className="text-xs font-black text-black">
            Grounded Insight
          </span>
        </div>

        <p className="text-[12.5px] text-gray-700 leading-relaxed mb-3 font-medium">
          &ldquo;Formal methods are mathematically based techniques used for the
          specification, design, and verification of software systems...&rdquo;{" "}
          <span className="text-[#6C47FF] font-bold text-[11px]">[1]</span>
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] text-gray-500 font-medium">
            <span className="text-[#6C47FF] font-bold">[1]</span>{" "}
            Software-Engineering.pdf — Page 52
          </span>
        </div>

        <div className="flex items-center gap-4 pt-2.5 border-t-[1.5px] border-gray-200">
          {[
            { label: "Grounded", color: "bg-[#00B87C]" },
            { label: "Cited", color: "bg-[#6C47FF]" },
            { label: "Accurate", color: "bg-[#FFB800]" },
          ].map((tag) => (
            <span
              key={tag.label}
              className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${tag.color}`} />
              {tag.label}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative bg-[#FFFBF0] min-h-[calc(100vh-64px)] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.span
        {...fadePop(0.9)}
        className="absolute top-14 left-[43%] text-2xl text-[#6C47FF] opacity-50 pointer-events-none select-none font-black"
      >
        ✳
      </motion.span>
      <motion.span
        {...fadePop(1.1)}
        className="absolute top-10 right-[10%] text-2xl text-[#FFE14D] pointer-events-none select-none font-black"
        style={{ WebkitTextStroke: "1.5px black" }}
      >
        ✦
      </motion.span>
      <motion.span
        {...fadePop(1.3)}
        className="absolute bottom-28 right-[19%] text-lg text-[#6C47FF] opacity-40 pointer-events-none select-none font-black"
      >
        ✦
      </motion.span>

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-14 lg:gap-16">
        <div className="flex-1 max-w-[480px]">
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-black bg-[#EAFFF6] px-4 py-1.5 text-[11px] font-black text-black mb-7 shadow-[3px_3px_0px_#000]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00B87C] shrink-0" />
            AI ANSWERS GROUNDED IN YOUR SOURCES
          </motion.div>

          <motion.h1
            {...fadeUp(0.1)}
            className="text-[3.1rem] sm:text-[3.5rem] leading-[1.08] font-black text-black tracking-tight"
          >
            Your knowledge.
          </motion.h1>
          <motion.h1
            {...fadeUp(0.18)}
            className="text-[3.1rem] sm:text-[3.5rem] leading-[1.08] font-black text-black tracking-tight"
          >
            Your sources.
          </motion.h1>
          <motion.h1
            {...fadeUp(0.26)}
            className="text-[3.1rem] sm:text-[3.5rem] leading-[1.08] font-black text-[#6C47FF] tracking-tight mb-1"
          >
            Your AI.
          </motion.h1>

          <motion.div {...fadeUp(0.29)} className="mb-5">
            <svg width="56" height="16" viewBox="0 0 56 16" fill="none">
              <path
                d="M2 8 Q9 2 16 8 Q23 14 30 8 Q37 2 44 8 Q51 14 58 8"
                stroke="#FF6B6B"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </motion.div>

          <motion.p
            {...fadeUp(0.34)}
            className="text-gray-600 text-[15px] font-semibold leading-relaxed mb-8 max-w-[400px]"
          >
            Upload your documents, ask anything, and get concise summaries you
            can trust.
          </motion.p>

          <motion.div
            {...fadeUp(0.42)}
            className="flex flex-wrap items-center gap-4 mb-7"
          >
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-[2.5px] border-black bg-[#6C47FF] text-white font-black text-sm shadow-[5px_5px_0px_#000] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
            >
              Get started with Anvesh
              <ArrowRight size={16} />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center px-6 py-3 rounded-xl border-[2.5px] border-black bg-white text-black font-black text-sm shadow-[5px_5px_0px_#000] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
            >
              See how it works
            </a>
          </motion.div>

          <motion.div
            {...fadeUp(0.5)}
            className="flex flex-wrap items-center gap-6"
          >
            {["Free to start", "No credit card", "Cancel anytime"].map(
              (text) => (
                <span
                  key={text}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-700"
                >
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border-[2px] border-[#00B87C] bg-[#EAFFF6]">
                    <Check size={9} className="text-[#00B87C]" />
                  </span>
                  {text}
                </span>
              ),
            )}
          </motion.div>
        </div>

        <div className="flex-1 w-full flex justify-center relative">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
