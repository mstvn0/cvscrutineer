'use client';

import { useState } from 'react';
import { Check, Copy, FilterX, ListChecks } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';
import type { AnalysisResult } from '@/lib/schemas/analysis';

export function RecruiterTab({
  queries,
}: {
  queries: AnalysisResult['recruiterSearchQueries'];
}) {
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  if (queries.length === 0) {
    return <p className="text-sm text-zinc-500">No recruiter queries simulated.</p>;
  }

  return (
    <ul className="space-y-3">
      {queries.map((query, index) => {
        const onPage1 = query.wouldAppearOnPage1;
        return (
          <li
            key={`${query.booleanQuery}-${index}`}
            className="overflow-hidden rounded-xl border border-zinc-800 bg-[#0c0f14]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                boolean@{index + 1}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
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
            <pre className="overflow-x-auto px-3 py-3 font-mono text-sm leading-relaxed text-emerald-300/90">
              {query.booleanQuery}
            </pre>
            {!onPage1 && query.missingExactTerm ? (
              <div className="border-t border-zinc-800/80 px-3 py-2">
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await copyToClipboard(
                      query.missingExactTerm ?? '',
                    );
                    if (ok) {
                      setCopiedTerm(query.missingExactTerm);
                      window.setTimeout(() => setCopiedTerm(null), 1500);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-200 transition hover:bg-amber-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  {copiedTerm === query.missingExactTerm ? (
                    <Check className="h-3 w-3" aria-hidden />
                  ) : (
                    <Copy className="h-3 w-3" aria-hidden />
                  )}
                  Copy Missing Term: {query.missingExactTerm}
                </button>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
