'use client';

import { useForwardWheelScroll } from '@/hooks/useForwardWheelScroll';
import type { GateMetricKey } from '@/lib/dashboardNavigation';
import type { AnalysisResult } from '@/lib/schemas/analysis';
import { AtsParsedPanel } from './AtsParsedPanel';
import { VerdictPanel } from './VerdictPanel';

type ScoreboardProps = {
  analysis: AnalysisResult;
  onGateNavigate?: (key: GateMetricKey) => void;
};

export function Scoreboard({ analysis, onGateNavigate }: ScoreboardProps) {
  const { executiveSummary } = analysis;
  const wheelRef = useForwardWheelScroll<HTMLDivElement>();

  return (
    <div ref={wheelRef} className="@container min-w-0 space-y-2">
      <div className="grid min-w-0 gap-2 @2xl:grid-cols-2 @2xl:items-stretch">
        <div className="min-w-0">
          <VerdictPanel analysis={analysis} onGateNavigate={onGateNavigate} />
        </div>

        <section className="flex min-w-0 flex-col rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Executive diagnosis
          </p>
          <p className="mt-2 line-clamp-6 break-words text-sm leading-snug text-zinc-200 @2xl:line-clamp-none @2xl:flex-1">
            {executiveSummary}
          </p>
        </section>
      </div>

      <AtsParsedPanel profile={analysis.atsParsedProfile} />
    </div>
  );
}
