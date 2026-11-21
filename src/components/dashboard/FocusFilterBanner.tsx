'use client';

import { X } from 'lucide-react';

type FocusFilterBannerProps = {
  label: string;
  onClear: () => void;
};

export function FocusFilterBanner({ label, onClear }: FocusFilterBannerProps) {
  return (
    <div className="mb-3 flex min-w-0 items-center justify-between gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/80 px-3 py-2">
      <p className="min-w-0 break-words text-xs font-medium text-zinc-300">
        {label}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        aria-label="Clear results filter"
      >
        <X className="h-3 w-3" aria-hidden />
        Clear
      </button>
    </div>
  );
}
