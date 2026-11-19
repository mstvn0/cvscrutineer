'use client';

import { useState } from 'react';
import { Check, Copy, Wrench } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

type FixItTipProps = {
  suggestion: string;
  copyKey: string;
};

export function FixItTip({ suggestion, copyKey }: FixItTipProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90">
            <Wrench className="h-3 w-3" aria-hidden />
            Fix-it
          </p>
          <p className="mt-1 text-sm leading-relaxed text-emerald-100/90">
            {suggestion}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void (async () => {
              const ok = await copyToClipboard(suggestion);
              if (!ok) return;
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            })();
          }}
          aria-label={`Copy fix-it tip ${copyKey}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-200 transition hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        >
          {copied ? (
            <Check className="h-3 w-3" aria-hidden />
          ) : (
            <Copy className="h-3 w-3" aria-hidden />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
