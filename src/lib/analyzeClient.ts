import { z } from 'zod';
import { AnalysisSchema, type AnalysisResult } from '@/lib/schemas/analysis';

export const ApiErrorSchema = z.object({
  error: z.string(),
});

export class AnalyzeClientError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AnalyzeClientError';
    this.status = status;
  }
}

/**
 * POST resume + JD to /api/analyze and validate the response.
 */
export async function analyzeResume(
  resume: string,
  jobDescription: string,
  signal?: AbortSignal,
): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume, jobDescription }),
    signal,
  });

  const raw: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = ApiErrorSchema.safeParse(raw);
    throw new AnalyzeClientError(
      parsed.success ? parsed.data.error : 'Analysis request failed.',
      response.status,
    );
  }

  const parsed = AnalysisSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AnalyzeClientError(
      'Received an invalid analysis payload from the server.',
      500,
    );
  }

  return parsed.data;
}
