'use client';

/**
 * Skeleton for /dashboard — shown while the auth session is resolving.
 * Mirrors the real DashboardPage layout: navbar + header + plan banner +
 * search row + a 3-column grid of workspace card skeletons.
 */
export function DashboardSkeleton() {
  return (
    <div className="flex min-h-svh flex-1 flex-col bg-[#FFFBF0]">
      {/* Dot-grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Navbar skeleton ── */}
      <nav className="sticky top-0 z-50 w-full border-b-[3px] border-black bg-[#FFFBF0]">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          {/* Logo */}
          <div className="h-7 w-28 animate-pulse rounded-lg bg-black/10" />
          {/* User button */}
          <div className="h-8 w-32 animate-pulse rounded-lg bg-black/10" />
        </div>
      </nav>

      {/* ── Page content ── */}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            {/* Badge */}
            <div className="h-5 w-32 animate-pulse rounded-full bg-black/10" />
            {/* Title */}
            <div className="h-9 w-52 animate-pulse rounded-xl bg-black/10" />
            {/* Subtitle */}
            <div className="h-4 w-72 animate-pulse rounded-lg bg-black/10" />
          </div>
          {/* Count badge */}
          <div className="h-9 w-24 animate-pulse rounded-xl bg-black/10" />
        </div>

        {/* Plan banner skeleton */}
        <div className="mb-6 h-14 w-full animate-pulse rounded-2xl bg-black/10" />

        {/* Search + button row */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 max-w-sm flex-1 animate-pulse rounded-xl bg-black/10" />
          <div className="h-10 w-36 animate-pulse rounded-xl bg-black/10" />
        </div>

        {/* Workspace card grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* "New workspace" dashed card */}
          <div className="min-h-[180px] animate-pulse rounded-2xl border-[2.5px] border-dashed border-black/20 bg-white/50" />

          {/* Workspace card skeletons */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex h-full flex-col gap-4 rounded-2xl border-[2.5px] border-black bg-white p-5 shadow-[4px_4px_0px_#000]"
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <div className="h-5 w-32 animate-pulse rounded-lg bg-black/10" />
                  <div className="h-3 w-20 animate-pulse rounded bg-black/10" />
                </div>
                <div className="size-7 animate-pulse rounded-lg bg-black/10" />
              </div>
              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <div className="h-3 w-full animate-pulse rounded bg-black/10" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-black/10" />
              </div>
              {/* Stats */}
              <div className="flex items-center gap-4 border-t-[2px] border-black/10 pt-3">
                <div className="h-4 w-16 animate-pulse rounded bg-black/10" />
                <div className="h-4 w-12 animate-pulse rounded bg-black/10" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
