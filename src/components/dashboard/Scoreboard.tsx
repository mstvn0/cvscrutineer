'use client';

import { AlertTriangle } from 'lucide-react';
import type { GateMetricKey } from '@/lib/dashboardNavigation';
import type { AnalysisResult } from '@/lib/schemas/analysis';
import { VerdictPanel } from './VerdictPanel';

type ScoreboardProps = {
  analysis: AnalysisResult;
  onGateNavigate?: (key: GateMetricKey) => void;
};

export function Scoreboard({ analysis, onGateNavigate }: ScoreboardProps) {
  const { atsParsedProfile, executiveSummary } = analysis;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <VerdictPanel analysis={analysis} onGateNavigate={onGateNavigate} />
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Executive diagnosis
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-200">
            {executiveSummary}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
          What the ATS Bot Parsed
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <ParsedCell
            label="Detected Title"
            value={atsParsedProfile.detectedPrimaryTitle}
          />
          <ParsedCell
            label="Relevant Years"
            value={String(atsParsedProfile.calculatedRelevantYears)}
          />
          <ParsedCell
            label="Seniority Tier"
            value={atsParsedProfile.seniorityClassification}
          />
        </div>
        {atsParsedProfile.parserWarnings.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {atsParsedProfile.parserWarnings.map((warning) => (
              <li
                key={warning}
                className="flex items-start gap-2 text-xs text-amber-200/90"
              >
                <AlertTriangle
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400"
                  aria-hidden
                />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function ParsedCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-950/60 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-medium text-zinc-100">
        {value}
      </p>
    </div>
  );
}
