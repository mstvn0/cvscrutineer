import { z } from 'zod';

/**
 * Fix-it: short advice plus optional paste-ready draft.
 * Copy uses draftText only — never the advice blurb.
 */
export const FixItSuggestionSchema = z.object({
  advice: z
    .string()
    .describe(
      'One short sentence explaining what to change and why (guidance only; not what Copy pastes).',
    ),
  draftText: z
    .string()
    .nullable()
    .describe(
      'Paste-ready text from one concrete resume entry (bullet, skills line, summary sentence, or role header). For keyword/acronym swaps (e.g. JS/TS → TypeScript), return that exact line with ONLY the target token replaced—do not rephrase, reorder, drop, or add other words. Broader rewrites may adjust wording but must keep the same employers/facts. Null only for pure removal. Never invent metrics, tools, employers, or outcomes.',
    ),
});

/**
 * Shared LLM findings schema for CVScrutineer analysis.
 * Probabilities are intentionally omitted — verdict is derived deterministically.
 */
export const AnalysisFindingsSchema = z.object({
  executiveSummary: z
    .string()
    .describe(
      '2-sentence plain-English diagnosis explaining the #1 reason the ATS passes or rejects this resume.',
    ),
  atsParsedProfile: z.object({
    detectedPrimaryTitle: z.string(),
    calculatedRelevantYears: z.number(),
    seniorityClassification: z.enum([
      'Junior',
      'Mid-Level',
      'Senior',
      'Staff/Lead',
      'Unclear',
    ]),
    parserWarnings: z
      .array(z.string())
      .describe(
        'Silent extraction bugs like vague dates, acronym-only skills, or title mismatches',
      ),
  }),
  knockoutRules: z.array(
    z.object({
      rule: z
        .string()
        .describe('Hidden pass/fail requirement extracted from the JD'),
      category: z.enum([
        'Experience & Seniority',
        'Core Tech / Domain',
        'Ownership & Scope',
        'Logistics / Constraints',
      ]),
      status: z.enum(['met', 'warning', 'failed']),
      evidenceOrGap: z
        .string()
        .describe(
          'Exact quote or reason why the resume passes or triggers auto-rejection',
        ),
      fixItSuggestion: FixItSuggestionSchema.nullable().describe(
        'When status is failed: advice plus draftText from one real resume entry. Keyword gaps: swap only the missing/near-miss token on that line (e.g. JS/TS → TypeScript) and leave every other word unchanged. Null for met/warning. Never invent skills, employers, or metrics.',
      ),
    }),
  ),
  semanticDriftAudit: z.array(
    z.object({
      resumeSectionOrRole: z
        .string()
        .describe('Each role, project, or section found in the resume'),
      driftDiagnosis: z.enum(['High Signal', 'Neutral', 'Diluting Vector']),
      actionAdvice: z
        .string()
        .describe(
          'Concrete instruction: Expand metrics, Keep concise, or Reword with JD/ATS terms already on the resume (else remove) to stop dragging down semantic relevance',
        ),
      fixItSuggestion: FixItSuggestionSchema.nullable().describe(
        'When Diluting Vector: advice plus draftText that rewrites that section’s own resume wording with JD/ATS terms already elsewhere on the resume. draftText null only for pure removal. Null object for High Signal/Neutral. Never invent new experience.',
      ),
    }),
  ),
  recruiterSearchQueries: z.array(
    z.object({
      booleanQuery: z
        .string()
        .describe(
          'Realistic 3-5 word recruiter search query e.g. \'"React" AND "TypeScript" AND ("payments" OR "fintech")\'',
        ),
      wouldAppearOnPage1: z.boolean(),
      missingExactTerm: z
        .string()
        .nullable()
        .describe('Exact missing synonym/keyword if false, or null if true'),
    }),
  ),
});

export const KnockoutStatusSchema = z.enum([
  'PASS',
  'AT_RISK',
  'LIKELY_REJECTED',
]);

export const VerdictBreakdownSchema = z.object({
  failedKnockoutCount: z.number().int().nonnegative(),
  warningKnockoutCount: z.number().int().nonnegative(),
  dilutingSectionCount: z.number().int().nonnegative(),
  missedBooleanCount: z.number().int().nonnegative(),
  classificationRule: z
    .string()
    .describe('Human-readable rule that produced the knockoutStatus'),
});

export const AnalysisSchema = AnalysisFindingsSchema.extend({
  knockoutStatus: KnockoutStatusSchema,
  verdictBreakdown: VerdictBreakdownSchema,
});

export type FixItSuggestion = z.infer<typeof FixItSuggestionSchema>;
export type AnalysisFindings = z.infer<typeof AnalysisFindingsSchema>;
export type AnalysisResult = z.infer<typeof AnalysisSchema>;
export type KnockoutStatus = z.infer<typeof KnockoutStatusSchema>;
export type VerdictBreakdown = z.infer<typeof VerdictBreakdownSchema>;
