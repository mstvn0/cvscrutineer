import { reconcileBooleanMatches } from '@/lib/booleanMatch';
import type {
  AnalysisFindings,
  KnockoutStatus,
  VerdictBreakdown,
} from '@/lib/schemas/analysis';

export type VerdictResult = {
  knockoutStatus: KnockoutStatus;
  verdictBreakdown: VerdictBreakdown;
};

/**
 * Deterministic ATS gate classification from structured findings.
 *
 * LIKELY_REJECTED — any hard knockout failed (auto-reject before human review)
 * AT_RISK — no hard fails, but warnings, diluting sections, or Boolean misses
 * PASS — all knockouts met, no diluting vectors, all Boolean queries would match
 */
export function deriveVerdict(findings: AnalysisFindings): VerdictResult {
  const failedKnockoutCount = findings.knockoutRules.filter(
    (rule) => rule.status === 'failed',
  ).length;
  const warningKnockoutCount = findings.knockoutRules.filter(
    (rule) => rule.status === 'warning',
  ).length;
  const dilutingSectionCount = findings.semanticDriftAudit.filter(
    (row) => row.driftDiagnosis === 'Diluting Vector',
  ).length;
  const missedBooleanCount = findings.recruiterSearchQueries.filter(
    (query) => !query.wouldMatch,
  ).length;

  if (failedKnockoutCount > 0) {
    return {
      knockoutStatus: 'LIKELY_REJECTED',
      verdictBreakdown: {
        failedKnockoutCount,
        warningKnockoutCount,
        dilutingSectionCount,
        missedBooleanCount,
        classificationRule: `${failedKnockoutCount} hard knockout rule${failedKnockoutCount === 1 ? '' : 's'} failed — ATS would auto-reject before human review.`,
      },
    };
  }

  if (
    warningKnockoutCount > 0 ||
    dilutingSectionCount > 0 ||
    missedBooleanCount > 0
  ) {
    const drivers: string[] = [];
    if (warningKnockoutCount > 0) {
      drivers.push(
        `${warningKnockoutCount} knockout warning${warningKnockoutCount === 1 ? '' : 's'}`,
      );
    }
    if (dilutingSectionCount > 0) {
      drivers.push(
        `${dilutingSectionCount} diluting section${dilutingSectionCount === 1 ? '' : 's'}`,
      );
    }
    if (missedBooleanCount > 0) {
      drivers.push(
        `${missedBooleanCount} Boolean miss${missedBooleanCount === 1 ? '' : 'es'}`,
      );
    }

    return {
      knockoutStatus: 'AT_RISK',
      verdictBreakdown: {
        failedKnockoutCount,
        warningKnockoutCount,
        dilutingSectionCount,
        missedBooleanCount,
        classificationRule: `No hard knockout failures, but at risk due to ${drivers.join(', ')}.`,
      },
    };
  }

  return {
    knockoutStatus: 'PASS',
    verdictBreakdown: {
      failedKnockoutCount: 0,
      warningKnockoutCount: 0,
      dilutingSectionCount: 0,
      missedBooleanCount: 0,
      classificationRule:
        'All knockout rules met, no diluting sections, and every recruiter Boolean query would match.',
    },
  };
}

/**
 * Reconcile Boolean exact-term matches against the resume, then attach the
 * deterministic verdict gate.
 */
export function withDerivedVerdict(
  findings: AnalysisFindings,
  resume: string,
): AnalysisFindings & VerdictResult {
  const reconciled = reconcileBooleanMatches(findings, resume);
  return { ...reconciled, ...deriveVerdict(reconciled) };
}
