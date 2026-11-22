/**
 * Deterministic recruiter-Boolean exact-term checks.
 * Near-misses like TS vs TypeScript do not count as a match.
 */

const BOOLEAN_OP = /^(AND|OR)$/i;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** True when `term` appears in resume as an exact token/phrase (case-insensitive). */
export function resumeContainsExactTerm(resume: string, term: string): boolean {
  const trimmed = term.trim();
  if (!trimmed) return false;
  const pattern = new RegExp(
    `(?<![A-Za-z0-9])${escapeRegExp(trimmed)}(?![A-Za-z0-9])`,
    'i',
  );
  return pattern.test(resume);
}

function splitTopLevel(
  input: string,
  operator: 'AND' | 'OR',
): string[] {
  const parts: string[] = [];
  let depth = 0;
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < input.length; i++) {
    const ch = input[i] ?? '';
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
      continue;
    }
    if (!inQuotes) {
      if (ch === '(') depth += 1;
      if (ch === ')') depth = Math.max(0, depth - 1);
      if (depth === 0) {
        const rest = input.slice(i);
        const match = rest.match(
          operator === 'AND' ? /^AND\b/i : /^OR\b/i,
        );
        if (match?.[0]) {
          const piece = current.trim();
          if (piece.length > 0) parts.push(piece);
          current = '';
          i += match[0].length - 1;
          continue;
        }
      }
    }
    current += ch;
  }

  const tail = current.trim();
  if (tail.length > 0) parts.push(tail);
  return parts;
}

function unwrapParens(clause: string): string {
  let s = clause.trim();
  while (s.startsWith('(') && s.endsWith(')')) {
    const inner = s.slice(1, -1).trim();
    if (inner.length === 0) break;
    s = inner;
  }
  return s;
}

/** Pull a searchable term from a clause fragment (quoted or bare). */
export function extractTermToken(fragment: string): string | null {
  const s = unwrapParens(fragment).trim();
  if (!s || BOOLEAN_OP.test(s)) return null;

  const quoted = s.match(/^"([^"]+)"$/);
  if (quoted?.[1]) return quoted[1].trim();

  const embedded = s.match(/"([^"]+)"/);
  if (embedded?.[1]) return embedded[1].trim();

  const bare = s.replace(/[()]/g, '').trim();
  if (!bare || BOOLEAN_OP.test(bare)) return null;
  return bare;
}

/**
 * Parse a Boolean query into AND-groups of OR alternatives.
 * Example: `"TS" AND ("React" OR Next.js)` → [["TS"], ["React", "Next.js"]]
 */
export function parseBooleanAndGroups(query: string): string[][] {
  const andParts = splitTopLevel(query.trim(), 'AND');
  const groups: string[][] = [];

  for (const part of andParts) {
    const clause = unwrapParens(part);
    const orParts = splitTopLevel(clause, 'OR');
    const alternatives: string[] = [];
    for (const option of orParts) {
      const term = extractTermToken(option);
      if (term) alternatives.push(term);
    }
    if (alternatives.length > 0) groups.push(alternatives);
  }

  return groups;
}

export type BooleanEvalResult = {
  wouldMatch: boolean;
  missingExactTerm: string | null;
};

/** Evaluate whether every AND-group has at least one exact alternative in the resume. */
export function evaluateBooleanQuery(
  booleanQuery: string,
  resume: string,
): BooleanEvalResult {
  const groups = parseBooleanAndGroups(booleanQuery);
  if (groups.length === 0) {
    return { wouldMatch: false, missingExactTerm: null };
  }

  for (const alternatives of groups) {
    const hit = alternatives.some((term) =>
      resumeContainsExactTerm(resume, term),
    );
    if (!hit) {
      const missing = alternatives[0];
      return {
        wouldMatch: false,
        missingExactTerm: missing ?? null,
      };
    }
  }

  return { wouldMatch: true, missingExactTerm: null };
}

export type BooleanQueryFinding = {
  booleanQuery: string;
  wouldMatch: boolean;
  missingExactTerm: string | null;
};

/** Overwrite LLM Boolean flags with exact resume term checks. */
export function reconcileBooleanMatches<T extends {
  recruiterSearchQueries: BooleanQueryFinding[];
}>(findings: T, resume: string): T {
  return {
    ...findings,
    recruiterSearchQueries: findings.recruiterSearchQueries.map((query) => {
      const evaluated = evaluateBooleanQuery(query.booleanQuery, resume);
      return {
        booleanQuery: query.booleanQuery,
        wouldMatch: evaluated.wouldMatch,
        missingExactTerm: evaluated.missingExactTerm,
      };
    }),
  };
}
