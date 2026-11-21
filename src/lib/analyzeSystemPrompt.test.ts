import { describe, expect, it } from 'vitest';
import { ANALYZE_SYSTEM_PROMPT } from './analyzeSystemPrompt';

describe('ANALYZE_SYSTEM_PROMPT', () => {
  it('requires paste-ready draftText separate from advice', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/draftText/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/paste-ready/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/NOT what the user copies/i);
  });

  it('requires draftText to rewrite an actual resume entry', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/concrete resume entry/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /traceable to an actual resume entry/i,
    );
  });

  it('requires keyword swaps to replace only the target token', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/ONLY that target token replaced/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/Do not reorder, rephrase/i);
  });

  it('prefers JD/ATS rewording over removal for Diluting Vector fix-its', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/Diluting Vector/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/salvageable overlap/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/Never invent/i);
  });
});
