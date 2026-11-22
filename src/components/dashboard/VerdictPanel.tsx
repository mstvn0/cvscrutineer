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
    label: 'Hard fails',
    failTone: true,
  },
  {
    key: 'warningKnockoutCount' as const,
    label: 'Warnings',
    failTone: false,
  },
  {
    key: 'dilutingSectionCount' as const,
    label: 'Diluting',
    failTone: false,
  },
  {
    key: 'missedBooleanCount' as const,
    label: 'Boolean misses',
    failTone: false,
  },
] as const;

/** Compact blurbs for the gate legend. */
const GATE_LEGEND = [
  {
    status: 'LIKELY_REJECTED',
    tone: 'text-rose-300',
    body: 'Hard knockout failed — auto-reject before review',
  },
  {
    status: 'AT_RISK',
    tone: 'text-amber-300',
    body: 'Warnings, diluting sections, or Boolean misses',
  },
  {
    status: 'PASS',
    tone: 'text-emerald-300',
    body: 'All knockouts met (no warnings); no diluting; Boolean queries matched',
  },
] as const;

export function VerdictPanel({ analysis, onGateNavigate }: VerdictPanelProps) {
  const { knockoutStatus, verdictBreakdown } = analysis;

  return (
    <div className="@container flex h-full min-w-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          Gate classification
        </p>
        <div className="max-w-full min-w-0">
          <KnockoutStatusPill status={knockoutStatus} />
        </div>
      </div>

      <p className="mt-2 line-clamp-3 break-words text-sm leading-snug text-zinc-200">
        {verdictBreakdown.classificationRule}
      </p>

      <div
        className="mt-2.5 grid grid-cols-2 gap-1.5 @min-[22rem]:grid-cols-4"
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
          const className = `flex min-w-0 flex-col rounded-lg border px-2 py-1.5 text-left ${tone}`;
          const body = (
            <>
              <span className="font-mono text-lg font-semibold leading-none tracking-tight tabular-nums">
                {value.toLocaleString()}
              </span>
              <span className="mt-1 break-words text-[9px] font-medium uppercase leading-snug tracking-wider opacity-80">
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
              title={`Jump to ${item.label.toLowerCase()} in results`}
              className={`${className} cursor-pointer ring-inset transition hover:brightness-110 hover:ring-1 hover:ring-current/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400`}
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

      <ul
        className="mt-2.5 grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1.5 text-[10px] leading-snug"
        aria-label="How gate status is decided"
      >
        {GATE_LEGEND.map((item) => (
          <li key={item.status} className="contents">
            <span className={`font-medium tracking-wide ${item.tone}`}>
              {item.status}
            </span>
            <span className="break-words text-zinc-500">{item.body}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
