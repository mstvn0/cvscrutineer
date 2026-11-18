import { z } from 'zod';

export const MIN_ANALYZE_CHARS = 50;
export const MAX_ANALYZE_CHARS = 10_000;

export const AnalyzeRequestSchema = z.object({
  resume: z
    .string({ error: 'Both resume and jobDescription must be strings.' })
    .trim()
    .min(1, 'Both resume and jobDescription are required and cannot be empty.')
    .min(
      MIN_ANALYZE_CHARS,
      `Both resume and jobDescription must be at least ${MIN_ANALYZE_CHARS} characters.`,
    )
    .max(
      MAX_ANALYZE_CHARS,
      `Both resume and jobDescription must be under ${MAX_ANALYZE_CHARS.toLocaleString()} characters.`,
    ),
  jobDescription: z
    .string({ error: 'Both resume and jobDescription must be strings.' })
    .trim()
    .min(1, 'Both resume and jobDescription are required and cannot be empty.')
    .min(
      MIN_ANALYZE_CHARS,
      `Both resume and jobDescription must be at least ${MIN_ANALYZE_CHARS} characters.`,
    )
    .max(
      MAX_ANALYZE_CHARS,
      `Both resume and jobDescription must be under ${MAX_ANALYZE_CHARS.toLocaleString()} characters.`,
    ),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export type AnalyzeRequestValidation =
  | { ok: true; data: AnalyzeRequest }
  | { ok: false; error: string };

/**
 * Validate POST /api/analyze JSON without untyped casts.
 */
export function validateAnalyzeRequest(
  body: unknown,
): AnalyzeRequestValidation {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Request body must be a JSON object.' };
  }

  const parsed = AnalyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return {
      ok: false,
      error: firstIssue?.message ?? 'Invalid analyze request payload.',
    };
  }

  return { ok: true, data: parsed.data };
}
