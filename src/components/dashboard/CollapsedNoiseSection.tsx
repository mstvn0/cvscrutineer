'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type CollapsedNoiseSectionProps = {
  label: string;
  count: number;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function CollapsedNoiseSection({
  label,
  count,
  children,
  defaultOpen = false,
}: CollapsedNoiseSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (count === 0) return null;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-xs font-medium text-zinc-400 transition hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
      >
        <span className="inline-flex items-center gap-1.5">
          {open ? (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          )}
          {label}
        </span>
        <span className="font-mono tabular-nums text-zinc-500">{count}</span>
      </button>
      {open ? <div className="space-y-3 border-t border-zinc-800/80 p-3">{children}</div> : null}
    </div>
  );
}
