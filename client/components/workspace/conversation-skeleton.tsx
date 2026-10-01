'use client';

export function ChatPanelSkeleton() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#FFFBF0]">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b-[2px] border-black bg-[#FFFBF0] px-3 py-4 sm:px-4">
        <div className="h-4 w-36 animate-pulse rounded-lg bg-black/10" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-black/10" />
      </div>

      {/* Messages area */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {/* User bubble */}
          <div className="flex justify-end">
            <div className="h-10 w-52 animate-pulse rounded-xl rounded-tr-sm bg-[#6C47FF]/15" />
          </div>
          {/* AI bubble */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-7 w-7 shrink-0 animate-pulse rounded-full bg-black/10" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3 w-full animate-pulse rounded bg-black/10" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-black/10" />
              <div className="h-3 w-3/5 animate-pulse rounded bg-black/10" />
            </div>
          </div>
          {/* User bubble */}
          <div className="flex justify-end">
            <div className="h-8 w-40 animate-pulse rounded-xl rounded-tr-sm bg-[#6C47FF]/15" />
          </div>
          {/* AI bubble */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-7 w-7 shrink-0 animate-pulse rounded-full bg-black/10" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3 w-full animate-pulse rounded bg-black/10" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-black/10" />
            </div>
          </div>
          {/* User bubble */}
          <div className="flex justify-end">
            <div className="h-10 w-60 animate-pulse rounded-xl rounded-tr-sm bg-[#6C47FF]/15" />
          </div>
          {/* AI bubble — last, "typing" */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-7 w-7 shrink-0 animate-pulse rounded-full bg-black/10" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-black/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Composer bar */}
      <div className="shrink-0 border-t-[2px] border-black bg-[#FFFBF0] px-3 py-3 sm:px-4">
        <div className="mx-auto max-w-3xl">
          <div className="h-11 w-full animate-pulse rounded-xl border-[2.5px] border-black bg-white shadow-[3px_3px_0px_#000]" />
          <div className="mx-auto mt-1.5 h-3 w-48 animate-pulse rounded bg-black/10" />
        </div>
      </div>
    </div>
  );
}

export function ConversationSkeleton() {
  return (
    <div className="flex flex-col" style={{ height: '100svh' }}>
      {/* Navbar skeleton */}
      <nav className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-[#FFFBF0]">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          <div className="h-7 w-28 animate-pulse rounded-lg bg-black/10" />
          <div className="h-8 w-32 animate-pulse rounded-lg bg-black/10" />
        </div>
      </nav>

      {/* Three-panel body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left sidebar — conversation list */}
        <div className="hidden h-full w-[260px] shrink-0 flex-col border-r-[3px] border-black bg-[#FFFBF0] md:flex">
          {/* Header */}
          <div className="flex items-center justify-between border-b-[2px] border-black px-4 py-3">
            <div className="h-4 w-12 animate-pulse rounded bg-black/10" />
            <div className="h-7 w-7 animate-pulse rounded-lg bg-black/10" />
          </div>
          {/* New chat button */}
          <div className="px-3 pt-3 pb-2">
            <div className="h-9 w-full animate-pulse rounded-xl bg-black/10" />
          </div>
          {/* Conversation items */}
          <div className="flex flex-1 flex-col gap-1 overflow-hidden px-2 py-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-xl bg-black/10"
                style={{ opacity: 1 - i * 0.1 }}
              />
            ))}
          </div>
        </div>

        {/* Center — shared ChatPanelSkeleton */}
        <ChatPanelSkeleton />

        {/* Right sidebar — sources panel */}
        <div className="hidden h-full w-[260px] shrink-0 flex-col border-l-[3px] border-black bg-[#FFFBF0] p-4 md:flex">
          <div className="h-8 w-full animate-pulse rounded-xl bg-black/10" />
          <div className="mt-3 h-10 w-full animate-pulse rounded-xl bg-black/10" />
          <div className="mt-3 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 w-full animate-pulse rounded-xl bg-black/10"
                style={{ opacity: 1 - i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
