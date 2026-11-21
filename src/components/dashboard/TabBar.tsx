'use client';

import type { KeyboardEvent } from 'react';
import { DASHBOARD_TABS, type DashboardTabId } from '@/lib/constants';
import { tabSeverity } from '@/lib/dashboardNavigation';
import type { AnalysisResult } from '@/lib/schemas/analysis';

type TabBarProps = {
  active: DashboardTabId;
  onChange: (id: DashboardTabId) => void;
  analysis: AnalysisResult;
};

export function TabBar({ active, onChange, analysis }: TabBarProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = DASHBOARD_TABS.findIndex((tab) => tab.id === active);
    if (index < 0) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = DASHBOARD_TABS[(index + 1) % DASHBOARD_TABS.length];
      if (next) onChange(next.id);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const prev =
        DASHBOARD_TABS[
          (index - 1 + DASHBOARD_TABS.length) % DASHBOARD_TABS.length
        ];
      if (prev) onChange(prev.id);
    }
  }

  return (
    <div
      className="flex min-w-0 gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin]"
      role="tablist"
      aria-label="Analysis sections"
      onKeyDown={handleKeyDown}
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
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:text-sm ${
              selected
                ? 'bg-zinc-100 text-zinc-950 shadow-sm ring-1 ring-zinc-300'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <span className="whitespace-nowrap">{tab.label}</span>
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
        className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums transition ${
          selected
            ? 'bg-emerald-500 text-zinc-950 ring-1 ring-emerald-300'
            : 'bg-zinc-800 text-zinc-400'
        }`}
      >
        {total}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      {failed > 0 ? (
        <span
          className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums transition ${
            selected
              ? 'bg-rose-500 text-white ring-1 ring-rose-200'
              : 'bg-rose-500/20 text-rose-300'
          }`}
        >
          {failed}
        </span>
      ) : null}
      {warning > 0 ? (
        <span
          className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums transition ${
            selected
              ? 'bg-amber-400 text-zinc-950 ring-1 ring-amber-200'
              : 'bg-amber-500/20 text-amber-300'
          }`}
        >
          {warning}
        </span>
      ) : null}
    </span>
  );
}
