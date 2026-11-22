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
        wouldMatch: true,
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
            fixItSuggestion: {
              advice:
                'Add the JD keyword SQL beside analytics tooling already listed on the resume.',
              draftText: 'Analytics tooling (SQL)',
            },
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
            actionAdvice: 'Reword with JD terms else remove',
            fixItSuggestion: {
              advice:
                'Collapse the Harbor & Pine retail role to one Earlier Experience line using its existing title and team size.',
              draftText:
                'Earlier Experience: Store Manager — Harbor & Pine Outfitters (22-person team; inventory ops).',
            },
          },
        ],
        recruiterSearchQueries: [
          {
            booleanQuery: 'SQL AND PM',
            wouldMatch: false,
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
            actionAdvice: 'Reword with JD terms else remove',
            fixItSuggestion: {
              advice:
                'No salvageable JD overlap in the WordPress brochure work — remove those bullets.',
              draftText: null,
            },
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
            wouldMatch: false,
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
    const full = withDerivedVerdict(
      findings,
      'Expert TypeScript and React engineer',
    );
    expect(full.executiveSummary).toBe(findings.executiveSummary);
    expect(full.knockoutStatus).toBe('PASS');
    expect(full.verdictBreakdown.missedBooleanCount).toBe(0);
  });

  it('withDerivedVerdict corrects false Boolean matches when TypeScript is missing', () => {
    const findings = baseFindings({
      recruiterSearchQueries: [
        {
          booleanQuery: '"TypeScript" AND "React"',
          wouldMatch: true,
          missingExactTerm: null,
        },
      ],
    });
    const full = withDerivedVerdict(findings, 'Skills: JS/TS, React, Next.js');
    expect(full.recruiterSearchQueries[0]?.wouldMatch).toBe(false);
    expect(full.recruiterSearchQueries[0]?.missingExactTerm).toBe('TypeScript');
    expect(full.knockoutStatus).toBe('AT_RISK');
    expect(full.verdictBreakdown.missedBooleanCount).toBe(1);
  });
});
