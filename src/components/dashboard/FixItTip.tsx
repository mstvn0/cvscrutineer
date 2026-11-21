'use client';

import { useState } from 'react';
import { Check, Copy, Wrench } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

type FixItTipProps = {
  advice: string;
  draftText: string | null;
  copyKey: string;
};

export function FixItTip({ advice, draftText, copyKey }: FixItTipProps) {
  const [copied, setCopied] = useState(false);
  const pasteReady =
    draftText !== null && draftText.trim().length > 0 ? draftText : null;

  return (
    <div className="mt-3 min-w-0 overflow-hidden rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2">
      <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90">
        <Wrench className="h-3 w-3 shrink-0" aria-hidden />
        Fix-it
      </p>

      <p className="mt-1 break-words text-sm leading-relaxed text-emerald-100/90">
        {advice}
      </p>

      {pasteReady ? (
        <div className="mt-2 min-w-0">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
            Suggestions
          </p>
          <div className="relative min-w-0 rounded-md border border-emerald-500/20 bg-zinc-950/50">
            <button
              type="button"
              onClick={() => {
                void (async () => {
                  const ok = await copyToClipboard(pasteReady);
                  if (!ok) return;
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                })();
              }}
              aria-label={`Copy suggested text ${copyKey}`}
              className="absolute top-1.5 right-1.5 z-10 inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-zinc-950/95 px-2 py-1 text-[11px] font-medium text-emerald-200 shadow-sm transition hover:bg-emerald-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              {copied ? (
                <Check className="h-3 w-3" aria-hidden />
              ) : (
                <Copy className="h-3 w-3" aria-hidden />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words px-2.5 py-2.5 pr-[4.75rem] font-mono text-xs leading-relaxed text-emerald-100">
              {pasteReady}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
