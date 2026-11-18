import { describe, expect, it } from 'vitest';
import {
  SCRUTINIZE_STAGES,
  STAGE_ROTATION_MS,
  stageAtElapsed,
} from './loadingStages';

describe('stageAtElapsed', () => {
  it('starts on the first knockout stage', () => {
    expect(stageAtElapsed(0)).toBe(SCRUTINIZE_STAGES[0]);
  });

  it('rotates through all stages then wraps', () => {
    expect(stageAtElapsed(STAGE_ROTATION_MS)).toBe(SCRUTINIZE_STAGES[1]);
    expect(stageAtElapsed(STAGE_ROTATION_MS * 2)).toBe(SCRUTINIZE_STAGES[2]);
    expect(stageAtElapsed(STAGE_ROTATION_MS * 3)).toBe(SCRUTINIZE_STAGES[0]);
  });
});
