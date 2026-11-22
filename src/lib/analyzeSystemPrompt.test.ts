import { describe, expect, it } from 'vitest';
import { ANALYZE_SYSTEM_PROMPT } from './analyzeSystemPrompt';

describe('ANALYZE_SYSTEM_PROMPT', () => {
  it('requires paste-ready draftText separate from advice', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/draftText/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/paste-ready/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/NOT what Copy pastes/i);
  });

  it('requires draftText to rewrite an actual resume entry', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/concrete resume entry/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /traceable to actual resume facts/i,
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

  it('asks for natural coach-style Fix-it advice, not a rigid template', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/or a rigid template/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /Spell out TypeScript on your Skills line/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /No required "If you have/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /what would you want to hear if this were your resume/i,
    );
  });

  it('forbids stuffing JD jargon into experience headers', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/Do NOT rewrite job\/experience headers/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/0-1 Growth Initiatives/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/Keep headers as normal Title/i);
  });

  it('routes role scope/domain wording into a bullet under that title', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /Prefer a suggested bullet under a specific title when confident/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/wouldMatch=false/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /"TypeScript" does not match "TS"/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).not.toMatch(/wouldAppearOnPage1/i);
    expect(ANALYZE_SYSTEM_PROMPT).not.toMatch(/[Pp]age[\s-]?1/);
  });

  it('still suggests Fix-its when placement is unclear and leaves choice to the user', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /Check which experience truly fits 0-to-1 for you/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /ALWAYS set fixItSuggestion/i,
    );
  });

  it('asks the uploader to decide if a framing near-miss term suits them', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/uploader UX/i);
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /Do NOT bury cues in mid-sentence/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /new checkout upsell module bullet is close to what they call 0-to-1/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /Check if 0-to-1 actually suits your experience/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /if you decide that it does, rewrite it/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /uploader must decide applicability/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /Never end with empty outs that only tell them to skip/i,
    );
  });

  it('requires Fix-its on warning near-miss knockouts without assuming the term fits', () => {
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /warning = partial \/ synonym-only \/ ambiguous evidence/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /new checkout upsell module" near "0-to-1 product ownership/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(
      /ALWAYS set fixItSuggestion that invites the uploader/i,
    );
    expect(ANALYZE_SYSTEM_PROMPT).toMatch(/never assume it does/i);
    expect(ANALYZE_SYSTEM_PROMPT).not.toMatch(
      /warning = partial \/ synonym-only \/ ambiguous evidence; fixItSuggestion = null/,
    );
  });
});
