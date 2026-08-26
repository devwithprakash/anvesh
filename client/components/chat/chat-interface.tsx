"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Search,
  Sparkles,
  FileText,
  Globe,
  Square,
  MessageSquare,
  BookOpen,
  Paperclip,
  Plus,
} from "lucide-react";
import { YoutubeLogo, TextT } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/components/providers/app-provider";
import { type Message, type Citation, AVAILABLE_MODELS } from "@/lib/mock-data";

// ─── Simulated streaming responses ───────────────────────────────────────────

const MOCK_RESPONSES = [
  `Based on the sources in your workspace, here's what I found:

**Key Insights**

The documents collectively highlight several important themes. The primary research suggests that the approach you're asking about has been validated across multiple studies, with consistent findings pointing to a 40–60% improvement in efficiency metrics.

**Supporting Evidence**

The PDF documents provide foundational theoretical context, while the website sources offer more practical, applied perspectives worth exploring further.

Would you like me to focus on any particular aspect?`,

  `That's a great question. Here's a breakdown based on your sources:

**Summary**

The sources collectively point to three core principles at work here:

1. **First principle** — The foundational concept that drives everything else
2. **Second principle** — How this interacts with existing frameworks
3. **Third principle** — Practical implications for real-world application

Is there a specific aspect you'd like to dive deeper into?`,

  `Excellent question! Here's what the research shows:

**What the evidence says**

The primary sources indicate the traditional view has been challenged by recent findings. Specifically:

- Earlier studies assumed a linear relationship, but newer research reveals it's more complex
- The interaction effects between variables are significant and often overlooked
- Context and environment play a much larger role than previously thought

Shall I elaborate on any of these points?`,
];

// ─── Citation chip ────────────────────────────────────────────────────────────

const CITATION_ICONS: Record<string, React.ReactNode> = {
  PDF: <FileText size={10} className="text-[#FF6B6B]" />,
  WEBSITE: <Globe size={10} className="text-blue-600" />,
  YOUTUBE: <YoutubeLogo size={10} className="text-red-600" />,
  TEXT: <TextT size={10} className="text-[#00B87C]" />,
  MARKDOWN: <TextT size={10} className="text-[#6C47FF]" />,
};

