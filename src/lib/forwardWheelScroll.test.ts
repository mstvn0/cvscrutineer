/**
 * Minimal DOM stubs — avoids jsdom/undici, which crash on Node 20
 * (createZstdDecompress is undefined).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  attachForwardWheel,
  forwardWheelToAncestor,
  isVerticallyScrollable,
} from './forwardWheelScroll';

type Style = { overflowY: string };

class TestHTMLElement {
  parentElement: TestHTMLElement | null = null;
  scrollTop = 0;
  scrollHeight = 0;
  clientHeight = 0;
  #listeners = new Map<string, Set<(event: TestWheelEvent) => void>>();

  appendChild(child: TestHTMLElement): TestHTMLElement {
    child.parentElement = this;
    return child;
  }

  addEventListener(
    type: string,
    listener: (event: TestWheelEvent) => void,
  ): void {
    const set = this.#listeners.get(type) ?? new Set();
    set.add(listener);
    this.#listeners.set(type, set);
  }

  removeEventListener(
    type: string,
    listener: (event: TestWheelEvent) => void,
  ): void {
    this.#listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event: TestWheelEvent): boolean {
    const listeners = this.#listeners.get(event.type);
    if (!listeners) return true;
    for (const listener of listeners) {
      listener.call(this, event);
    }
    return true;
  }
}

type TestWheelEvent = {
  type: string;
  deltaY: number;
  ctrlKey: boolean;
  preventDefault: () => void;
  composedPath: () => TestHTMLElement[];
};

const styleByElement = new WeakMap<object, Style>();

function el(
  overflowY: string,
  scrollHeight: number,
  clientHeight: number,
): TestHTMLElement {
  const node = new TestHTMLElement();
  node.scrollHeight = scrollHeight;
  node.clientHeight = clientHeight;
  styleByElement.set(node, { overflowY });
  return node;
}

function asHtml(node: TestHTMLElement): HTMLElement {
  return node as unknown as HTMLElement;
}

beforeAll(() => {
  vi.stubGlobal('HTMLElement', TestHTMLElement);
  vi.stubGlobal('getComputedStyle', (node: object) => {
    return styleByElement.get(node) ?? { overflowY: 'visible' };
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('isVerticallyScrollable', () => {
  it('is true for overflow auto with extra scroll height', () => {
    expect(isVerticallyScrollable(asHtml(el('auto', 200, 100)))).toBe(true);
  });

  it('is false when overflow is visible', () => {
    expect(isVerticallyScrollable(asHtml(el('visible', 200, 100)))).toBe(
      false,
    );
  });

  it('is false when content fits', () => {
    expect(isVerticallyScrollable(asHtml(el('auto', 100, 100)))).toBe(false);
  });
});

describe('forwardWheelToAncestor', () => {
  it('scrolls the nearest scrollable ancestor', () => {
    const parent = el('auto', 400, 100);
    const child = el('visible', 50, 50);
    parent.appendChild(child);

    expect(forwardWheelToAncestor(asHtml(child), 40)).toBe(true);
    expect(parent.scrollTop).toBe(40);
  });

  it('returns false when no scrollable ancestor exists', () => {
    const orphan = el('visible', 50, 50);
    expect(forwardWheelToAncestor(asHtml(orphan), 20)).toBe(false);
  });
});

describe('attachForwardWheel', () => {
  it('forwards wheel when the element cannot scroll', () => {
    const parent = el('auto', 400, 100);
    const child = el('visible', 50, 50);
    parent.appendChild(child);

    const detach = attachForwardWheel(asHtml(child));
    const prevent = vi.fn();
    const event: TestWheelEvent = {
      type: 'wheel',
      deltaY: 25,
      ctrlKey: false,
      preventDefault: prevent,
      composedPath: () => [child, parent],
    };
    child.dispatchEvent(event);

    expect(parent.scrollTop).toBe(25);
    expect(prevent).toHaveBeenCalled();
    detach();
  });
});
