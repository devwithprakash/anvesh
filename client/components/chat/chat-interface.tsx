'use client';

import { useChat } from '@ai-sdk/react';
import { UIMessage, DefaultChatTransport } from 'ai';
import {
  Send,
  Sparkles,
  Globe,
  Square,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import * as React from 'react';

import { ChatPanelSkeleton } from '@/components/workspace/conversation-skeleton';
import { useMessages } from '@/features/conversation/queries';
import { useSources } from '@/features/source/queries';
import { useSubscriptionStatus } from '@/features/subscription/queries';
import { cn } from '@/lib/utils';

function FormattedText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="flex flex-col gap-1">
      {lines.map((line, i) => {
        if (line === '') return <div key={i} className="h-1" />;
        if (line.startsWith('**') && line.endsWith('**') && line.length > 4)
          return (
            <p key={i} className="font-black text-black">
              {formatInline(line.slice(2, -2))}
            </p>
          );
        if (line.startsWith('- '))
          return (
            <div key={i} className="flex gap-2 text-sm">
              <span className="mt-0.5 shrink-0 text-gray-400">•</span>
              <span>{formatInline(line.slice(2))}</span>
            </div>
          );
        if (/^\d+\.\s/.test(line))
          return (
            <div key={i} className="flex gap-2 text-sm">
              <span className="shrink-0 text-gray-400">
                {line.match(/^\d+/)?.[0]}.
              </span>
              <span>{formatInline(line.replace(/^\d+\.\s/, ''))}</span>
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

/** Parse inline markdown bold. */
function formatInline(text: string): React.ReactNode {
  // Split on bold (**...**)
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-black">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

// ─── User message ─────────────────────────────────────────────────────────────

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="flex max-w-[75%] items-end gap-2">
        <div className="rounded-xl rounded-tr-sm border-[2px] border-black bg-[#6C47FF] px-3 py-2 text-sm leading-relaxed font-semibold text-white shadow-[2px_2px_0px_#000]">
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
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('');
}

interface RawMessage {
  id: string;
  role: string;
  content: string;
}

function toUIMessages(raw: RawMessage[] = []): UIMessage[] {
  return raw.map(m => ({
    id: m.id,
    role: m.role.toLowerCase() as 'user' | 'assistant',
    parts: [{ type: 'text', text: m.content }],
  }));
}

function AIMessage({ message }: { message: UIMessage }) {
  const text = getTextContent(message);

  return (
    <div className="flex items-start gap-2">
      {/* Avatar */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-[2px] border-black bg-[#EDE9FE] shadow-[1px_1px_0px_#000]">
        <Sparkles size={12} className="text-[#6C47FF]" />
      </div>

      {/* Bubble */}
      <div className="max-w-[85%] min-w-0 flex-1">
        <div className="rounded-xl rounded-tl-sm border-[2px] border-black bg-white px-3 py-2.5 shadow-[2px_2px_0px_#000]">
          <FormattedText text={text} />
        </div>
      </div>
    </div>
  );
}

// ─── Streaming bubble ─────────────────────────────────────────────────────────

function StreamingBubble({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border-[2px] border-black bg-[#EDE9FE] shadow-[1px_1px_0px_#000]">
        <Sparkles size={12} className="animate-pulse text-[#6C47FF]" />
      </div>
      <div className="max-w-[85%] rounded-xl rounded-tl-sm border-[2px] border-black bg-white px-3 py-2.5 text-sm leading-relaxed text-gray-700 shadow-[2px_2px_0px_#000]">
        {text ? (
          <>
            <FormattedText text={text} />
            <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-[#6C47FF] align-text-bottom" />
          </>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
            <span className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
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
    'Summarise all my sources',
    'What are the key takeaways?',
    'Compare and contrast the main ideas',
    'What questions should I explore next?',
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
      {/* Icon */}
      <div className="flex size-12 items-center justify-center rounded-2xl border-[3px] border-black bg-[#EDE9FE] shadow-[3px_3px_0px_#000]">
        <Sparkles size={22} className="text-[#6C47FF]" />
      </div>
      <div>
        <h3 className="text-lg font-black text-black">Ask anything</h3>
        <p className="mt-0.5 text-xs font-semibold text-gray-500">
          Chat with your sources using AI
        </p>
      </div>

      {/* Suggestions */}
      <div className="grid w-full max-w-sm grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="rounded-lg border-[2px] border-black bg-white px-3 py-2.5 text-left text-xs font-bold text-black shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
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
}

function ChatInner({
  workspaceId,
  conversationId,
  initialMessages,
  onOpenChats,
  onOpenSources,
}: ChatInnerProps) {
  const [input, setInput] = useState('');
  const [webSearch, setWebSearch] = useState(false);
  const [newConversationId, setNewConversationId] = useState<string | null>(
    null,
  );

  const router = useRouter();

  const { data: sources } = useSources(workspaceId);
  const { data: subStatus } = useSubscriptionStatus();

  const webSearchAllowed = subStatus?.plan?.webSearchEnabled ?? false;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: `${API_BASE_URL}/workspaces/${workspaceId}/chat`,
        credentials: 'include',
        body: {
          conversationId,
          webSearch,
        },
        fetch: async (input, init) => {
          const response = await fetch(input, init);

          if (!conversationId) {
            const id = response.headers.get('X-Conversation-Id');

            if (id) {
              setNewConversationId(id);
            }
          }

          return response;
        },
      }),
    [workspaceId, conversationId, webSearch],
  );

  const { messages, sendMessage, status, stop, error } = useChat({
    id: conversationId ?? 'new',
    messages: initialMessages,
    transport,
  });

  useEffect(() => {
    if (!conversationId && newConversationId) {
      router.replace(`/workspace/${workspaceId}/${newConversationId}`);
    }
  }, [conversationId, newConversationId, workspaceId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || status === 'streaming' || status === 'submitted') {
      return;
    }

    sendMessage({ text: input });
    setInput('');
  };

  const isStreaming = status === 'streaming' || status === 'submitted';

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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  // While streaming the last assistant message arrives token-by-token —
  // show it in StreamingBubble so the cursor blink animation works.
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const streamingMessage =
    isStreaming && lastMsg?.role === 'assistant' ? lastMsg : null;

  const staticMessages = streamingMessage ? messages.slice(0, -1) : messages;

  const streamingText = streamingMessage
    ? getTextContent(streamingMessage)
    : '';

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#FFFBF0]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b-[2px] border-black bg-[#FFFBF0] px-3 py-4 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          {onOpenChats && (
            <button
              onClick={onOpenChats}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none md:hidden"
              aria-label="Open chats"
            >
              <MessageSquare size={13} />
            </button>
          )}
          <Sparkles
            size={13}
            className="hidden shrink-0 text-[#6C47FF] sm:block"
          />
          <span className="truncate text-sm font-black text-black">
            {'Conversation'}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {onOpenSources && (
            <button
              onClick={onOpenSources}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none md:hidden"
              aria-label="Open sources"
            >
              <BookOpen size={13} />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {staticMessages.length === 0 && !isStreaming ? (
          <EmptyChat
            onSuggestion={q => {
              setInput(q);
              textareaRef.current?.focus();
            }}
          />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3.5 px-3 py-5 sm:px-5">
            {staticMessages.map((msg: UIMessage) =>
              msg.role === 'user' ? (
                <UserMessage
                  key={msg.id}
                  content={msg.parts
                    .filter(part => part.type === 'text')
                    .map(part => part.text)
                    .join('')}
                />
              ) : (
                <AIMessage key={msg.id} message={msg} />
              ),
            )}
            {isStreaming && <StreamingBubble text={streamingText} />}
            {error && (
              <div className="py-2 text-center text-xs font-semibold text-red-500">
                Error:{' '}
                {error.message ?? 'Something went wrong. Please try again.'}
              </div>
            )}
            <div />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t-[2px] border-black bg-[#FFFBF0] px-3 py-3 sm:px-4">
        {sources?.filter(s => s.status === 'READY').length === 0 && (
          <div className="mb-2.5 flex items-center gap-2 rounded-lg border-[2px] border-amber-500 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
            ⚠️ No ready sources — add sources for grounded answers.
          </div>
        )}

        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 rounded-xl border-[2.5px] border-black bg-white px-3 py-2 shadow-[3px_3px_0px_#000] transition-all focus-within:translate-x-[3px] focus-within:translate-y-[3px] focus-within:shadow-none"
          >
            <button
              type="button"
              onClick={() => webSearchAllowed && setWebSearch(v => !v)}
              disabled={!webSearchAllowed}
              title={
                !webSearchAllowed
                  ? 'Upgrade to Pro to use Web Search'
                  : webSearch
                    ? 'Disable web search'
                    : 'Enable web search'
              }
              className={cn(
                'mb-0.5 flex shrink-0 items-center gap-1.5 rounded-lg border-[1.5px] border-black px-2.5 py-1 text-[11px] font-black shadow-[1.5px_1.5px_0px_#000] transition-all',
                !webSearchAllowed
                  ? 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400 shadow-none'
                  : webSearch
                    ? 'bg-[#6C47FF] text-white'
                    : 'bg-[#FFFBF0] text-black hover:bg-gray-100',
              )}
            >
              <Globe size={12} />
              <span className="hidden sm:inline">Web</span>
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isStreaming}
              placeholder="Ask anything about your sources…"
              rows={1}
              className="max-h-32 min-h-0 flex-1 resize-none bg-transparent py-0.5 text-sm font-semibold text-black outline-none placeholder:text-gray-400"
              style={{ fieldSizing: 'content' } as React.CSSProperties}
            />
            <button
              type={isStreaming ? 'button' : 'submit'}
              onClick={isStreaming ? stop : undefined}
              disabled={!isStreaming && !input.trim()}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-black bg-[#6C47FF] text-white shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:pointer-events-none disabled:opacity-40"
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
  conversationId?: string;
  onOpenChats?: () => void;
  onOpenSources?: () => void;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

export function ChatInterface({
  workspaceId,
  conversationId,
  onOpenChats,
  onOpenSources,
}: ChatInterfaceProps) {
  const {
    data: conversationMessages,
    isPending,
    fetchStatus,
  } = useMessages({
    workspaceId,
    conversationId,
  });

  const initialMessages = toUIMessages(conversationMessages ?? []);

  // isPending is true even for disabled queries in TanStack Query v5.
  // Only show the skeleton when the query is actually running (fetchStatus === "fetching").
  if (isPending && fetchStatus === 'fetching') {
    return <ChatPanelSkeleton />;
  }

  return (
    <ChatInner
      key={conversationId}
      workspaceId={workspaceId}
      conversationId={conversationId}
      initialMessages={initialMessages}
      onOpenChats={onOpenChats}
      onOpenSources={onOpenSources}
    />
  );
}
