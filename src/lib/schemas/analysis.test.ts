import { describe, expect, it } from 'vitest';
import {
  AnalysisFindingsSchema,
  AnalysisSchema,
  FixItSuggestionSchema,
} from './analysis';

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
      fixItSuggestion: null,
    },
  ],
  semanticDriftAudit: [
    {
      resumeSectionOrRole: 'Store Manager — Harbor & Pine Outfitters',
      driftDiagnosis: 'Diluting Vector' as const,
      actionAdvice:
        'Reword with JD/ATS terms already on the resume, else remove',
      fixItSuggestion: {
        advice:
          'Collapse the Harbor & Pine inventory bullet into one Earlier Experience line using only facts already listed.',
        draftText:
          'Earlier Experience: Store Manager — Harbor & Pine Outfitters — managed 22-person team; owned inventory forecasting and vendor coordination.',
      },
    },
  ],
  recruiterSearchQueries: [
    {
      booleanQuery: '"TypeScript" AND "Next.js" AND "payments"',
      wouldMatch: false,
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

describe('FixItSuggestionSchema', () => {
  it('accepts advice with paste-ready draftText', () => {
    const parsed = FixItSuggestionSchema.safeParse({
      advice: 'Swap the Skills acronym for the exact JD term.',
      draftText:
        'TypeScript, React, Next.js, HTML/CSS, WordPress, WooCommerce, Shopify, retail operations, team leadership, merchandising, customer service, GraphQL, Jest',
    });
    expect(parsed.success).toBe(true);
  });

  it('accepts surgical keyword-swap draftText that keeps the rest of the line', () => {
    const original =
      'JS/TS, React, Next.js, HTML/CSS, WordPress, WooCommerce, Shopify, retail operations, team leadership, merchandising, customer service, GraphQL, Jest';
    const swapped =
      'TypeScript, React, Next.js, HTML/CSS, WordPress, WooCommerce, Shopify, retail operations, team leadership, merchandising, customer service, GraphQL, Jest';
    const parsed = FixItSuggestionSchema.safeParse({
      advice: 'On the Skills line, replace only "JS/TS" with "TypeScript".',
      draftText: swapped,
    });
    expect(parsed.success).toBe(true);
    expect(swapped.replace('TypeScript', 'JS/TS')).toBe(original);
  });

  it('allows null draftText for pure removal tips', () => {
    const parsed = FixItSuggestionSchema.safeParse({
      advice: 'Remove the WordPress brochure-site bullets; no JD overlap.',
      draftText: null,
    });
    expect(parsed.success).toBe(true);
  });
});

describe('AnalysisFindingsSchema', () => {
  it('parses findings without scores or rewrites', () => {
    expect(AnalysisFindingsSchema.safeParse(validFindings).success).toBe(true);
  });

  it('accepts grounded fixItSuggestion on failed knockouts', () => {
    const firstRule = validFindings.knockoutRules[0];
    expect(firstRule).toBeDefined();
    if (!firstRule) return;

    const parsed = AnalysisFindingsSchema.safeParse({
      ...validFindings,
      knockoutRules: [
        {
          ...firstRule,
          status: 'failed',
          fixItSuggestion: {
            advice:
              'On the Skills line, replace only "JS/TS" with "TypeScript".',
            draftText:
              'TypeScript, React, Next.js, HTML/CSS, WordPress, WooCommerce, Shopify, retail operations, team leadership, merchandising, customer service, GraphQL, Jest',
          },
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it('accepts Fix-it on warning near-miss knockouts', () => {
    const firstRule = validFindings.knockoutRules[0];
    expect(firstRule).toBeDefined();
    if (!firstRule) return;

    const parsed = AnalysisFindingsSchema.safeParse({
      ...validFindings,
      knockoutRules: [
        {
          ...firstRule,
          rule: 'Explicit 0-to-1 product ownership (greenfield or new product line)',
          status: 'warning',
          evidenceOrGap:
            'Led cross-functional delivery of a new checkout upsell module used by 180k monthly shoppers',
          fixItSuggestion: {
            advice:
              'Your new checkout upsell module bullet is close to what they call 0-to-1. Check if 0-to-1 actually suits your experience, and if you decide that it does, rewrite it with that term and keep all the other facts the same.',
            draftText:
              'Led 0-to-1 delivery of a new checkout upsell module used by 180k monthly shoppers',
          },
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects missing fixItSuggestion fields', () => {
    const firstRule = validFindings.knockoutRules[0];
    expect(firstRule).toBeDefined();
    if (!firstRule) return;

    const withoutTip = {
      rule: firstRule.rule,
      category: firstRule.category,
      status: firstRule.status,
      evidenceOrGap: firstRule.evidenceOrGap,
    };
    const parsed = AnalysisFindingsSchema.safeParse({
      ...validFindings,
      knockoutRules: [withoutTip],
    });
    expect(parsed.success).toBe(false);
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
