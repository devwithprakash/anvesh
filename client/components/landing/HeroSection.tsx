"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FilePdf,
  Globe,
  Note,
  PaperPlaneTilt,
  Sparkle,
  ChatCircle,
  Notepad,
  Lightning,
  Gear,
  Plus,
  UserCircle,
} from "@phosphor-icons/react";

/* ─── Framer Motion helpers ──────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut", delay } as any },
});

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.93, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay } as any },
});

const slideRight = (delay = 0) => ({
  initial: { opacity: 0, x: 36 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.55, ease: "easeOut", delay } as any },
});

const fadePop = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.4 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "backOut", delay } as any },
});

/* ─── App Mockup (pixel-faithful to reference) ───────────── */
function AppMockup() {
  return (
    <motion.div
      {...scaleIn(0.3)}
      className="relative w-full max-w-[600px] rounded-2xl border-[3px] border-black bg-white shadow-[8px_8px_0px_#000] overflow-hidden"
    >
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b-[2px] border-black bg-white">
        {/* Left: logo + title */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg border-[2px] border-black bg-[#6C47FF] text-white text-[11px] font-black shadow-[2px_2px_0px_#000]">
            N
          </span>
          <span className="font-black text-sm text-black">Notebook</span>
        </div>
        {/* Center: workspace dropdown */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-black bg-gray-100 border-[2px] border-black rounded-lg px-3 py-1 shadow-[2px_2px_0px_#000]">
          My Workspace
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        {/* Right: Research Assistant label */}
        <div className="text-right">
          <div className="flex items-center gap-1 font-black text-sm text-black">
            Research Assistant
            <Sparkle size={13} weight="fill" className="text-yellow-400" />
          </div>
          <p className="text-[10px] text-gray-400 font-medium">Ask anything about your sources</p>
        </div>
        {/* New chat button */}
        <button className="flex items-center gap-1 text-[11px] font-bold border-[2px] border-black rounded-lg px-2.5 py-1.5 bg-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap">
          <Note size={12} /> New chat
        </button>
      </div>

      {/* ── Body: sidebar + chat ── */}
      <div className="flex" style={{ height: 360 }}>
        {/* Sidebar */}
        <div className="w-[148px] border-r-[2px] border-black bg-[#FAFAFA] flex flex-col py-3 gap-0.5 shrink-0">
          {[
            { icon: <FilePdf size={14} />, label: "Sources" },
            { icon: <ChatCircle size={14} />, label: "Chat", active: true },
            { icon: <Notepad size={14} />, label: "Notes" },
            { icon: <Lightning size={14} />, label: "Prompts" },
            { icon: <Gear size={14} />, label: "Settings" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                item.active
                  ? "bg-[#EDE9FE] text-[#6C47FF]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </div>
          ))}

          <div className="mt-auto mx-2">
            <button className="w-full flex items-center gap-1.5 text-[11px] font-bold text-gray-500 border-[2px] border-dashed border-gray-300 rounded-lg px-2.5 py-2 hover:border-black hover:text-black transition-colors">
              <Plus size={12} />
              New Workspace
            </button>
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* User question bubble */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 bg-[#6C47FF] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-xs font-semibold leading-relaxed max-w-[75%]">
                What are the main principles of formal methods?
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 border-[2px] border-black flex items-center justify-center shrink-0 mt-0.5">
                <UserCircle size={20} weight="fill" className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* AI response */}
          <div className="flex-1 px-4 pb-2 overflow-y-auto">
            <div className="flex gap-2.5 items-start">
              {/* AI avatar */}
              <div className="w-8 h-8 rounded-full bg-[#00D4AA] border-[2px] border-black flex items-center justify-center shrink-0 mt-0.5 shadow-[2px_2px_0px_#000]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="black"/>
                </svg>
              </div>

              {/* Response card */}
              <div className="flex-1 min-w-0">
                <p className="text-[11.5px] text-gray-700 leading-relaxed mb-2.5">
                  Formal methods are mathematically based techniques used for the specification, design, development, and verification of software and hardware systems.{" "}
                  <span className="text-[#6C47FF] font-bold">[1]</span>
                </p>

                {/* Section 1 */}
                <p className="text-[11.5px] font-black text-black mb-1">1. Mathematics Foundations</p>
                <ul className="mb-2.5 space-y-0.5">
                  <li className="flex gap-1.5 text-[11px] text-gray-600">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Use mathematical models to precisely describe systems and their behavior. <span className="text-[#6C47FF] font-bold">[1]</span></span>
                  </li>
                </ul>

                {/* Section 2 */}
                <p className="text-[11.5px] font-black text-black mb-1">2. Formal Specification</p>
                <ul className="mb-3 space-y-0.5">
                  <li className="flex gap-1.5 text-[11px] text-gray-600">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Specify requirements using formal notations like Z, VDM, or Event-B. <span className="text-[#6C47FF] font-bold">[2]</span></span>
                  </li>
                  <li className="flex gap-1.5 text-[11px] text-gray-600">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>Eliminates ambiguity and inconsistencies. <span className="text-[#6C47FF] font-bold">[1]</span></span>
                  </li>
                </ul>

                {/* Sources row */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t-[1.5px] border-gray-200">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-500">
                      <span className="text-[#6C47FF] font-bold">[1]</span> Software Engineering.pdf — Page 52
                    </p>
                    <p className="text-[10px] text-gray-500">
                      <span className="text-[#6C47FF] font-bold">[2]</span> Formal Methods.pdf — Page 62
                    </p>
                  </div>
                  <button className="text-[10.5px] font-black border-[2px] border-black rounded-lg px-3 py-1.5 bg-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap shrink-0">
                    View sources
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Input bar */}
          <div className="px-4 py-3 border-t-[2px] border-black">
            <div className="flex items-center gap-2 border-[2px] border-black rounded-xl px-3 py-2.5 bg-white shadow-[2px_2px_0px_#000]">
              <span className="flex-1 text-[11.5px] text-gray-400 font-medium">Ask a follow-up...</span>
              <button className="bg-[#6C47FF] border-[2px] border-black text-white rounded-lg p-1.5 shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                <PaperPlaneTilt size={13} weight="fill" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Floating Source Chips ──────────────────────────────── */
function SourceChips() {
  const chips = [
    { icon: <FilePdf size={14} />, label: "PDFs + Docs", bg: "bg-[#FFE8E8]", delay: 0.7 },
    { icon: <Globe size={14} />, label: "Web Pages",   bg: "bg-[#FFF8E1]", delay: 0.85 },
    { icon: <Note size={14} />, label: "Notes",        bg: "bg-[#E8F4FF]", delay: 1.0 },
  ];

  return (
    <div className="absolute right-[-120px] top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3">
      {chips.map((chip) => (
        <motion.div
          key={chip.label}
          {...slideRight(chip.delay)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-[2.5px] border-black ${chip.bg} shadow-[4px_4px_0px_#000] text-xs font-black text-black whitespace-nowrap`}
        >
          {chip.icon}
          {chip.label}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Hero Section ───────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section className="relative bg-[#FFFBF0] min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Decorative symbols */}
      <motion.span {...fadePop(0.9)} className="absolute top-14 left-[43%] text-2xl text-[#6C47FF] opacity-50 pointer-events-none select-none font-black">✳</motion.span>
      <motion.span {...fadePop(1.1)} className="absolute top-10 right-[10%] text-2xl text-[#FFE14D] pointer-events-none select-none font-black" style={{ WebkitTextStroke: "1.5px black" }}>✦</motion.span>
      <motion.span {...fadePop(1.3)} className="absolute bottom-28 right-[19%] text-lg text-[#6C47FF] opacity-40 pointer-events-none select-none font-black">✦</motion.span>

      {/* Wave under "Your AI." */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-14 lg:gap-16">
        {/* ── LEFT ── */}
        <div className="flex-1 max-w-[480px]">
          {/* Badge */}
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-black bg-[#EAFFF6] px-4 py-1.5 text-[11px] font-black text-black mb-7 shadow-[3px_3px_0px_#000]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00B87C] shrink-0" />
            AI ANSWERS GROUNDED IN YOUR SOURCES
          </motion.div>

          {/* Headline lines */}
          <motion.h1 {...fadeUp(0.1)} className="text-[3.1rem] sm:text-[3.5rem] leading-[1.08] font-black text-black tracking-tight">
            Your knowledge.
          </motion.h1>
          <motion.h1 {...fadeUp(0.18)} className="text-[3.1rem] sm:text-[3.5rem] leading-[1.08] font-black text-black tracking-tight">
            Your sources.
          </motion.h1>
          <motion.h1 {...fadeUp(0.26)} className="text-[3.1rem] sm:text-[3.5rem] leading-[1.08] font-black text-[#6C47FF] tracking-tight mb-1">
            Your AI.
          </motion.h1>

          {/* Wave squiggle */}
          <motion.div {...fadeUp(0.29)} className="mb-5">
            <svg width="56" height="16" viewBox="0 0 56 16" fill="none">
              <path d="M2 8 Q9 2 16 8 Q23 14 30 8 Q37 2 44 8 Q51 14 58 8" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
          </motion.div>

          {/* Subtext */}
          <motion.p {...fadeUp(0.34)} className="text-gray-600 text-[15px] font-semibold leading-relaxed mb-8 max-w-[400px]">
            Upload your documents, ask anything, and get grounded answers with citations you can trust.
          </motion.p>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.42)} className="flex flex-wrap items-center gap-4 mb-7">
            <a
              href="#start"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-[2.5px] border-black bg-[#6C47FF] text-white font-black text-sm shadow-[5px_5px_0px_#000] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
            >
              Start your notebook
              <ArrowRight size={16} weight="bold" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center px-6 py-3 rounded-xl border-[2.5px] border-black bg-white text-black font-black text-sm shadow-[5px_5px_0px_#000] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
            >
              See how it works
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div {...fadeUp(0.5)} className="flex flex-wrap items-center gap-6">
            {["Free to start", "No credit card", "Cancel anytime"].map((text) => (
              <span key={text} className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border-[2px] border-[#00B87C] bg-[#EAFFF6]">
                  <Check size={9} weight="bold" className="text-[#00B87C]" />
                </span>
                {text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex-1 w-full flex justify-center relative">
          <AppMockup />
          <SourceChips />
        </div>
      </div>
    </section>
  );
}
