'use client';

import { DASHBOARD_TABS, type DashboardTabId } from '@/lib/constants';
import { tabSeverity } from '@/lib/dashboardNavigation';
import type { AnalysisResult } from '@/lib/schemas/analysis';

type TabBarProps = {
  active: DashboardTabId;
  onChange: (id: DashboardTabId) => void;
  analysis: AnalysisResult;
};

export function TabBar({ active, onChange, analysis }: TabBarProps) {
  return (
    <div
      className="flex gap-1 overflow-x-auto pb-1"
      role="tablist"
      aria-label="Analysis sections"
    >
      {DASHBOARD_TABS.map((tab) => {
        const severity = tabSeverity(tab.id, analysis);
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:text-sm ${
              selected
                ? 'bg-zinc-100 text-zinc-950'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {tab.label}
            <SeverityBadges severity={severity} selected={selected} />
          </button>
        );
      })}
    </div>
  );
}

function SeverityBadges({
  severity,
  selected,
}: {
  severity: ReturnType<typeof tabSeverity>;
  selected: boolean;
}) {
  const { failed, warning, total } = severity;
  if (failed === 0 && warning === 0) {
    return (
      <span
        className={`font-mono text-[11px] tabular-nums ${selected ? 'text-zinc-600' : 'text-zinc-500'}`}
      >
        {total}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      {failed > 0 ? (
        <span className="rounded-md bg-rose-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-rose-300">
          {failed}
        </span>
      ) : null}
      {warning > 0 ? (
        <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-amber-300">
          {warning}
        </span>
      ) : null}
    </span>
  );
}
