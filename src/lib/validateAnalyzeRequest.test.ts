import { describe, expect, it } from 'vitest';
import {
  MAX_ANALYZE_CHARS,
  MIN_ANALYZE_CHARS,
  validateAnalyzeRequest,
} from './validateAnalyzeRequest';

function pad(length: number): string {
  return 'a'.repeat(length);
}

describe('validateAnalyzeRequest', () => {
  it('accepts valid trimmed resume and job description', () => {
    const resume = `  ${pad(MIN_ANALYZE_CHARS)}  `;
    const jobDescription = `  ${pad(MIN_ANALYZE_CHARS + 10)}  `;
    const result = validateAnalyzeRequest({ resume, jobDescription });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.resume).toBe(pad(MIN_ANALYZE_CHARS));
      expect(result.data.jobDescription).toBe(pad(MIN_ANALYZE_CHARS + 10));
    }
  });

  it('rejects non-object bodies', () => {
    expect(validateAnalyzeRequest(null).ok).toBe(false);
    expect(validateAnalyzeRequest('oops').ok).toBe(false);
    expect(validateAnalyzeRequest([]).ok).toBe(false);
    const result = validateAnalyzeRequest(null);
    if (!result.ok) {
      expect(result.error).toBe('Request body must be a JSON object.');
    }
  });

  it('rejects non-string fields', () => {
    const result = validateAnalyzeRequest({
      resume: 123,
      jobDescription: pad(MIN_ANALYZE_CHARS),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('must be strings');
    }
  });

  it('rejects empty / whitespace-only strings', () => {
    const result = validateAnalyzeRequest({
      resume: '   ',
      jobDescription: pad(MIN_ANALYZE_CHARS),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('cannot be empty');
    }
  });

  it('rejects strings under the minimum length', () => {
    const result = validateAnalyzeRequest({
      resume: pad(MIN_ANALYZE_CHARS - 1),
      jobDescription: pad(MIN_ANALYZE_CHARS),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain(`at least ${MIN_ANALYZE_CHARS}`);
    }
  });

  it('rejects strings over the maximum length', () => {
    const result = validateAnalyzeRequest({
      resume: pad(MAX_ANALYZE_CHARS + 1),
      jobDescription: pad(MIN_ANALYZE_CHARS),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('under');
    }
  });

  it('accepts boundary lengths (min and max)', () => {
    const minOk = validateAnalyzeRequest({
      resume: pad(MIN_ANALYZE_CHARS),
      jobDescription: pad(MIN_ANALYZE_CHARS),
    });
    const maxOk = validateAnalyzeRequest({
      resume: pad(MAX_ANALYZE_CHARS),
      jobDescription: pad(MAX_ANALYZE_CHARS),
    });
    expect(minOk.ok).toBe(true);
    expect(maxOk.ok).toBe(true);
  });
});
