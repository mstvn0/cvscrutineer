import { z } from 'zod';

/**
 * Fix-it: short advice plus optional paste-ready draft.
 * Copy uses draftText only — never the advice blurb.
 */
export const FixItSuggestionSchema = z.object({
  advice: z
    .string()
    .describe(
      'Natural coach-style guidance for a resume uploader (not what Copy pastes)—not a rigid template. Name the gap, where to change it, and why it helps. Skill example: "Spell out TypeScript on your Skills line—recruiters search the full word, not JS/TS." Framing near-miss: "Your new checkout upsell module bullet is close to what they call 0-to-1. Check if 0-to-1 actually suits your experience, and if you decide that it does, rewrite it with that term and keep all the other facts the same." Never invent experience; never empty leave-it-as-is endings; never mid-sentence e.g. asides.',
    ),
  draftText: z
    .string()
    .nullable()
    .describe(
      'Paste-ready text from one concrete resume entry (prefer skills line, bullet, or summary). For keyword/acronym swaps (e.g. JS/TS → TypeScript), return that exact line with ONLY the target token replaced—do not rephrase, reorder, drop, or add other words. Broader rewrites: rewrite an existing bullet/summary or draft a new bullet under a Title — Company header, grounded only in facts already evidenced for that role; when placement is uncertain, illustrate phrasing on one real bullet while advice leaves final placement to the candidate. Do not rewrite Title — Company headers by stuffing JD jargon into the title. Null only for pure removal. Never invent metrics, tools, employers, or outcomes.',
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
        'When status is failed: always set advice plus draftText grounded in real resume facts. When status is warning (partial/synonym near-miss): always set Fix-it that invites adding the exact knockout term to the cited experience only if the uploader decides it fits—never assume. Keyword gaps: swap only the missing/near-miss token on that line (e.g. JS/TS → TypeScript). Framing near-misses (checkout upsell ↔ 0-to-1): lead with the resume cue, ask them to decide, then the rewrite. Null for met only. Never invent skills, employers, or metrics.',
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
        'When Diluting Vector: advice plus draftText that rewrites an existing bullet under that role or drafts a new bullet under the same Title — Company header, using JD/ATS terms already evidenced for that role—not by editing the role header/title. draftText null only for pure removal. Null object for High Signal/Neutral. Never invent new experience.',
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
      wouldMatch: z
        .boolean()
        .describe(
          'True if this Boolean search would surface the candidate; false if filtered out for a missing exact term.',
        ),
      missingExactTerm: z
        .string()
        .nullable()
        .describe(
          'Exact missing synonym/keyword when the search would not match; null when it would.',
        ),
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
