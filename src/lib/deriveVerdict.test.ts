import { describe, expect, it } from 'vitest';
import { deriveVerdict, withDerivedVerdict } from './deriveVerdict';
import type { AnalysisFindings } from './schemas/analysis';

function baseFindings(
  overrides: Partial<AnalysisFindings> = {},
): AnalysisFindings {
  return {
    executiveSummary: 'Summary one. Summary two.',
    atsParsedProfile: {
      detectedPrimaryTitle: 'Engineer',
      calculatedRelevantYears: 5,
      seniorityClassification: 'Senior',
      parserWarnings: [],
    },
    knockoutRules: [
      {
        rule: 'TypeScript required',
        category: 'Core Tech / Domain',
        status: 'met',
        evidenceOrGap: 'Lists TypeScript',
        fixItSuggestion: null,
      },
    ],
    semanticDriftAudit: [
      {
        resumeSectionOrRole: 'Frontend Engineer',
        driftDiagnosis: 'High Signal',
        actionAdvice: 'Keep concise',
        fixItSuggestion: null,
      },
    ],
    recruiterSearchQueries: [
      {
        booleanQuery: '"TypeScript" AND "React"',
        wouldAppearOnPage1: true,
        missingExactTerm: null,
      },
    ],
    ...overrides,
  };
}

describe('deriveVerdict', () => {
  it('returns PASS when all gates clear', () => {
    const verdict = deriveVerdict(baseFindings());
    expect(verdict.knockoutStatus).toBe('PASS');
    expect(verdict.verdictBreakdown.failedKnockoutCount).toBe(0);
    expect(verdict.verdictBreakdown.classificationRule).toContain(
      'All knockout rules met',
    );
  });

  it('returns LIKELY_REJECTED when any knockout failed', () => {
    const verdict = deriveVerdict(
      baseFindings({
        knockoutRules: [
          {
            rule: 'SQL required',
            category: 'Core Tech / Domain',
            status: 'failed',
            evidenceOrGap: 'No SQL mentioned',
            fixItSuggestion:
              'Add the JD keyword SQL next to your existing analytics tooling line if that work used SQL.',
          },
          {
            rule: '4+ years PM',
            category: 'Experience & Seniority',
            status: 'warning',
            evidenceOrGap: 'Dates ambiguous',
            fixItSuggestion: null,
          },
        ],
        semanticDriftAudit: [
          {
            resumeSectionOrRole: 'Retail',
            driftDiagnosis: 'Diluting Vector',
            actionAdvice: 'Delete',
            fixItSuggestion:
              'Move retail to a one-line Earlier Experience entry using only titles already listed.',
          },
        ],
        recruiterSearchQueries: [
          {
            booleanQuery: 'SQL AND PM',
            wouldAppearOnPage1: false,
            missingExactTerm: 'SQL',
          },
        ],
      }),
    );

    expect(verdict.knockoutStatus).toBe('LIKELY_REJECTED');
    expect(verdict.verdictBreakdown.failedKnockoutCount).toBe(1);
    expect(verdict.verdictBreakdown.classificationRule).toContain(
      'hard knockout',
    );
  });

  it('returns AT_RISK for warnings without hard failures', () => {
    const verdict = deriveVerdict(
      baseFindings({
        knockoutRules: [
          {
            rule: 'TypeScript',
            category: 'Core Tech / Domain',
            status: 'warning',
            evidenceOrGap: 'Only JS/TS acronym',
            fixItSuggestion: null,
          },
        ],
      }),
    );
    expect(verdict.knockoutStatus).toBe('AT_RISK');
    expect(verdict.verdictBreakdown.warningKnockoutCount).toBe(1);
  });

  it('returns AT_RISK for diluting sections alone', () => {
    const verdict = deriveVerdict(
      baseFindings({
        semanticDriftAudit: [
          {
            resumeSectionOrRole: 'WordPress freelance',
            driftDiagnosis: 'Diluting Vector',
            actionAdvice: 'Compress/Delete',
            fixItSuggestion:
              'Compress freelance WordPress work to a single bullet under side projects.',
          },
        ],
      }),
    );
    expect(verdict.knockoutStatus).toBe('AT_RISK');
    expect(verdict.verdictBreakdown.dilutingSectionCount).toBe(1);
  });

  it('returns AT_RISK for Boolean misses alone', () => {
    const verdict = deriveVerdict(
      baseFindings({
        recruiterSearchQueries: [
          {
            booleanQuery: '"0-to-1" AND SQL',
            wouldAppearOnPage1: false,
            missingExactTerm: '0-to-1',
          },
        ],
      }),
    );
    expect(verdict.knockoutStatus).toBe('AT_RISK');
    expect(verdict.verdictBreakdown.missedBooleanCount).toBe(1);
  });

  it('withDerivedVerdict attaches status without mutating findings fields', () => {
    const findings = baseFindings();
    const full = withDerivedVerdict(findings);
    expect(full.executiveSummary).toBe(findings.executiveSummary);
    expect(full.knockoutStatus).toBe('PASS');
    expect(full.verdictBreakdown.missedBooleanCount).toBe(0);
  });
});
