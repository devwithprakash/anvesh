"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What kind of files can I upload?",
    a: "You can upload PDFs, Word documents (.docx), plain text files (.txt), and Markdown files. You can also paste in web page URLs and we will extract the content automatically. Support for more formats like PowerPoint and spreadsheets is coming soon.",
  },
  {
    q: "How does Anvesh ground answers in my sources?",
    a: "When you ask a question, Anvesh retrieves the most relevant passages from your uploaded documents using semantic search, then asks the AI to answer strictly based on those retrieved chunks, ensuring accuracy and relevance.",
  },
  {
    q: "Is my data private and secure?",
    a: "Absolutely. Your documents are stored in an encrypted, isolated environment. We never use your data to train AI models, and we never share it with third parties. You can delete your data at any time from your account settings.",
  },
  {
    q: "Can I use Anvesh with my team?",
    a: "Yes! The Team plan lets you create shared workspaces where multiple members can upload sources, ask questions, and collaborate on notes. Admins can manage permissions, view usage, and enforce security policies.",
  },
  {
    q: "What AI model powers the answers?",
    a: "Anvesh uses a combination of state-of-the-art large language models optimised for retrieval-augmented generation (RAG). The exact model may vary depending on your plan and the type of query. We continuously evaluate and update our model stack to give you the best accuracy.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. You can cancel at any time from your billing settings. Your plan stays active until the end of your current billing period, after which you will be moved to the Free tier. There are no cancellation fees or long-term commitments.",
  },
  {
    q: "Do you offer a free trial for paid plans?",
    a: "Yes — every new account gets a 14-day free trial of the Pro plan with no credit card required. If you decide not to upgrade, you automatically switch to the Free tier at the end of the trial.",
  },
];

const accentColors = [
  "bg-[#FFE14D]",
  "bg-[#C4F0D8]",
  "bg-[#E8DFFF]",
  "bg-[#FFD6CC]",
  "bg-[#D0F0FF]",
  "bg-[#FFDAF0]",
  "bg-[#FFE14D]",
];

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.07 }}
      className={`border-[2.5px] border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-shadow`}
    >
      {/* Question row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 bg-white text-left group"
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border-[2px] border-black ${accentColors[index % accentColors.length]} text-[11px] font-black shadow-[2px_2px_0px_#000] shrink-0`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-black text-black text-[0.95rem] leading-snug">
            {faq.q}
          </span>
        </div>
        <span
          className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xl border-[2px] border-black shadow-[2px_2px_0px_#000] transition-colors ${isOpen ? "bg-black text-white" : "bg-white text-black group-hover:bg-black group-hover:text-white"}`}
        >
          {isOpen ? (
            <Minus size={14} />
          ) : (
            <Plus size={14} />
          )}
        </span>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={`px-6 pb-5 pt-1 border-t-[2px] border-black ${accentColors[index % accentColors.length]}`}
            >
              <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="bg-[#FFFBF0] py-20 border-t-[3px] border-black"
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block border-[2.5px] border-black bg-[#FFD6CC] px-4 py-1 text-xs font-black shadow-[3px_3px_0px_#000] mb-4 rounded-full">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-3">
            Got questions?
          </h2>
          <p className="text-gray-600 font-semibold text-base">
            Here are the ones we get asked the most.
          </p>
        </motion.div>

        {/* FAQ list */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* CTA below FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-sm font-bold text-gray-600 mb-4">
            Still have questions? We are happy to help.
          </p>
          <a
            href="mailto:support@anvesh.ai"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-[2.5px] border-black bg-black text-white font-black text-sm shadow-[5px_5px_0px_#6C47FF] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
          >
            Contact support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
