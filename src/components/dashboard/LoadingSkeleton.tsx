export function LoadingSkeleton() {
  return (
    <div
      className="flex h-full flex-col gap-4 p-4 lg:p-5"
      aria-busy="true"
      aria-label="Analyzing resume"
    >
      <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
        <div className="h-36 animate-pulse rounded-2xl bg-zinc-800/80" />
        <div className="space-y-3">
          <div className="h-8 w-40 animate-pulse rounded-full bg-zinc-800/80" />
          <div className="h-20 animate-pulse rounded-xl bg-zinc-800/80" />
          <div className="h-12 animate-pulse rounded-xl bg-zinc-800/80" />
        </div>
      </div>
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-28 shrink-0 animate-pulse rounded-lg bg-zinc-800/80"
          />
        ))}
      </div>
      <div className="grid flex-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[120px] animate-pulse rounded-xl bg-zinc-800/70"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
