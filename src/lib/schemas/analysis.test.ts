import { describe, expect, it } from 'vitest';
import { AnalysisFindingsSchema, AnalysisSchema } from './analysis';

const validFindings = {
  executiveSummary:
    'The ATS is likely to auto-reject due to missing TypeScript keyword matches. Semantic drift from retail history further suppresses rank.',
  atsParsedProfile: {
    detectedPrimaryTitle: 'Senior Frontend Engineer',
    calculatedRelevantYears: 6,
    seniorityClassification: 'Senior' as const,
    parserWarnings: ['Skills list uses JS/TS acronym instead of TypeScript'],
  },
  knockoutRules: [
    {
      rule: 'Explicit TypeScript production experience',
      category: 'Core Tech / Domain' as const,
      status: 'warning' as const,
      evidenceOrGap: 'Resume lists "JS/TS" but never spells TypeScript',
    },
  ],
  semanticDriftAudit: [
    {
      resumeSectionOrRole: 'Store Manager — Harbor & Pine Outfitters',
      driftDiagnosis: 'Diluting Vector' as const,
      actionAdvice: 'Compress/Delete to a single line or remove entirely',
    },
  ],
  recruiterSearchQueries: [
    {
      booleanQuery: '"TypeScript" AND "Next.js" AND "payments"',
      wouldAppearOnPage1: false,
      missingExactTerm: 'TypeScript',
    },
  ],
};

const validAnalysis = {
  ...validFindings,
  knockoutStatus: 'AT_RISK' as const,
  verdictBreakdown: {
    failedKnockoutCount: 0,
    warningKnockoutCount: 1,
    dilutingSectionCount: 1,
    missedBooleanCount: 1,
    classificationRule:
      'No hard knockout failures, but at risk due to 1 knockout warning, 1 diluting section, 1 Boolean miss.',
  },
};

describe('AnalysisFindingsSchema', () => {
  it('parses findings without scores or rewrites', () => {
    expect(AnalysisFindingsSchema.safeParse(validFindings).success).toBe(true);
  });

  it('rejects invalid driftDiagnosis', () => {
    const firstRow = validFindings.semanticDriftAudit[0];
    expect(firstRow).toBeDefined();
    if (!firstRow) return;

    const parsed = AnalysisFindingsSchema.safeParse({
      ...validFindings,
      semanticDriftAudit: [{ ...firstRow, driftDiagnosis: 'Maybe' }],
    });
    expect(parsed.success).toBe(false);
  });
});

describe('AnalysisSchema', () => {
  it('parses a complete analysis with derived verdict fields', () => {
    expect(AnalysisSchema.safeParse(validAnalysis).success).toBe(true);
  });

  it('rejects invalid knockoutStatus enum values', () => {
    const parsed = AnalysisSchema.safeParse({
      ...validAnalysis,
      knockoutStatus: 'MAYBE',
    });
    expect(parsed.success).toBe(false);
  });

  it('rejects negative verdict counts', () => {
    const parsed = AnalysisSchema.safeParse({
      ...validAnalysis,
      verdictBreakdown: {
        ...validAnalysis.verdictBreakdown,
        failedKnockoutCount: -1,
      },
    });
    expect(parsed.success).toBe(false);
  });
});
