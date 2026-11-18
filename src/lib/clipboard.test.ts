import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './clipboard';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('copyToClipboard', () => {
  it('returns false for empty values', async () => {
    expect(await copyToClipboard('')).toBe(false);
  });

  it('returns true when clipboard write succeeds', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    expect(await copyToClipboard('TypeScript')).toBe(true);
  });

  it('returns false when clipboard write fails', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    expect(await copyToClipboard('TypeScript')).toBe(false);
  });
});
