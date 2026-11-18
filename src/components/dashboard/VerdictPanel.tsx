'use client';

import type { AnalysisResult } from '@/lib/schemas/analysis';
import { KnockoutStatusPill } from './KnockoutStatusPill';

type VerdictPanelProps = {
  analysis: AnalysisResult;
};

const CRITERIA = [
  {
    key: 'failedKnockoutCount' as const,
    label: 'Hard knockouts failed',
    failTone: true,
  },
  {
    key: 'warningKnockoutCount' as const,
    label: 'Knockout warnings',
    failTone: false,
  },
  {
    key: 'dilutingSectionCount' as const,
    label: 'Diluting sections',
    failTone: false,
  },
  {
    key: 'missedBooleanCount' as const,
    label: 'Boolean misses',
    failTone: false,
  },
] as const;

export function VerdictPanel({ analysis }: VerdictPanelProps) {
  const { knockoutStatus, verdictBreakdown } = analysis;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Gate classification
        </p>
        <KnockoutStatusPill status={knockoutStatus} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-200">
        {verdictBreakdown.classificationRule}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CRITERIA.map((item) => {
          const value = verdictBreakdown[item.key];
          const hot = value > 0;
          const tone = !hot
            ? 'border-zinc-800 bg-zinc-950/50 text-zinc-300'
            : item.failTone
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-200';

          return (
            <div
              key={item.key}
              className={`rounded-xl border px-3 py-2 ${tone}`}
            >
              <dt className="text-[10px] uppercase tracking-wider opacity-80">
                {item.label}
              </dt>
              <dd className="mt-1 font-display text-xl font-semibold tabular-nums">
                {value}
              </dd>
            </div>
          );
        })}
      </dl>

      <ol className="mt-4 space-y-1.5 text-[11px] leading-relaxed text-zinc-500">
        <li>
          <span className="font-medium text-rose-300">LIKELY_REJECTED</span> —
          any hard knockout failed
        </li>
        <li>
          <span className="font-medium text-amber-300">AT_RISK</span> — no hard
          fails, but warnings, diluting sections, or Boolean misses
        </li>
        <li>
          <span className="font-medium text-emerald-300">PASS</span> — all
          knockouts met, no diluting sections, all Boolean queries on page 1
        </li>
      </ol>
    </div>
  );
}
