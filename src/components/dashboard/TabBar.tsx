'use client';

import { DASHBOARD_TABS, type DashboardTabId } from '@/lib/constants';
import type { AnalysisResult } from '@/lib/schemas/analysis';

type TabBarProps = {
  active: DashboardTabId;
  onChange: (id: DashboardTabId) => void;
  analysis: AnalysisResult;
};

function countFor(id: DashboardTabId, analysis: AnalysisResult): number {
  switch (id) {
    case 'knockouts':
      return analysis.knockoutRules.length;
    case 'drift':
      return analysis.semanticDriftAudit.length;
    case 'recruiter':
      return analysis.recruiterSearchQueries.length;
  }
}

export function TabBar({ active, onChange, analysis }: TabBarProps) {
  return (
    <div
      className="flex gap-1 overflow-x-auto pb-1"
      role="tablist"
      aria-label="Analysis sections"
    >
      {DASHBOARD_TABS.map((tab) => {
        const count = countFor(tab.id, analysis);
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:text-sm ${
              selected
                ? 'bg-zinc-100 text-zinc-950'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 tabular-nums ${selected ? 'text-zinc-600' : 'text-zinc-500'}`}
            >
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
}