function CitationChip({
  citation,
  index,
}: {
  citation: Citation;
  index: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border-[1.5px] border-black bg-[#EDE9FE] px-1.5 py-0.5 text-[10px] font-black text-[#6C47FF] shadow-[1px_1px_0px_#000]">
      {CITATION_ICONS[citation.sourceType]}
      <span>[{index + 1}]</span>
      <span className="max-w-[90px] truncate text-black font-bold">
        {citation.sourceTitle}
      </span>
    </span>
  );
}

// ─── Inline text formatter ────────────────────────────────────────────────────

function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="flex flex-col gap-1">
      {lines.map((line, i) => {
        if (line === "") return <div key={i} className="h-1" />;
        if (line.startsWith("**") && line.endsWith("**") && line.length > 4)
          return (
            <p key={i} className="font-black text-black">
              {line.slice(2, -2)}
            </p>
          );
        if (line.startsWith("- "))
          return (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-gray-400 mt-0.5 shrink-0">•</span>
              <span>{formatInline(line.slice(2))}</span>
            </div>
          );
        if (/^\d+\.\s/.test(line))
          return (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-gray-400 shrink-0">
                {line.match(/^\d+/)?.[0]}.
              </span>
              <span>{formatInline(line.replace(/^\d+\.\s/, ""))}</span>
            </div>
          );
        return (
          <p key={i} className="text-sm leading-relaxed">
            {formatInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-black">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

// ─── User message ─────────────────────────────────────────────────────────────

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="flex items-end gap-2 max-w-[75%]">
        <div className="rounded-xl rounded-tr-sm border-[2px] border-black bg-[#6C47FF] px-3 py-2 shadow-[2px_2px_0px_#000] text-sm font-semibold text-white leading-relaxed">
          {content}
        </div>
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-[2px] border-black bg-[#EDE9FE] text-[9px] font-black text-[#6C47FF]">
          JD
        </div>
      </div>
    </div>
  );
}

// ─── AI message ───────────────────────────────────────────────────────────────

function AIMessage({ message }: { message: Message }) {
  return (
    <div className="flex items-start gap-2">
      {/* Avatar */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-[2px] border-black bg-[#EDE9FE] shadow-[1px_1px_0px_#000]">
        <Sparkles size={12} className="text-[#6C47FF]" />
      </div>

      {/* Bubble */}
      <div className="flex-1 min-w-0 max-w-[85%]">
        <div className="rounded-xl rounded-tl-sm border-[2px] border-black bg-white px-3 py-2.5 shadow-[2px_2px_0px_#000]">
          <FormattedText text={message.content} />
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">
              Sources:
            </span>
            {message.citations.map((c, i) => (
              <CitationChip key={i} citation={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Streaming bubble ─────────────────────────────────────────────────────────

function StreamingBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-[2px] border-black bg-[#EDE9FE] shadow-[1px_1px_0px_#000]">
        <Sparkles size={12} className="text-[#6C47FF] animate-pulse" />
      </div>
      <div className="rounded-xl rounded-tl-sm border-[2px] border-black bg-white px-3 py-2.5 shadow-[2px_2px_0px_#000] text-sm text-gray-700 leading-relaxed max-w-[85%]">
        {text || (
          <span className="flex items-center gap-1.5 text-gray-400 font-semibold text-xs">
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
            Thinking…
          </span>
        )}
        {text && (
          <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-[#6C47FF] animate-pulse align-text-bottom" />
        )}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyChat({ onSuggestion }: { onSuggestion: (q: string) => void }) {
  const suggestions = [
    "Summarise all my sources",
    "What are the key takeaways?",
    "Compare and contrast the main ideas",
    "What questions should I explore next?",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-6 text-center">
      {/* Icon */}
      <div className="flex size-12 items-center justify-center rounded-2xl border-[3px] border-black bg-[#EDE9FE] shadow-[3px_3px_0px_#000]">
        <Sparkles size={22} className="text-[#6C47FF]" />
      </div>
      <div>
        <h3 className="font-black text-lg text-black">Ask anything</h3>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">
          Chat with your sources using AI
        </p>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="rounded-lg border-[2px] border-black bg-white px-3 py-2.5 text-left text-xs font-bold text-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Chat Interface ───────────────────────────────────────────────────────────

interface ChatInterfaceProps {
  workspaceId: string;
  conversationId: string;
  /** Called on mobile to open the Chats drawer */
  onOpenChats?: () => void;
  /** Called on mobile to open the Sources drawer */
  onOpenSources?: () => void;
}

export function ChatInterface({
  workspaceId,
  conversationId,
  onOpenChats,
  onOpenSources,
}: ChatInterfaceProps) {
  const { messages, addMessage, conversations, sources } = useAppState();
  const msgList = messages[conversationId] ?? [];
  const srcList = sources[workspaceId] ?? [];

  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [webSearch, setWebSearch] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [conversationId]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgList.length, streamingText]);

  const simulateStream = useCallback(
    async (userMessage: string) => {
      setIsStreaming(true);
      setStreamingText("");

      addMessage(conversationId, {
        id: `msg-${Date.now()}`,
        conversationId,
        role: "USER",
        content: userMessage,
        createdAt: new Date().toISOString(),
      });

      const responseText =
        MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

      let accumulated = "";
      const chunkSize = 7;
      for (let i = 0; i < responseText.length; i += chunkSize) {
        accumulated += responseText.slice(i, i + chunkSize);
        setStreamingText(accumulated);
        await new Promise((r) => setTimeout(r, 16));
      }

      const readySources = srcList.filter((s) => s.status === "READY");
      const citations: Citation[] = readySources.slice(0, 2).map((s) => ({
        sourceId: s.id,
        sourceTitle: s.title,
        sourceType: s.type,
        chunkIndex: Math.floor(Math.random() * 10),
        text: "Relevant excerpt from this source providing context for the answer…",
      }));

      addMessage(conversationId, {
        id: `msg-${Date.now() + 1}`,
        conversationId,
        role: "ASSISTANT",
        content: responseText,
        citations: citations.length > 0 ? citations : undefined,
        createdAt: new Date().toISOString(),
      });
      setStreamingText("");
      setIsStreaming(false);
    },
    [conversationId, addMessage, srcList],
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    simulateStream(text);
  }, [input, isStreaming, simulateStream]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const convTitle = conversations[workspaceId]?.find(
    (c) => c.id === conversationId,
  )?.title;

  return (
    /* flex-col + min-h-0 is critical: makes the inner scroll area shrink properly */
    <div className="flex flex-1 flex-col min-h-0 min-w-0 bg-[#FFFBF0]">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between border-b-[2px] border-black px-3 sm:px-4 py-2 bg-[#FFFBF0] shrink-0 gap-2">
        {/* Left: mobile panel toggles + title */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Chats toggle — mobile only */}
          {onOpenChats && (
            <button
              onClick={onOpenChats}
              className="md:hidden flex size-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              aria-label="Open chats"
            >
              <MessageSquare size={13} />
            </button>
          )}
          <Sparkles size={13} className="text-[#6C47FF] shrink-0 hidden sm:block" />
          <span className="font-black text-sm text-black truncate">
            {convTitle ?? "Conversation"}
          </span>
        </div>

        {/* Right: web search + model + sources toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Grouped controls — web search + model selector */}
          <div className="flex items-center rounded-full border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] overflow-hidden">
            <button
              onClick={() => setWebSearch((v) => !v)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-[11px] font-black border-r-[2px] border-black transition-colors",
                webSearch
                  ? "bg-[#6C47FF] text-white"
                  : "text-black hover:bg-gray-50",
              )}
            >
              <Search size={10} />
              <span className="hidden sm:inline">Web</span>
            </button>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="px-2 sm:px-2.5 py-1 text-[11px] font-black text-black bg-transparent outline-none cursor-pointer max-w-[90px] sm:max-w-none"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sources toggle — mobile only */}
          {onOpenSources && (
            <button
              onClick={onOpenSources}
              className="md:hidden flex size-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              aria-label="Open sources"
            >
              <BookOpen size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Messages — flex-1 + overflow-y-auto for scroll ── */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
        {msgList.length === 0 && !isStreaming ? (
          <EmptyChat
            onSuggestion={(q) => {
              setInput(q);
              textareaRef.current?.focus();
            }}
          />
        ) : (
          <div className="flex flex-col gap-3.5 px-3 sm:px-5 py-5 max-w-3xl mx-auto w-full">
            {msgList.map((msg) =>
              msg.role === "USER" ? (
                <UserMessage key={msg.id} content={msg.content} />
              ) : (
                <AIMessage key={msg.id} message={msg} />
              ),
            )}
            {isStreaming && <StreamingBubble text={streamingText} />}
            <div />
          </div>
        )}
      </div>

      {/* ── Sticky composer — shrink-0 keeps it pinned at bottom ── */}
      <div className="shrink-0 border-t-[2px] border-black bg-[#FFFBF0] px-3 sm:px-4 py-3">
        {/* No-source warning */}
        {srcList.filter((s) => s.status === "READY").length === 0 && (
          <div className="mb-2.5 flex items-center gap-2 rounded-lg border-[2px] border-amber-500 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
            ⚠️ No ready sources — add sources for grounded answers.
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 rounded-xl border-[2.5px] border-black bg-white px-3 py-2 shadow-[3px_3px_0px_#000] focus-within:shadow-none focus-within:translate-x-[3px] focus-within:translate-y-[3px] transition-all">
            {/* Attachment + extra action buttons */}
            <div className="flex items-center gap-1 shrink-0 pb-0.5">
              <button
                className="flex size-6 items-center justify-center rounded-md text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                aria-label="Attach file"
              >
                <Paperclip size={14} />
              </button>
              <button
                className="flex size-6 items-center justify-center rounded-md text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                aria-label="More options"
              >
                <Plus size={14} />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              placeholder="Ask anything about your sources…"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm font-semibold text-black placeholder:text-gray-400 outline-none min-h-0 max-h-32 py-0.5"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() && !isStreaming}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-black bg-[#6C47FF] text-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              {isStreaming ? <Square size={11} /> : <Send size={11} />}
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] font-semibold text-gray-400">
            AI can make mistakes — always verify with your sources.
          </p>
        </div>
      </div>
    </div>
  );
}
