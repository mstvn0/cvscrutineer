/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  attachForwardWheel,
  forwardWheelToAncestor,
  isVerticallyScrollable,
} from './forwardWheelScroll';

function mockScrollable(
  overflowY: string,
  scrollHeight: number,
  clientHeight: number,
): HTMLElement {
  const el = document.createElement('div');
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight });
  Object.defineProperty(el, 'clientHeight', { value: clientHeight });
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    overflowY,
  } as CSSStyleDeclaration);
  return el;
}

describe('isVerticallyScrollable', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is true for overflow auto with extra scroll height', () => {
    const el = mockScrollable('auto', 200, 100);
    expect(isVerticallyScrollable(el)).toBe(true);
  });

  it('is false when overflow is visible', () => {
    const el = mockScrollable('visible', 200, 100);
    expect(isVerticallyScrollable(el)).toBe(false);
  });

  it('is false when content fits', () => {
    const el = mockScrollable('auto', 100, 100);
    expect(isVerticallyScrollable(el)).toBe(false);
  });
});

describe('forwardWheelToAncestor', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('scrolls the nearest scrollable ancestor', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);
    Object.defineProperty(parent, 'scrollHeight', { value: 400 });
    Object.defineProperty(parent, 'clientHeight', { value: 100 });
    parent.scrollTop = 0;
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
      if (el === parent) {
        return { overflowY: 'auto' } as CSSStyleDeclaration;
      }
      return { overflowY: 'visible' } as CSSStyleDeclaration;
    });

    expect(forwardWheelToAncestor(child, 40)).toBe(true);
    expect(parent.scrollTop).toBe(40);
  });

  it('returns false when no scrollable ancestor exists', () => {
    const orphan = document.createElement('div');
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      overflowY: 'visible',
    } as CSSStyleDeclaration);
    expect(forwardWheelToAncestor(orphan, 20)).toBe(false);
  });
});

describe('attachForwardWheel', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('forwards wheel when the element cannot scroll', () => {
    const parent = document.createElement('div');
    const child = document.createElement('div');
    parent.appendChild(child);
    Object.defineProperty(parent, 'scrollHeight', { value: 400 });
    Object.defineProperty(parent, 'clientHeight', { value: 100 });
    Object.defineProperty(child, 'scrollHeight', { value: 50 });
    Object.defineProperty(child, 'clientHeight', { value: 50 });
    parent.scrollTop = 0;

    vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
      if (el === parent) {
        return { overflowY: 'auto' } as CSSStyleDeclaration;
      }
      return { overflowY: 'visible' } as CSSStyleDeclaration;
    });

    const detach = attachForwardWheel(child);
    const event = new WheelEvent('wheel', { deltaY: 25, bubbles: true });
    const prevent = vi.spyOn(event, 'preventDefault');
    child.dispatchEvent(event);

    expect(parent.scrollTop).toBe(25);
    expect(prevent).toHaveBeenCalled();
    detach();
  });
});
