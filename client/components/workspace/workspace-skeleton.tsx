'use client';

/**
 * Skeleton for /workspace/[workspaceId] — shown while the auth session is resolving.
 * Mirrors the real WorkspacePageInner layout: navbar + 3-panel (sidebar | center | sidebar).
 */
export function WorkspaceSkeleton() {
  return (
    <div className="flex flex-col bg-[#FFFBF0]" style={{ height: '100svh' }}>
      {/* ── Navbar skeleton ── */}
      <nav className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-[#FFFBF0]">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          <div className="h-7 w-28 animate-pulse rounded-lg bg-black/10" />
          <div className="h-8 w-32 animate-pulse rounded-lg bg-black/10" />
        </div>
      </nav>

      {/* ── Three-panel body ── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="hidden h-full w-[260px] shrink-0 flex-col gap-3 border-r-[3px] border-black bg-white p-4 md:flex">
          {/* Sidebar header */}
          <div className="h-8 w-full animate-pulse rounded-xl bg-black/10" />
          {/* Conversation items */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-full animate-pulse rounded-xl bg-black/10"
              style={{ opacity: 1 - i * 0.1 }}
            />
          ))}
        </div>

        {/* Center panel */}
        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-auto p-4 sm:p-8">
          {/* Dot-grid background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Workspace title card */}
          <div className="relative w-full max-w-md rounded-2xl border-[3px] border-black bg-white p-6 shadow-[5px_5px_0px_#000]">
            <div className="h-7 w-48 animate-pulse rounded-xl bg-black/10" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-lg bg-black/10" />
            <div className="mt-1.5 h-4 w-3/4 animate-pulse rounded-lg bg-black/10" />
            {/* Stats grid */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="h-16 animate-pulse rounded-xl bg-black/10" />
              <div className="h-16 animate-pulse rounded-xl bg-black/10" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="relative flex w-full max-w-md flex-col gap-2.5">
            <div className="h-11 w-full animate-pulse rounded-xl bg-black/10" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-black/10" />
          </div>

          {/* Recent chats */}
          <div className="relative w-full max-w-md">
            <div className="mb-2 h-4 w-16 animate-pulse rounded bg-black/10" />
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-full animate-pulse rounded-xl bg-black/10"
                  style={{ opacity: 1 - i * 0.15 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden h-full w-[260px] shrink-0 flex-col gap-3 border-l-[3px] border-black bg-white p-4 md:flex">
          {/* Sidebar header */}
          <div className="h-8 w-full animate-pulse rounded-xl bg-black/10" />
          {/* Upload button */}
          <div className="h-10 w-full animate-pulse rounded-xl bg-black/10" />
          {/* Source items */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-14 w-full animate-pulse rounded-xl bg-black/10"
              style={{ opacity: 1 - i * 0.12 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
