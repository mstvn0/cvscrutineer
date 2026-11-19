'use client';

import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { FixItTip } from '@/components/dashboard/FixItTip';
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

export function KnockoutTab({ rules }: { rules: AnalysisResult['knockoutRules'] }) {
  if (rules.length === 0) {
    return <p className="text-sm text-zinc-500">No knockout rules extracted.</p>;
  }

  return (
    <ul className="space-y-3">
      {rules.map((rule, index) => {
        const ui = STATUS_UI[rule.status];
        const Icon = ui.icon;
        const showFixIt =
          rule.status === 'failed' &&
          rule.fixItSuggestion !== null &&
          rule.fixItSuggestion.trim().length > 0;

        return (
          <li
            key={`${rule.rule}-${index}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="inline-flex rounded-md border border-zinc-700 bg-zinc-950 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  {rule.category}
                </span>
                <p className="mt-2 text-sm font-semibold text-zinc-100">
                  {rule.rule}
                </p>
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
      })}
    </ul>
  );
}
