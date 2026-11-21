'use client';

import { AlertTriangle } from 'lucide-react';
import type { AnalysisResult } from '@/lib/schemas/analysis';

type AtsProfile = AnalysisResult['atsParsedProfile'];

type AtsParsedPanelProps = {
  profile: AtsProfile;
};

export function AtsParsedPanel({ profile }: AtsParsedPanelProps) {
  const warnings = profile.parserWarnings;

  return (
    <section
      className="@container min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3"
      aria-label="What the ATS Bot Parsed"
    >
      <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          What the ATS Bot Parsed
        </p>
        {warnings.length === 0 ? (
          <p className="text-[11px] text-zinc-500">No parser warnings</p>
        ) : (
          <p className="text-[11px] text-amber-400/90">
            {warnings.length} parser warning{warnings.length === 1 ? '' : 's'}
          </p>
        )}
      </div>

      <div className="mt-2 grid min-w-0 grid-cols-1 gap-1.5 @min-[28rem]:grid-cols-3">
        <ParsedCell
          label="Detected Title"
          value={profile.detectedPrimaryTitle}
          emphasize
        />
        <ParsedCell
          label="Relevant Years"
          value={String(profile.calculatedRelevantYears)}
        />
        <ParsedCell
          label="Seniority Tier"
          value={profile.seniorityClassification}
        />
      </div>

      {warnings.length > 0 ? (
        <ul className="mt-2 max-h-16 min-w-0 space-y-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-600">
          {warnings.map((warning) => (
            <li
              key={warning}
              className="flex min-w-0 items-start gap-1.5 text-[11px] leading-snug text-amber-200/90"
            >
              <AlertTriangle
                className="mt-0.5 h-3 w-3 shrink-0 text-amber-400"
                aria-hidden
              />
              <span className="min-w-0 break-words" title={warning}>
                {warning}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function ParsedCell({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex min-h-[3.25rem] min-w-0 flex-col justify-center rounded-lg bg-zinc-950/60 px-2.5 py-1.5">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-0.5 truncate text-sm font-medium leading-snug text-zinc-100 ${
          emphasize ? '' : 'tabular-nums'
        }`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}
