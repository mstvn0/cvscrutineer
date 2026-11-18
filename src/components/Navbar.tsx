'use client';

import { ScanSearch } from 'lucide-react';

export function Navbar() {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-start gap-3 px-4 py-4 sm:px-6">
        <div
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
          aria-hidden
        >
          <ScanSearch className="h-5 w-5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            CVScrutineer
          </h1>
          <p className="mt-0.5 text-sm leading-snug text-zinc-400">
            See why the resume robot rejected you—and fix it.
          </p>
        </div>
      </div>
    </header>
  );
}
