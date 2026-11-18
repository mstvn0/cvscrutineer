import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnalyzeClientError, analyzeResume, ApiErrorSchema } from './analyzeClient';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('ApiErrorSchema', () => {
  it('accepts { error: string }', () => {
    expect(ApiErrorSchema.safeParse({ error: 'Nope' }).success).toBe(true);
  });

  it('rejects missing error', () => {
    expect(ApiErrorSchema.safeParse({}).success).toBe(false);
  });
});

describe('analyzeResume', () => {
  it('returns validated analysis on success', async () => {
    const payload = {
      executiveSummary: 'One. Two.',
      atsParsedProfile: {
        detectedPrimaryTitle: 'Engineer',
        calculatedRelevantYears: 5,
        seniorityClassification: 'Senior',
        parserWarnings: [],
      },
      knockoutRules: [],
      semanticDriftAudit: [],
      recruiterSearchQueries: [],
      knockoutStatus: 'PASS',
      verdictBreakdown: {
        failedKnockoutCount: 0,
        warningKnockoutCount: 0,
        dilutingSectionCount: 0,
        missedBooleanCount: 0,
        classificationRule: 'All knockout rules met.',
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => payload,
      }),
    );

    const result = await analyzeResume('x'.repeat(60), 'y'.repeat(60));
    expect(result.knockoutStatus).toBe('PASS');
    expect(result.verdictBreakdown.failedKnockoutCount).toBe(0);
  });

  it('throws AnalyzeClientError with server message on failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limit exceeded.' }),
      }),
    );

    await expect(
      analyzeResume('x'.repeat(60), 'y'.repeat(60)),
    ).rejects.toMatchObject({
      name: 'AnalyzeClientError',
      message: 'Rate limit exceeded.',
      status: 429,
    } satisfies Partial<AnalyzeClientError>);
  });
});
