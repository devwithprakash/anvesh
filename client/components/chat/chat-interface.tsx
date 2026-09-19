"use client";

import * as React from "react";
import { UIMessage, DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Sparkles,
  FileText,
  Globe,
  Square,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { YoutubeLogo, TextT } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/components/providers/app-provider";
import { Citation } from "@/features/conversation/types";
import { useMessages } from "@/features/conversation/queries";
import { useSources } from "@/features/source/queries";
import { useSubscriptionStatus } from "@/features/subscription/queries";

// ─── Citation chip ────────────────────────────────────────────────────────────

const CITATION_ICONS: Record<string, React.ReactNode> = {
  PDF: <FileText size={10} className="text-[#FF6B6B]" />,
  WEBSITE: <Globe size={10} className="text-blue-600" />,
  YOUTUBE: <YoutubeLogo size={10} className="text-red-600" />,
  TEXT: <TextT size={10} className="text-[#00B87C]" />,
  MARKDOWN: <TextT size={10} className="text-[#6C47FF]" />,
};

function InlineCitation({
  citation,
  label,
}: {
  citation: Citation;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  const icon = CITATION_ICONS[citation.sourceType] ?? (
    <FileText size={10} className="text-gray-500" />
  );
  const isWeb = citation.sourceType === "WEB";

  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Badge */}
      <span className="inline-flex items-center gap-0.5 rounded-md border-[1.5px] border-black bg-[#EDE9FE] px-1 py-0 text-[10px] font-black text-[#6C47FF] shadow-[1px_1px_0px_#000] cursor-default align-baseline mx-0.5 leading-none">
        {icon}
        <span>[{label}]</span>
      </span>

      {/* Hover popover */}
      {open && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <span className="block w-64 rounded-lg border-[2px] border-black bg-white px-3 py-2.5 shadow-[3px_3px_0px_#000] text-left">
            {/* Header */}
            <span className="flex items-center gap-1.5 mb-1.5">
              {icon}
              <span className="text-[11px] font-black text-black truncate">
                {citation.sourceTitle}
              </span>
            </span>

            {/* Meta row */}
            <span className="flex items-center gap-2 text-[10px] text-gray-500 font-semibold mb-1.5">
              <span className="rounded bg-gray-100 px-1 py-0.5 border border-gray-200">
                {isWeb ? "Web" : citation.sourceType}
              </span>
              {citation.page && <span>Page {citation.page}</span>}
              {citation.score != null && (
                <span>Score {(citation.score * 100).toFixed(0)}%</span>
              )}
            </span>

            {/* Excerpt */}
            {citation.excerpt && (
              <span className="block text-[11px] text-gray-600 leading-snug line-clamp-3 font-medium">
                &ldquo;{citation.excerpt}&rdquo;
              </span>
            )}

            {/* Web URL */}
            {isWeb && citation.url && (
              <span className="block text-[10px] text-[#6C47FF] font-bold mt-1 truncate">
                {citation.url}
              </span>
            )}
          </span>
          {/* Arrow */}
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 border-r-[2px] border-b-[2px] border-black bg-white" />
        </span>
      )}
    </span>
  );
}

