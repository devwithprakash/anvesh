"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileText,
  Globe,
  StickyNote,
  SendHorizontal,
  Sparkles,
  MessageCircle,
  Plus,
  UserCircle,
} from "lucide-react";

/* ─── Framer Motion helpers ───────────────────────────────── */
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

/* ─── App Mockup — mirrors actual workspace page layout ──── */
function AppMockup() {
  return (
    <motion.div
      {...scaleIn(0.3)}
      className="relative w-full max-w-[560px] rounded-2xl border-[3px] border-black bg-[#FFFBF0] shadow-[8px_8px_0px_#000] overflow-hidden"
    >
      {/* ── AppNavbar ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b-[2px] border-black bg-white shrink-0 gap-2">
        {/* Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md border-[2px] border-black bg-[#6C47FF] text-white text-[10px] font-black shadow-[2px_2px_0px_#000]">
            N
          </span>
          <span className="font-black text-xs text-black">Notebook</span>
        </div>
        {/* Workspace pill */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-black bg-[#EDE9FE] border-[2px] border-black rounded-lg px-2 py-1 shadow-[2px_2px_0px_#000]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6C47FF] shrink-0" />
          Research Project
          <svg width="8" height="5" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Right: PRO badge + avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline text-[9px] font-black bg-[#FFE14D] border-[1.5px] border-black rounded-full px-2 py-0.5 shadow-[1px_1px_0px_#000]">
            PRO
          </span>
          <div className="w-6 h-6 rounded-full bg-[#FFD166] border-[2px] border-black flex items-center justify-center text-[9px] font-black shadow-[2px_2px_0px_#000]">
            U
          </div>
        </div>
      </div>

      {/* ── Three-panel body ── */}
      <div className="flex" style={{ height: 300 }}>

        {/* Left panel: Conversation list */}
        <div className="w-[130px] shrink-0 border-r-[2px] border-black bg-white flex flex-col">
          <div className="px-3 py-2 border-b-[1px] border-black/10 flex items-center justify-between">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Chats</p>
            <button className="flex items-center gap-0.5 text-[9px] font-black text-[#6C47FF]">
              <Plus size={8} /> New
            </button>
          </div>
          <div className="flex flex-col gap-0.5 p-1.5 flex-1 overflow-hidden">
            {[
              { title: "AI model intro", active: true },
              { title: "Research summary" },
              { title: "Literature review" },
              { title: "Key findings" },
            ].map((c) => (
              <div
                key={c.title}
                className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[9px] font-bold cursor-pointer truncate ${
                  c.active
                    ? "bg-[#EDE9FE] text-[#6C47FF]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <MessageCircle size={9} className="shrink-0" />
                <span className="truncate">{c.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Chat messages */}
        <div className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
          {/* Chat top bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b-[1px] border-black/10 bg-[#FFFBF0] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C47FF]" />
            <span className="text-[10px] font-black text-black truncate">Intro to AI models</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden flex flex-col gap-2.5 px-3 py-3">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-[#6C47FF] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-[10px] font-semibold leading-relaxed max-w-[80%]">
                What are the key differences between supervised and unsupervised learning?
              </div>
            </div>

            {/* AI response */}
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-[#00D4AA] border-[1.5px] border-black flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]">
                <span className="text-[8px] font-black text-black">AI</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-700 leading-relaxed mb-1.5">
                  Supervised learning uses <span className="font-bold text-black">labelled data</span> to train models, while unsupervised learning finds patterns in <span className="font-bold text-black">unlabelled data</span>.{" "}
                  <span className="text-[#6C47FF] font-bold">[1]</span>
                </p>
                {/* Citation chips */}
                <div className="flex gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#6C47FF] bg-[#EDE9FE] border-[1px] border-[#6C47FF]/30 rounded-md px-1.5 py-0.5">
                    <FileText size={8} /> AI_Overview.pdf · p.12
                  </span>
                </div>
              </div>
            </div>

            {/* Second user message */}
            <div className="flex justify-end">
              <div className="bg-[#6C47FF] text-white rounded-2xl rounded-tr-sm px-3 py-2 text-[10px] font-semibold leading-relaxed max-w-[75%]">
                Give me an example of each type.
              </div>
            </div>

            {/* Second AI response — streaming effect with cursor */}
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-[#00D4AA] border-[1.5px] border-black flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]">
                <span className="text-[8px] font-black text-black">AI</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-700 leading-relaxed">
                  Supervised: email spam detection. Unsupervised: customer segmentation clustering.{" "}
                  <span className="text-[#6C47FF] font-bold">[2]</span>
                  <span className="inline-block w-0.5 h-3 bg-[#6C47FF] ml-0.5 animate-pulse align-middle" />
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Right panel: Sources panel */}
        <div className="w-[120px] shrink-0 border-l-[2px] border-black bg-white flex flex-col">
          <div className="px-3 py-2 border-b-[1px] border-black/10 flex items-center justify-between">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sources</p>
            <span className="text-[9px] font-black text-[#6C47FF] bg-[#EDE9FE] px-1.5 py-0.5 rounded-full">
              12
            </span>
          </div>
          <div className="flex flex-col gap-0.5 p-1.5 overflow-hidden flex-1">
            {[
              { icon: <FileText size={9} />, name: "AI_Overview.pdf", color: "text-[#FF6B6B]", status: "bg-[#00B87C]" },
              { icon: <Globe size={9} />, name: "arxiv.org/1234", color: "text-[#6C47FF]", status: "bg-[#00B87C]" },
              { icon: <FileText size={9} />, name: "Research.docx", color: "text-[#FF6B6B]", status: "bg-[#00B87C]" },
              { icon: <StickyNote size={9} />, name: "My notes.txt", color: "text-[#00B87C]", status: "bg-[#FFD166]" },
            ].map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-gray-50 cursor-pointer"
              >
                <span className={s.color + " shrink-0"}>{s.icon}</span>
                <span className="text-[9px] font-semibold text-gray-700 truncate flex-1">
                  {s.name}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.status}`} />
              </div>
            ))}
            <button className="mt-auto w-full flex items-center justify-center gap-1 text-[9px] font-bold text-gray-400 border-[1.5px] border-dashed border-gray-200 rounded-lg px-2 py-1.5 hover:border-black hover:text-black transition-colors">
              <Plus size={8} />
              Add source
            </button>
          </div>
        </div>
      </div>

      {/* ── Input bar at bottom ── */}
      <div className="px-3 py-2 border-t-[2px] border-black bg-[#FFFBF0]">
        <div className="flex items-center gap-2 border-[2px] border-black rounded-xl px-3 py-2 bg-white shadow-[2px_2px_0px_#000]">
          {/* Web search toggle */}
          <button className="flex items-center gap-1 text-[9px] font-black text-gray-400 border-[1.5px] border-gray-200 rounded-full px-1.5 py-0.5 shrink-0 hover:border-black transition-colors">
            <Globe size={9} />
            <span>Web</span>
          </button>
          <span className="flex-1 text-[10px] text-gray-400 font-medium">Ask anything…</span>
          <button className="bg-[#6C47FF] border-[2px] border-black text-white rounded-lg p-1 shadow-[2px_2px_0px_#000] shrink-0">
            <SendHorizontal size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Source Chips — compact animated pills ──────────────── */
function SourceChips() {
  const chips = [
    { icon: <FileText size={12} />, label: "PDFs & Docs", bg: "bg-[#FFD6CC]", border: "border-[#FF6B6B]", floatDur: "3s",  floatDelay: "0s"    },
    { icon: <Globe size={12} />,    label: "Web Pages",   bg: "bg-[#FFF8DC]", border: "border-[#FFD166]", floatDur: "3.6s", floatDelay: "0.5s"  },
    { icon: <StickyNote size={12} />, label: "Notes",     bg: "bg-[#D0F0FF]", border: "border-[#6EC6E6]", floatDur: "2.8s", floatDelay: "1s"    },
  ];

  return (
    <>
      {/* chipFloat keyframe for the floating pill animation */}
      <style>{`
        @keyframes chipFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>

      <div className="absolute right-[-128px] top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-start gap-2.5 select-none">

        {/* Chips render first — naturally on top */}
        {chips.map((chip, i) => (
          <motion.div
            key={chip.label}
            {...slideRight(0.7 + i * 0.15)}
            style={{
              animation: `chipFloat ${chip.floatDur} ease-in-out ${chip.floatDelay} infinite`,
              position: "relative",
              zIndex: 2,
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border-[2px] ${chip.border} ${chip.bg} shadow-[2px_2px_0px_#000] text-[11px] font-black text-black whitespace-nowrap`}
          >
            {chip.icon}
            {chip.label}
          </motion.div>
        ))}

        {/* Dashed curved bracket — draws itself in on first render, then flows */}
        <svg
          className="absolute left-[-24px] top-2 pointer-events-none"
          style={{ zIndex: 1 }}
          width="26"
          height="112"
          viewBox="0 0 26 112"
          fill="none"
        >
          <motion.path
            d="M22 8 C 4 8, 4 56, 22 56 C 4 56, 4 104, 22 104"
            stroke="#000"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="4 3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut", delay: 0.65 }}
          />
          {/* Arrowhead fades in after path finishes drawing */}
          <motion.polygon
            points="22,4 17,10 27,10"
            fill="#000"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 1.45, ease: "backOut" }}
            style={{ transformOrigin: "22px 8px" }}
          />
        </svg>

        {/* Sparkle top */}
        <motion.span
          {...fadePop(1.2)}
          className="absolute -top-5 right-0 text-lg font-black text-[#FFD166]"
          style={{ WebkitTextStroke: "1.5px black" }}
        >✦</motion.span>
        {/* Sparkle bottom */}
        <motion.span
          {...fadePop(1.6)}
          className="absolute -bottom-5 right-3 text-sm font-black text-[#6C47FF] opacity-70"
        >✦</motion.span>
      </div>
    </>
  );
}

/* ─── Hero Section ────────────────────────────────────────── */
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

          {/* Headline */}
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
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-[2.5px] border-black bg-[#6C47FF] text-white font-black text-sm shadow-[5px_5px_0px_#000] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
            >
              Start your notebook
              <ArrowRight size={16} />
            </a>
            <a
              href="/#how-it-works"
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
                  <Check size={9} className="text-[#00B87C]" />
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
