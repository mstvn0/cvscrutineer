import type { DashboardTabId } from '@/lib/constants';
import type { AnalysisResult, VerdictBreakdown } from '@/lib/schemas/analysis';

export type GateMetricKey = keyof Pick<
  VerdictBreakdown,
  | 'failedKnockoutCount'
  | 'warningKnockoutCount'
  | 'dilutingSectionCount'
  | 'missedBooleanCount'
>;

export type KnockoutFocus = 'all' | 'failed' | 'warning';
export type DriftFocus = 'all' | 'diluting';
export type RecruiterFocus = 'all' | 'misses';

export type TabSeverity = {
  failed: number;
  warning: number;
  total: number;
};

/**
 * Open the tab that explains the worst open gate first.
 */
export function defaultDashboardTab(analysis: AnalysisResult): DashboardTabId {
  const { verdictBreakdown: v } = analysis;
  if (v.failedKnockoutCount > 0 || v.warningKnockoutCount > 0) {
    return 'knockouts';
  }
  if (v.dilutingSectionCount > 0) return 'drift';
  if (v.missedBooleanCount > 0) return 'recruiter';
  return 'knockouts';
}

export function tabSeverity(
  id: DashboardTabId,
  analysis: AnalysisResult,
): TabSeverity {
  switch (id) {
    case 'knockouts':
      return {
        failed: analysis.verdictBreakdown.failedKnockoutCount,
        warning: analysis.verdictBreakdown.warningKnockoutCount,
        total: analysis.knockoutRules.length,
      };
    case 'drift':
      return {
        failed: analysis.verdictBreakdown.dilutingSectionCount,
        warning: 0,
        total: analysis.semanticDriftAudit.length,
      };
    case 'recruiter':
      return {
        failed: analysis.verdictBreakdown.missedBooleanCount,
        warning: 0,
        total: analysis.recruiterSearchQueries.length,
      };
  }
}

export function navigationFromGate(key: GateMetricKey): {
  tab: DashboardTabId;
  knockoutFocus: KnockoutFocus;
  driftFocus: DriftFocus;
  recruiterFocus: RecruiterFocus;
} {
  switch (key) {
    case 'failedKnockoutCount':
      return {
        tab: 'knockouts',
        knockoutFocus: 'failed',
        driftFocus: 'all',
        recruiterFocus: 'all',
      };
    case 'warningKnockoutCount':
      return {
        tab: 'knockouts',
        knockoutFocus: 'warning',
        driftFocus: 'all',
        recruiterFocus: 'all',
      };
    case 'dilutingSectionCount':
      return {
        tab: 'drift',
        knockoutFocus: 'all',
        driftFocus: 'diluting',
        recruiterFocus: 'all',
      };
    case 'missedBooleanCount':
      return {
        tab: 'recruiter',
        knockoutFocus: 'all',
        driftFocus: 'all',
        recruiterFocus: 'misses',
      };
  }
}

/**
 * Human label when a gate metric has narrowed the results list.
 * Returns null when showing the unfiltered tab contents.
 */
export function activeFocusLabel(params: {
  tab: DashboardTabId;
  knockoutFocus: KnockoutFocus;
  driftFocus: DriftFocus;
  recruiterFocus: RecruiterFocus;
}): string | null {
  const { tab, knockoutFocus, driftFocus, recruiterFocus } = params;
  if (tab === 'knockouts' && knockoutFocus === 'failed') {
    return 'Showing failed knockouts only';
  }
  if (tab === 'knockouts' && knockoutFocus === 'warning') {
    return 'Showing knockout warnings only';
  }
  if (tab === 'drift' && driftFocus === 'diluting') {
    return 'Showing diluting sections only';
  }
  if (tab === 'recruiter' && recruiterFocus === 'misses') {
    return 'Showing Boolean misses only';
  }
  return null;
}
