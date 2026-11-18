'use client';

import { Crosshair, SearchCode, Waves } from 'lucide-react';

type EmptyStateProps = {
  onLoadAndScrutinize: () => void;
  disabled?: boolean;
};

const CARDS = [
  {
    step: '1',
    title: 'Hidden Dealbreakers',
    body: 'Surface JD knockout rules that auto-reject before a human ever opens your file.',
    icon: Crosshair,
    accent: 'text-rose-300 bg-rose-500/10 ring-rose-500/25',
  },
  {
    step: '2',
    title: 'Vector Drift Audit',
    body: 'See which resume sections dilute semantic relevance against the target role.',
    icon: Waves,
    accent: 'text-amber-300 bg-amber-500/10 ring-amber-500/25',
  },
  {
    step: '3',
    title: 'Recruiter Search Test',
    body: 'Simulate Boolean queries recruiters actually type—and copy the missing terms.',
    icon: SearchCode,
    accent: 'text-emerald-300 bg-emerald-500/10 ring-emerald-500/25',
  },
] as const;

export function EmptyState({ onLoadAndScrutinize, disabled }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-6 text-center">
      <div className="max-w-lg space-y-2">
        <p className="font-display text-2xl font-semibold tracking-tight text-zinc-50">
          Forensic ATS dashboard
        </p>
        <p className="text-sm leading-relaxed text-zinc-400">
          Load a sample trap resume or paste your own to reveal knockouts, drift,
          and recruiter Boolean gaps.
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.step}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-left"
            >
              <div
                className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${card.accent}`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Step {card.step}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-zinc-100">
                {card.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                {card.body}
              </p>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onLoadAndScrutinize}
        disabled={disabled}
        className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
      >
        Load Sample & Scrutinize
      </button>
    </div>
  );
}
