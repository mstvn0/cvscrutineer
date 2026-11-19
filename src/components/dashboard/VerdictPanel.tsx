'use client';

import type { GateMetricKey } from '@/lib/dashboardNavigation';
import type { AnalysisResult } from '@/lib/schemas/analysis';
import { KnockoutStatusPill } from './KnockoutStatusPill';

type VerdictPanelProps = {
  analysis: AnalysisResult;
  onGateNavigate?: (key: GateMetricKey) => void;
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

export function VerdictPanel({ analysis, onGateNavigate }: VerdictPanelProps) {
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

      <div
        className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:items-stretch"
        role="list"
        aria-label="Gate metric counts"
      >
        {CRITERIA.map((item) => {
          const value = verdictBreakdown[item.key];
          const hot = value > 0;
          const tone = !hot
            ? 'border-zinc-800 bg-zinc-950/50 text-zinc-300'
            : item.failTone
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-200';
          const className = `flex h-full min-h-[4.75rem] w-full flex-col rounded-xl border px-3 py-2.5 text-left ${tone}`;
          const body = (
            <>
              <span className="font-mono text-2xl font-semibold leading-none tracking-tight tabular-nums">
                {value.toLocaleString()}
              </span>
              <span className="mt-2 min-h-[2.25rem] text-[10px] font-medium uppercase leading-snug tracking-wider opacity-80">
                {item.label}
              </span>
            </>
          );

          return hot && onGateNavigate ? (
            <button
              key={item.key}
              type="button"
              role="listitem"
              onClick={() => onGateNavigate(item.key)}
              className={`${className} cursor-pointer transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400`}
              aria-label={`Show ${item.label.toLowerCase()} in results`}
            >
              {body}
            </button>
          ) : (
            <div key={item.key} role="listitem" className={className}>
              {body}
            </div>
          );
        })}
      </div>

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
