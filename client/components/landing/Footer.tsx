"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  GithubLogo,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  EnvelopeSimple,
} from "@phosphor-icons/react";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", href: "#docs" },
      { label: "API Reference", href: "#api" },
      { label: "Blog", href: "#blog" },
      { label: "Tutorials", href: "#tutorials" },
      { label: "Status", href: "#status" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Press", href: "#press" },
      { label: "Contact", href: "#contact" },
      { label: "Partners", href: "#partners" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "Security", href: "#security" },
    ],
  },
];

const socials = [
  { icon: <TwitterLogo size={18} weight="bold" />, href: "#twitter", label: "Twitter", bg: "bg-[#FFE14D]" },
  { icon: <GithubLogo size={18} weight="bold" />, href: "#github", label: "GitHub", bg: "bg-[#C4F0D8]" },
  { icon: <LinkedinLogo size={18} weight="bold" />, href: "#linkedin", label: "LinkedIn", bg: "bg-[#D0F0FF]" },
  { icon: <YoutubeLogo size={18} weight="bold" />, href: "#youtube", label: "YouTube", bg: "bg-[#FFD6CC]" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-[3px] border-black">
      {/* ── Top CTA band ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-b-[3px] border-[#333] px-6 py-14"
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              Ready to think{" "}
              <span
                className="text-[#6C47FF]"
                style={{ WebkitTextStroke: "1px white" }}
              >
                deeper?
              </span>
            </h2>
            <p className="text-gray-400 font-semibold text-sm max-w-sm">
              Join thousands of researchers, students, and teams already using Notebook.
            </p>
          </div>

          {/* Right: newsletter */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
            <div className="flex items-center border-[2.5px] border-white rounded-xl bg-white/10 px-4 py-3 gap-2 flex-1 min-w-[240px]">
              <EnvelopeSimple size={16} className="text-gray-400 shrink-0" />
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent text-white placeholder-gray-400 text-sm font-semibold outline-none flex-1"
              />
            </div>
            <a
              href="#start"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-[2.5px] border-white bg-[#6C47FF] text-white font-black text-sm shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all whitespace-nowrap"
            >
              Get started free
              <ArrowRight size={15} weight="bold" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Main links grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-2"
          >
            {/* Logo */}
            <a href="/" className="inline-flex items-center gap-2.5 mb-5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border-[2px] border-white bg-[#6C47FF] text-white font-black text-sm shadow-[3px_3px_0px_rgba(255,255,255,0.2)]">
                N
              </span>
              <span className="font-black text-xl text-white tracking-tight">Notebook</span>
            </a>

            <p className="text-gray-400 text-sm font-semibold leading-relaxed mb-6 max-w-[220px]">
              Your knowledge. Your sources. Your AI — grounded in what matters to you.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border-[2px] border-white ${s.bg} text-black shadow-[2px_2px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {footerLinks.map((col, i) => (
            <motion.div
              key={col.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.07 }}
            >
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t-[2px] border-[#333] px-6 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-gray-500">
          <p>© {new Date().getFullYear()} Notebook AI, Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
              All systems operational
            </span>
            <span>·</span>
            <span>Made with ♥ for curious minds</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
