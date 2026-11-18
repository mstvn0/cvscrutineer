'use client';

import { Eraser, Loader2, Radar } from 'lucide-react';
import { RESUME_MAX_LENGTH } from '@/lib/constants';
import { SAMPLE_SCENARIOS } from '@/lib/sampleData';
import type { ScrutinizeStage } from '@/lib/loadingStages';

const SAMPLE_BUTTONS = [
  {
    id: 'senior-frontend-vector-drift',
    label: 'Sample: Senior Frontend Dev',
  },
  {
    id: 'product-manager-knockout-synonym',
    label: 'Sample: Product Manager',
  },
] as const;

type InputWorkspaceProps = {
  resume: string;
  jobDescription: string;
  onResumeChange: (value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onLoadSample: (id: string) => void;
  onClear: () => void;
  onScrutinize: () => void;
  isLoading: boolean;
  stage: ScrutinizeStage;
  error: string | null;
};

function CharCounter({ value }: { value: string }) {
  return (
    <span className="tabular-nums text-xs text-zinc-500">
      {value.length.toLocaleString()} / {RESUME_MAX_LENGTH.toLocaleString()}
    </span>
  );
}

export function InputWorkspace({
  resume,
  jobDescription,
  onResumeChange,
  onJobDescriptionChange,
  onLoadSample,
  onClear,
  onScrutinize,
  isLoading,
  stage,
  error,
}: InputWorkspaceProps) {
  const canSubmit =
    !isLoading &&
    resume.trim().length >= 50 &&
    jobDescription.trim().length >= 50;

  return (
    <section
      className="flex h-full min-h-0 flex-col gap-4 border-b border-zinc-800 bg-zinc-950 p-4 lg:border-b-0 lg:border-r lg:border-zinc-800 lg:p-5"
      aria-label="Input workspace"
    >
      <div className="flex flex-wrap gap-2">
        {SAMPLE_BUTTONS.map((btn) => {
          const exists = SAMPLE_SCENARIOS.some((s) => s.id === btn.id);
          return (
            <button
              key={btn.id}
              type="button"
              disabled={!exists || isLoading}
              onClick={() => onLoadSample(btn.id)}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-emerald-500/40 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:text-sm"
            >
              {btn.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-rose-500/40 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 sm:text-sm"
        >
          <Eraser className="h-3.5 w-3.5" aria-hidden />
          Clear
        </button>
      </div>

      <label className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-end justify-between gap-2">
          <span className="text-sm font-medium text-zinc-200">Your Resume</span>
          <CharCounter value={resume} />
        </div>
        <textarea
          value={resume}
          maxLength={RESUME_MAX_LENGTH}
          onChange={(e) => onResumeChange(e.target.value)}
          disabled={isLoading}
          spellCheck={false}
          placeholder="Paste your resume text…"
          className="min-h-[180px] flex-1 resize-y rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 font-mono text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 lg:min-h-0"
        />
      </label>

      <label className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-end justify-between gap-2">
          <span className="text-sm font-medium text-zinc-200">
            Target Job Description
          </span>
          <CharCounter value={jobDescription} />
        </div>
        <textarea
          value={jobDescription}
          maxLength={RESUME_MAX_LENGTH}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          disabled={isLoading}
          spellCheck={false}
          placeholder="Paste the target job description…"
          className="min-h-[160px] flex-1 resize-y rounded-xl border border-zinc-800 bg-zinc-900/80 p-3 font-mono text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 lg:min-h-0"
        />
      </label>

      {error ? (
        <p
          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={onScrutinize}
        disabled={!canSubmit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            <span className="truncate">{stage}</span>
          </>
        ) : (
          <>
            <Radar className="h-4 w-4" aria-hidden />
            Scrutinize Resume
          </>
        )}
      </button>
    </section>
  );
}
