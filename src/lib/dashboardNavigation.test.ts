import { describe, expect, it } from 'vitest';
import {
  activeFocusLabel,
  defaultDashboardTab,
  navigationFromGate,
  tabSeverity,
} from './dashboardNavigation';
import type { AnalysisResult } from './schemas/analysis';

function analysis(
  overrides: Partial<AnalysisResult['verdictBreakdown']> = {},
): AnalysisResult {
  return {
    executiveSummary: 'One. Two.',
    atsParsedProfile: {
      detectedPrimaryTitle: 'Engineer',
      calculatedRelevantYears: 5,
      seniorityClassification: 'Senior',
      parserWarnings: [],
    },
    knockoutRules: [
      {
        rule: 'TS',
        category: 'Core Tech / Domain',
        status: 'met',
        evidenceOrGap: 'ok',
        fixItSuggestion: null,
      },
    ],
    semanticDriftAudit: [
      {
        resumeSectionOrRole: 'FE',
        driftDiagnosis: 'High Signal',
        actionAdvice: 'Keep',
        fixItSuggestion: null,
      },
    ],
    recruiterSearchQueries: [
      {
        booleanQuery: '"React"',
        wouldAppearOnPage1: true,
        missingExactTerm: null,
      },
    ],
    knockoutStatus: 'PASS',
    verdictBreakdown: {
      failedKnockoutCount: 0,
      warningKnockoutCount: 0,
      dilutingSectionCount: 0,
      missedBooleanCount: 0,
      classificationRule: 'All clear.',
      ...overrides,
    },
  };
}

describe('defaultDashboardTab', () => {
  it('prefers knockouts when hard fails exist', () => {
    expect(
      defaultDashboardTab(analysis({ failedKnockoutCount: 2 })),
    ).toBe('knockouts');
  });

  it('prefers knockouts for warnings before drift', () => {
    expect(
      defaultDashboardTab(
        analysis({ warningKnockoutCount: 1, dilutingSectionCount: 3 }),
      ),
    ).toBe('knockouts');
  });

  it('prefers drift when only diluting sections are open', () => {
    expect(
      defaultDashboardTab(analysis({ dilutingSectionCount: 1 })),
    ).toBe('drift');
  });

  it('prefers recruiter when only Boolean misses are open', () => {
    expect(
      defaultDashboardTab(analysis({ missedBooleanCount: 2 })),
    ).toBe('recruiter');
  });

  it('defaults to knockouts when all gates are clear', () => {
    expect(defaultDashboardTab(analysis())).toBe('knockouts');
  });
});

describe('navigationFromGate', () => {
  it('routes failed knockouts to the knockouts failed filter', () => {
    expect(navigationFromGate('failedKnockoutCount')).toEqual({
      tab: 'knockouts',
      knockoutFocus: 'failed',
      driftFocus: 'all',
      recruiterFocus: 'all',
    });
  });

  it('routes diluting sections to the drift diluting filter', () => {
    expect(navigationFromGate('dilutingSectionCount').tab).toBe('drift');
    expect(navigationFromGate('dilutingSectionCount').driftFocus).toBe(
      'diluting',
    );
  });

  it('routes Boolean misses to the recruiter misses filter', () => {
    expect(navigationFromGate('missedBooleanCount')).toMatchObject({
      tab: 'recruiter',
      recruiterFocus: 'misses',
    });
  });
});

describe('tabSeverity', () => {
  it('surfaces failed and warning counts for knockouts', () => {
    const result = tabSeverity(
      'knockouts',
      analysis({ failedKnockoutCount: 2, warningKnockoutCount: 1 }),
    );
    expect(result).toEqual({ failed: 2, warning: 1, total: 1 });
  });
});

describe('activeFocusLabel', () => {
  it('returns null for unfiltered views', () => {
    expect(
      activeFocusLabel({
        tab: 'knockouts',
        knockoutFocus: 'all',
        driftFocus: 'all',
        recruiterFocus: 'all',
      }),
    ).toBeNull();
  });

  it('labels each narrowed gate filter', () => {
    expect(
      activeFocusLabel({
        tab: 'knockouts',
        knockoutFocus: 'failed',
        driftFocus: 'all',
        recruiterFocus: 'all',
      }),
    ).toMatch(/failed/i);
    expect(
      activeFocusLabel({
        tab: 'drift',
        knockoutFocus: 'all',
        driftFocus: 'diluting',
        recruiterFocus: 'all',
      }),
    ).toMatch(/diluting/i);
    expect(
      activeFocusLabel({
        tab: 'recruiter',
        knockoutFocus: 'all',
        driftFocus: 'all',
        recruiterFocus: 'misses',
      }),
    ).toMatch(/boolean/i);
  });
});
