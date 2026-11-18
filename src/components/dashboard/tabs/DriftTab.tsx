'use client';

import type { AnalysisResult } from '@/lib/schemas/analysis';

type Row = AnalysisResult['semanticDriftAudit'][number];

const DIAGNOSIS_STYLES: Record<
  Row['driftDiagnosis'],
  { fill: string; badge: string; width: string; label: string }
> = {
  'High Signal': {
    fill: 'bg-emerald-500',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    width: 'w-full',
    label: 'Keep / expand',
  },
  Neutral: {
    fill: 'bg-slate-400',
    badge: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    width: 'w-1/2',
    label: 'Keep concise',
  },
  'Diluting Vector': {
    fill: 'bg-rose-500',
    badge: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    width: 'w-1/6',
    label: 'Compress / delete',
  },
};

export function DriftTab({
  rows,
}: {
  rows: AnalysisResult['semanticDriftAudit'];
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-zinc-500">No sections audited.</p>;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row, index) => {
        const styles = DIAGNOSIS_STYLES[row.driftDiagnosis];
        return (
          <li
            key={`${row.resumeSectionOrRole}-${index}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-100">
                {row.resumeSectionOrRole}
              </p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles.badge}`}
              >
                {row.driftDiagnosis}
              </span>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[11px] text-zinc-500">
                <span>Signal band</span>
                <span>{styles.label}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full rounded-full ${styles.fill} ${styles.width}`}
                />
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {row.actionAdvice}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
