'use client';

import { useState } from 'react';
import { Check, Copy, FilterX, ListChecks } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';
import type { RecruiterFocus } from '@/lib/dashboardNavigation';
import type { AnalysisResult } from '@/lib/schemas/analysis';

export function RecruiterTab({
  queries,
  focus = 'all',
}: {
  queries: AnalysisResult['recruiterSearchQueries'];
  focus?: RecruiterFocus;
}) {
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  if (queries.length === 0) {
    return (
      <p className="text-sm text-zinc-500">No recruiter queries simulated.</p>
    );
  }

  const visible =
    focus === 'misses'
      ? queries.filter((query) => !query.wouldAppearOnPage1)
      : queries;

  if (visible.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No Boolean misses match this filter.
      </p>
    );
  }

  return (
    <ul className="min-w-0 space-y-3">
      {visible.map((query, index) => {
        const onPage1 = query.wouldAppearOnPage1;
        return (
          <li
            key={`${query.booleanQuery}-${index}`}
            className="min-w-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#0c0f14]"
          >
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                boolean@{index + 1}
              </span>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  onPage1
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'bg-rose-500/15 text-rose-300'
                }`}
              >
                {onPage1 ? (
                  <ListChecks className="h-3 w-3" aria-hidden />
                ) : (
                  <FilterX className="h-3 w-3" aria-hidden />
                )}
                {onPage1 ? 'Page 1 Match' : 'Filtered Out'}
              </span>
            </div>
            <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all px-3 py-3 font-mono text-sm leading-relaxed text-emerald-300/90">
              {query.booleanQuery}
            </pre>
            {!onPage1 && query.missingExactTerm ? (
              <div className="min-w-0 border-t border-zinc-800/80 px-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    void (async () => {
                      const ok = await copyToClipboard(
                        query.missingExactTerm ?? '',
                      );
                      if (!ok) return;
                      setCopiedTerm(query.missingExactTerm);
                      window.setTimeout(() => setCopiedTerm(null), 1500);
                    })();
                  }}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-left text-xs font-medium text-amber-200 transition hover:bg-amber-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  {copiedTerm === query.missingExactTerm ? (
                    <Check className="h-3 w-3 shrink-0" aria-hidden />
                  ) : (
                    <Copy className="h-3 w-3 shrink-0" aria-hidden />
                  )}
                  <span className="min-w-0 break-words">
                    Copy Missing Term: {query.missingExactTerm}
                  </span>
                </button>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
