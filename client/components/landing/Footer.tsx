"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "/pricing" },
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

/* Brand icons as inline SVGs — lucide-react intentionally omits brand logos */
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const socials = [
  { icon: <TwitterIcon />, href: "#twitter", label: "Twitter", bg: "bg-[#FFE14D]" },
  { icon: <GithubIcon />, href: "#github", label: "GitHub", bg: "bg-[#C4F0D8]" },
  { icon: <LinkedinIcon />, href: "#linkedin", label: "LinkedIn", bg: "bg-[#D0F0FF]" },
  { icon: <YoutubeIcon />, href: "#youtube", label: "YouTube", bg: "bg-[#FFD6CC]" },
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
              Join thousands of researchers, students, and teams already using Anvesh.
            </p>
          </div>

          {/* Right: newsletter */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
            <div className="flex items-center border-[2.5px] border-white rounded-xl bg-white/10 px-4 py-3 gap-2 flex-1 min-w-[240px]">
              <Mail size={16} className="text-gray-400 shrink-0" />
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
              <ArrowRight size={15} />
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
              <span className="font-black text-xl text-white tracking-tight">Anvesh</span>
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
          <p>© {new Date().getFullYear()} Anvesh AI, Inc. All rights reserved.</p>
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
