'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { analyzeResume, AnalyzeClientError } from '@/lib/analyzeClient';
import {
  SCRUTINIZE_STAGES,
  STAGE_ROTATION_MS,
  type ScrutinizeStage,
} from '@/lib/loadingStages';
import type { AnalysisResult } from '@/lib/schemas/analysis';

export type ScrutinizeStatus = 'idle' | 'loading' | 'success' | 'error';

export function useScrutinize() {
  const [status, setStatus] = useState<ScrutinizeStatus>('idle');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (status !== 'loading') return;
    const id = window.setInterval(() => {
      setStageIndex((current) => (current + 1) % SCRUTINIZE_STAGES.length);
    }, STAGE_ROTATION_MS);
    return () => window.clearInterval(id);
  }, [status]);

  const stage: ScrutinizeStage =
    SCRUTINIZE_STAGES[stageIndex] ?? 'Extracting hidden JD knockout rules...';

  const resetResults = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus('idle');
    setAnalysis(null);
    setError(null);
    setStageIndex(0);
  }, []);

  const scrutinize = useCallback(async (resume: string, jobDescription: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStageIndex(0);
    setStatus('loading');
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeResume(
        resume,
        jobDescription,
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setAnalysis(result);
      setStatus('success');
    } catch (err) {
      if (controller.signal.aborted) return;
      const message =
        err instanceof AnalyzeClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Unexpected error while analyzing.';
      setError(message);
      setStatus('error');
    }
  }, []);

  return {
    status,
    analysis,
    error,
    stage,
    scrutinize,
    resetResults,
  };
}
