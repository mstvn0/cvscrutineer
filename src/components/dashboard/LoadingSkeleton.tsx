export function LoadingSkeleton() {
  return (
    <div
      className="@container flex h-full min-h-0 min-w-0 flex-col gap-4 overflow-hidden p-4 lg:p-5"
      aria-busy="true"
      aria-label="Analyzing resume"
    >
      <div className="grid min-w-0 gap-3 @md:grid-cols-[minmax(0,140px)_minmax(0,1fr)]">
        <div className="h-36 animate-pulse rounded-2xl bg-zinc-800/80" />
        <div className="min-w-0 space-y-3">
          <div className="h-8 w-40 max-w-full animate-pulse rounded-full bg-zinc-800/80" />
          <div className="h-20 animate-pulse rounded-xl bg-zinc-800/80" />
          <div className="h-12 animate-pulse rounded-xl bg-zinc-800/80" />
        </div>
      </div>
      <div className="flex min-w-0 gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-28 shrink-0 animate-pulse rounded-lg bg-zinc-800/80"
          />
        ))}
      </div>
      <div className="grid min-h-0 min-w-0 flex-1 gap-3 @md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[120px] min-w-0 animate-pulse rounded-xl bg-zinc-800/70"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
