'use client';

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { CollapsedNoiseSection } from '@/components/dashboard/CollapsedNoiseSection';
import { FixItTip } from '@/components/dashboard/FixItTip';
import type { KnockoutFocus } from '@/lib/dashboardNavigation';
import type { AnalysisResult } from '@/lib/schemas/analysis';

type Rule = AnalysisResult['knockoutRules'][number];

const STATUS_UI: Record<
  Rule['status'],
  { icon: typeof CheckCircle2; className: string; label: string }
> = {
  met: {
    icon: CheckCircle2,
    className: 'text-emerald-400',
    label: 'Met',
  },
  warning: {
    icon: AlertTriangle,
    className: 'text-amber-400',
    label: 'Warning',
  },
  failed: {
    icon: XCircle,
    className: 'text-rose-400',
    label: 'Failed',
  },
};

export function KnockoutTab({
  rules,
  focus = 'all',
}: {
  rules: AnalysisResult['knockoutRules'];
  focus?: KnockoutFocus;
}) {
  if (rules.length === 0) {
    return <p className="text-sm text-zinc-500">No knockout rules extracted.</p>;
  }

  const failed = rules.filter((rule) => rule.status === 'failed');
  const warnings = rules.filter((rule) => rule.status === 'warning');
  const met = rules.filter((rule) => rule.status === 'met');

  const visibleFailed = focus === 'warning' ? [] : failed;
  const visibleWarnings = focus === 'failed' ? [] : warnings;
  const showMet = focus === 'all';

  if (
    visibleFailed.length === 0 &&
    visibleWarnings.length === 0 &&
    !(showMet && met.length > 0)
  ) {
    return (
      <p className="text-sm text-zinc-500">
        No knockout rules match this filter.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {[...visibleFailed, ...visibleWarnings].map((rule, index) => (
          <KnockoutRow
            key={`${rule.rule}-${rule.status}-${index}`}
            rule={rule}
            index={index}
          />
        ))}
      </ul>
      {showMet ? (
        <CollapsedNoiseSection label="Met knockouts" count={met.length}>
          <ul className="space-y-3">
            {met.map((rule, index) => (
              <KnockoutRow
                key={`${rule.rule}-met-${index}`}
                rule={rule}
                index={index + 1000}
              />
            ))}
          </ul>
        </CollapsedNoiseSection>
      ) : null}
    </div>
  );
}

function KnockoutRow({ rule, index }: { rule: Rule; index: number }) {
  const ui = STATUS_UI[rule.status];
  const Icon = ui.icon;
  const showFixIt =
    rule.status === 'failed' &&
    rule.fixItSuggestion !== null &&
    rule.fixItSuggestion.trim().length > 0;

  return (
    <li className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-md border border-zinc-700 bg-zinc-950 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            {rule.category}
          </span>
          <p className="mt-2 text-sm font-semibold text-zinc-100">{rule.rule}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold ${ui.className}`}
        >
          <Icon className="h-4 w-4" aria-hidden />
          {ui.label}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {rule.evidenceOrGap}
      </p>
      {showFixIt && rule.fixItSuggestion ? (
        <FixItTip
          suggestion={rule.fixItSuggestion}
          copyKey={`knockout-${index}`}
        />
      ) : null}
    </li>
  );
}