function FormattedText({
  text,
  citations,
}: {
  text: string;
  citations?: Record<string, Citation>;
}) {
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
              <span>{formatInline(line.slice(2), citations)}</span>
            </div>
          );
        if (/^\d+\.\s/.test(line))
          return (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-gray-400 shrink-0">
                {line.match(/^\d+/)?.[0]}.
              </span>
              <span>
                {formatInline(line.replace(/^\d+\.\s/, ""), citations)}
              </span>
            </div>
          );
        return (
          <p key={i} className="text-sm leading-relaxed">
            {formatInline(line, citations)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parse inline markdown bold and citation references like [1], [2], [W1].
 * When a citation reference matches a key in the citations map, render
 * an interactive InlineCitation badge; otherwise render the raw text.
 */
function formatInline(
  text: string,
  citations?: Record<string, Citation>,
): React.ReactNode {
  // Split on bold (**...**) and citation references ([1], [W1], etc.)
  const parts = text.split(/(\*\*[^*]+\*\*|\[W?\d+\])/g);

  return parts.map((part, i) => {
    // Bold
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-black">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Citation reference like [1], [2], [W1], [W2]
    const citationMatch = part.match(/^\[(W?\d+)\]$/);
    if (citationMatch && citations) {
      const label = citationMatch[1]; // "1", "2", "W1", etc.
      const citation = citations[label];
      if (citation) {
        return <InlineCitation key={i} citation={citation} label={label} />;
      }
    }

    return part;
  });
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

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

/** Build a citation lookup map keyed by citation id/label → Citation */
function buildCitationMap(
  citations: Citation[] | undefined | null,
): Record<string, Citation> {
  if (!citations?.length) return {};
  const map: Record<string, Citation> = {};
  for (const c of citations) {
    map[c.id] = c;
  }
  return map;
}

function toUIMessagesWithCitations(raw: any[] = []): {
  messages: UIMessage[];
  citationsByMessage: Record<string, Record<string, Citation>>;
} {
  const citationsByMessage: Record<string, Record<string, Citation>> = {};
  const messages: UIMessage[] = raw.map((m) => {
    if (m.citations?.length) {
      citationsByMessage[m.id] = buildCitationMap(m.citations);
    }
    return {
      id: m.id,
      role: m.role.toLowerCase() as "user" | "assistant",
      parts: [{ type: "text", text: m.content }],
    };
  });
  return { messages, citationsByMessage };
}

function AIMessage({
  message,
  citations,
}: {
  message: UIMessage;
  citations?: Record<string, Citation>;
}) {
  const text = getTextContent(message);

  return (
    <div className="flex items-start gap-2">
      {/* Avatar */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-[2px] border-black bg-[#EDE9FE] shadow-[1px_1px_0px_#000]">
        <Sparkles size={12} className="text-[#6C47FF]" />
      </div>

      {/* Bubble */}
      <div className="flex-1 min-w-0 max-w-[85%]">
        <div className="rounded-xl rounded-tl-sm border-[2px] border-black bg-white px-3 py-2.5 shadow-[2px_2px_0px_#000]">
          <FormattedText text={text} citations={citations} />
        </div>
      </div>
    </div>
  );
}

// ─── Streaming bubble ─────────────────────────────────────────────────────────

function StreamingBubble({
  text,
  citations,
}: {
  text: string;
  citations?: Record<string, Citation>;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-[2px] border-black bg-[#EDE9FE] shadow-[1px_1px_0px_#000]">
        <Sparkles size={12} className="text-[#6C47FF] animate-pulse" />
      </div>
      <div className="rounded-xl rounded-tl-sm border-[2px] border-black bg-white px-3 py-2.5 shadow-[2px_2px_0px_#000] text-sm text-gray-700 leading-relaxed max-w-[85%]">
        {text ? (
          <>
            <FormattedText text={text} citations={citations} />
            <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-[#6C47FF] animate-pulse align-text-bottom" />
          </>
        ) : (
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

interface ChatInnerProps extends ChatInterfaceProps {
  initialMessages: UIMessage[];
  initialCitationsMap: Record<string, Record<string, Citation>>;
}

function ChatInner({
  workspaceId,
  conversationId,
  initialMessages,
  initialCitationsMap,
  onOpenChats,
  onOpenSources,
}: ChatInnerProps) {
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(false);

  // Citations from loaded historical messages + accumulated from streaming
  const [citationsMap, setCitationsMap] = useState<
    Record<string, Record<string, Citation>>
  >(initialCitationsMap);

  const { conversations } = useAppState();
  const { data: sources } = useSources(workspaceId);
  const { data: subStatus } = useSubscriptionStatus();
  
  const webSearchAllowed = subStatus?.plan?.webSearchEnabled ?? false;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop, error } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `${API_BASE_URL}/workspaces/${workspaceId}/chat`,
      credentials: "include",
      body: {
        conversationId,
        webSearch,
      },
    }),
  });

  // Extract citations from streaming data parts whenever messages update.
  // The server sends citations as a custom data part: { type: "data", data: [...] }
  // which the AI SDK surfaces on the message as parts with type "data".
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "assistant") return;

    const dataParts = lastMsg.parts.filter(
      (p) => p.type.startsWith("data-") && Array.isArray((p as any).data),
    );

    if (dataParts.length === 0) return;

    // The server sends a single data-citations part with the full array
    const allCitations: Citation[] = [];
    for (const dp of dataParts) {
      const arr = (dp as any).data;
      if (Array.isArray(arr)) {
        for (const item of arr) {
          if (item && typeof item === "object" && item.id && item.sourceTitle) {
            allCitations.push(item as Citation);
          }
        }
      }
    }

    if (allCitations.length > 0) {
      const map = buildCitationMap(allCitations);
      setCitationsMap((prev) => ({
        ...prev,
        [lastMsg.id]: map,
      }));
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || status === "streaming" || status === "submitted") {
      return;
    }

    sendMessage({
      text: input,
    });

    setInput("");
  };

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    textareaRef.current?.focus();
  }, [conversationId]);

  // Auto-scroll on new messages / streaming updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  // While streaming the last assistant message arrives token-by-token —
  // show it in StreamingBubble so the cursor blink animation works.
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const streamingMessage =
    isStreaming && lastMsg?.role === "assistant" ? lastMsg : null;

  const staticMessages = streamingMessage ? messages.slice(0, -1) : messages;

  const streamingText = streamingMessage
    ? getTextContent(streamingMessage)
    : "";

  // Get citations for the currently streaming message
  const streamingCitations = streamingMessage
    ? citationsMap[streamingMessage.id]
    : undefined;

  const convTitle = conversations[workspaceId]?.find(
    (c) => c.id === conversationId,
  )?.title;

  return (
    /* flex-col + min-h-0 is critical: makes the inner scroll area shrink properly */
    <div className="flex flex-1 flex-col min-h-0 min-w-0 bg-[#FFFBF0]">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between border-b-[2px] border-black px-3 sm:px-4 py-4 bg-[#FFFBF0] shrink-0 gap-2">
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
          <Sparkles
            size={13}
            className="text-[#6C47FF] shrink-0 hidden sm:block"
          />
          <span className="font-black text-sm text-black truncate">
            {convTitle ?? "Conversation"}
          </span>
        </div>

        {/* Right: sources toggle */}
        <div className="flex items-center gap-2 shrink-0">
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
        {staticMessages.length === 0 && !isStreaming ? (
          <EmptyChat
            onSuggestion={(q) => {
              setInput(q);
              textareaRef.current?.focus();
            }}
          />
        ) : (
          <div className="flex flex-col gap-3.5 px-3 sm:px-5 py-5 max-w-3xl mx-auto w-full">
            {staticMessages.map((msg: UIMessage) =>
              msg.role === "user" ? (
                <UserMessage
                  key={msg.id}
                  content={msg.parts
                    .filter((part) => part.type === "text")
                    .map((part) => part.text)
                    .join("")}
                />
              ) : (
                <AIMessage
                  key={msg.id}
                  message={msg}
                  citations={citationsMap[msg.id]}
                />
              ),
            )}
            {isStreaming && (
              <StreamingBubble
                text={streamingText}
                citations={streamingCitations}
              />
            )}
            {error && (
              <div className="text-xs font-semibold text-red-500 text-center py-2">
                Error:{" "}
                {error.message ?? "Something went wrong. Please try again."}
              </div>
            )}
            <div />
          </div>
        )}
      </div>

      {/* ── Sticky composer — shrink-0 keeps it pinned at bottom ── */}
      <div className="shrink-0 border-t-[2px] border-black bg-[#FFFBF0] px-3 sm:px-4 py-3">
        {/* No-source warning */}
        {sources?.filter((s) => s.status === "READY").length === 0 && (
          <div className="mb-2.5 flex items-center gap-2 rounded-lg border-[2px] border-amber-500 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
            ⚠️ No ready sources — add sources for grounded answers.
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 rounded-xl border-[2.5px] border-black bg-white px-3 py-2 shadow-[3px_3px_0px_#000] focus-within:shadow-none focus-within:translate-x-[3px] focus-within:translate-y-[3px] transition-all"
          >
            {/* Web Search toggle on left side of input bar */}
            <button
              type="button"
              onClick={() => webSearchAllowed && setWebSearch((v) => !v)}
              disabled={!webSearchAllowed}
              title={
                !webSearchAllowed
                  ? "Upgrade to Pro to use Web Search"
                  : webSearch
                    ? "Disable web search"
                    : "Enable web search"
              }
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-[1.5px] border-black text-[11px] font-black transition-all shrink-0 mb-0.5 shadow-[1.5px_1.5px_0px_#000]",
                !webSearchAllowed
                  ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-300 shadow-none"
                  : webSearch
                    ? "bg-[#6C47FF] text-white"
                    : "bg-[#FFFBF0] text-black hover:bg-gray-100",
              )}
            >
              <Globe size={12} />
              <span className="hidden sm:inline">Web</span>
            </button>

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
              type={isStreaming ? "button" : "submit"}
              onClick={isStreaming ? stop : undefined}
              disabled={!isStreaming && !input.trim()}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-black bg-[#6C47FF] text-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-40 disabled:pointer-events-none"
            >
              {isStreaming ? <Square size={11} /> : <Send size={11} />}
            </button>
          </form>
          <p className="mt-1.5 text-center text-[10px] font-semibold text-gray-400">
            AI can make mistakes — always verify with your sources.
          </p>
        </div>
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export function ChatInterface({
  workspaceId,
  conversationId,
  onOpenChats,
  onOpenSources,
}: ChatInterfaceProps) {
  const { data: conversationMessages, isPending } = useMessages({
    workspaceId,
    conversationId,
  });

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col min-h-0 min-w-0 bg-[#FFFBF0]">
        {/* Top bar skeleton */}
        <div className="flex items-center justify-between border-b-[2px] border-black px-4 py-2 bg-[#FFFBF0] shrink-0 gap-2">
          <div className="h-4 w-36 rounded-lg bg-black/10 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-black/10 animate-pulse" />
        </div>
        {/* Messages skeleton */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6">
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            <div className="flex justify-end">
              <div className="h-10 w-52 rounded-2xl rounded-tr-sm bg-[#6C47FF]/15 animate-pulse" />
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-black/10 animate-pulse shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 w-full rounded bg-black/10 animate-pulse" />
                <div className="h-3 w-4/5 rounded bg-black/10 animate-pulse" />
                <div className="h-3 w-3/5 rounded bg-black/10 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="h-8 w-40 rounded-2xl rounded-tr-sm bg-[#6C47FF]/15 animate-pulse" />
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-black/10 animate-pulse shrink-0 mt-0.5" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3 w-full rounded bg-black/10 animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-black/10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        {/* Composer skeleton */}
        <div className="shrink-0 border-t-[2px] border-black bg-[#FFFBF0] px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="h-11 w-full rounded-xl border-[2.5px] border-black bg-white shadow-[3px_3px_0px_#000] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const { messages: initialMessages, citationsByMessage } =
    toUIMessagesWithCitations(conversationMessages ?? []);

  return (
    <ChatInner
      key={conversationId}
      workspaceId={workspaceId}
      conversationId={conversationId}
      initialMessages={initialMessages}
      initialCitationsMap={citationsByMessage}
      onOpenChats={onOpenChats}
      onOpenSources={onOpenSources}
    />
  );
}
