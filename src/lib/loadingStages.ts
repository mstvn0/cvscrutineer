export const SCRUTINIZE_STAGES = [
  'Extracting hidden JD knockout rules...',
  'Measuring section vector drift...',
  'Simulating recruiter Boolean searches...',
] as const;

export type ScrutinizeStage = (typeof SCRUTINIZE_STAGES)[number];

export const STAGE_ROTATION_MS = 1400;

export function stageAtElapsed(elapsedMs: number): ScrutinizeStage {
  const index =
    Math.floor(elapsedMs / STAGE_ROTATION_MS) % SCRUTINIZE_STAGES.length;
  return (
    SCRUTINIZE_STAGES[index] ?? 'Extracting hidden JD knockout rules...'
  );
}
