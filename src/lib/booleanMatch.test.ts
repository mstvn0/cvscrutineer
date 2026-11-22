import { describe, expect, it } from 'vitest';
import {
  evaluateBooleanQuery,
  parseBooleanAndGroups,
  reconcileBooleanMatches,
  resumeContainsExactTerm,
} from './booleanMatch';

describe('resumeContainsExactTerm', () => {
  it('matches exact TypeScript but not TS alone', () => {
    expect(resumeContainsExactTerm('Skills: TypeScript, React', 'TypeScript')).toBe(
      true,
    );
    expect(resumeContainsExactTerm('Skills: JS/TS, React', 'TypeScript')).toBe(
      false,
    );
    expect(resumeContainsExactTerm('Skills: JS/TS, React', 'TS')).toBe(true);
  });

  it('does not treat TypeScript as containing TS as a standalone term match for TypeScript search', () => {
    expect(resumeContainsExactTerm('TypeScript expert', 'TS')).toBe(false);
  });

  it('matches hyphenated phrases like 0-to-1', () => {
    expect(
      resumeContainsExactTerm('Led 0-to-1 product ownership', '0-to-1'),
    ).toBe(true);
    expect(
      resumeContainsExactTerm('Led zero to one ownership', '0-to-1'),
    ).toBe(false);
  });
});

describe('parseBooleanAndGroups', () => {
  it('parses quoted AND with OR group', () => {
    expect(
      parseBooleanAndGroups(
        '"TypeScript" AND "Next.js" AND ("payments" OR "fintech")',
      ),
    ).toEqual([['TypeScript'], ['Next.js'], ['payments', 'fintech']]);
  });

  it('parses bare tokens', () => {
    expect(parseBooleanAndGroups('SQL AND PM')).toEqual([['SQL'], ['PM']]);
  });
});

describe('evaluateBooleanQuery', () => {
  const resume =
    'Senior Frontend Engineer. Stack: JS/TS, React, Next.js. Built billing UI.';

  it('fails when TypeScript is required but only TS is present', () => {
    const result = evaluateBooleanQuery(
      '"TypeScript" AND "React" AND "Next.js"',
      resume,
    );
    expect(result.wouldMatch).toBe(false);
    expect(result.missingExactTerm).toBe('TypeScript');
  });

  it('passes when every AND group is satisfied including OR', () => {
    const withTs = `${resume} TypeScript`;
    const result = evaluateBooleanQuery(
      '"TypeScript" AND "Next.js" AND ("payments" OR "billing")',
      withTs,
    );
    expect(result).toEqual({ wouldMatch: true, missingExactTerm: null });
  });

  it('fails OR group when no alternative is present', () => {
    const result = evaluateBooleanQuery(
      '"React" AND ("payments" OR "fintech")',
      'React and Next.js marketing site',
    );
    expect(result.wouldMatch).toBe(false);
    expect(result.missingExactTerm).toBe('payments');
  });
});

describe('reconcileBooleanMatches', () => {
  it('overrides LLM wouldMatch when exact terms are missing', () => {
    const findings = {
      recruiterSearchQueries: [
        {
          booleanQuery: '"TypeScript" AND "React"',
          wouldMatch: true,
          missingExactTerm: null,
        },
      ],
    };
    const reconciled = reconcileBooleanMatches(
      findings,
      'Skills: JS/TS, React',
    );
    expect(reconciled.recruiterSearchQueries[0]).toEqual({
      booleanQuery: '"TypeScript" AND "React"',
      wouldMatch: false,
      missingExactTerm: 'TypeScript',
    });
  });
});
