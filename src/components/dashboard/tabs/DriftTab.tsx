'use client';

import { CollapsedNoiseSection } from '@/components/dashboard/CollapsedNoiseSection';
import { FixItTip } from '@/components/dashboard/FixItTip';
import type { DriftFocus } from '@/lib/dashboardNavigation';
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
    label: 'Reword / remove',
  },
};

export function DriftTab({
  rows,
  focus = 'all',
}: {
  rows: AnalysisResult['semanticDriftAudit'];
  focus?: DriftFocus;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-zinc-500">No sections audited.</p>;
  }

  const diluting = rows.filter(
    (row) => row.driftDiagnosis === 'Diluting Vector',
  );
  const neutral = rows.filter((row) => row.driftDiagnosis === 'Neutral');
  const highSignal = rows.filter(
    (row) => row.driftDiagnosis === 'High Signal',
  );

  const priority = focus === 'diluting' ? diluting : [...diluting, ...neutral];
  const showHighSignal = focus === 'all';

  if (priority.length === 0 && !(showHighSignal && highSignal.length > 0)) {
    return (
      <p className="text-sm text-zinc-500">No drift rows match this filter.</p>
    );
  }

  return (
    <div className="min-w-0 space-y-3">
      <ul className="min-w-0 space-y-3">
        {priority.map((row, index) => (
          <DriftRow
            key={`${row.resumeSectionOrRole}-${index}`}
            row={row}
            index={index}
          />
        ))}
      </ul>
      {showHighSignal ? (
        <CollapsedNoiseSection
          label="High Signal sections"
          count={highSignal.length}
        >
          <ul className="min-w-0 space-y-3">
            {highSignal.map((row, index) => (
              <DriftRow
                key={`${row.resumeSectionOrRole}-hs-${index}`}
                row={row}
                index={index + 1000}
              />
            ))}
          </ul>
        </CollapsedNoiseSection>
      ) : null}
    </div>
  );
}

function DriftRow({ row, index }: { row: Row; index: number }) {
  const styles = DIAGNOSIS_STYLES[row.driftDiagnosis];
  const tip = row.fixItSuggestion;
  const showFixIt =
    row.driftDiagnosis === 'Diluting Vector' &&
    tip !== null &&
    tip.advice.trim().length > 0;

  return (
    <li className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="min-w-0 flex-1 break-words text-sm font-semibold text-zinc-100">
          {row.resumeSectionOrRole}
        </p>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles.badge}`}
        >
          {row.driftDiagnosis}
        </span>
      </div>
      <div className="mt-3 min-w-0">
        <div className="mb-1 flex justify-between gap-2 text-[11px] text-zinc-500">
          <span className="shrink-0">Signal band</span>
          <span className="min-w-0 truncate text-right">{styles.label}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full ${styles.fill} ${styles.width}`}
          />
        </div>
      </div>
      <p className="mt-3 break-words text-sm leading-relaxed text-zinc-400">
        {row.actionAdvice}
      </p>
      {showFixIt && tip ? (
        <FixItTip
          advice={tip.advice}
          draftText={tip.draftText}
          copyKey={`drift-${index}`}
        />
      ) : null}
    </li>
  );
}
