/** True when the element is a vertical scrollport with overflow. */
export function isVerticallyScrollable(el: HTMLElement): boolean {
  const { overflowY } = getComputedStyle(el);
  if (overflowY !== 'auto' && overflowY !== 'scroll' && overflowY !== 'overlay') {
    return false;
  }
  return el.scrollHeight > el.clientHeight + 4;
}

/** Scroll the nearest scrollable ancestor by deltaY. */
export function forwardWheelToAncestor(
  from: HTMLElement,
  deltaY: number,
): boolean {
  let parent = from.parentElement;
  while (parent) {
    if (isVerticallyScrollable(parent)) {
      parent.scrollTop += deltaY;
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}

/**
 * If `el` (and nested targets under the pointer) cannot scroll vertically,
 * forward wheel deltas to the nearest scrollable ancestor.
 */
export function attachForwardWheel(el: HTMLElement): () => void {
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.deltaY === 0) return;

    for (const node of event.composedPath()) {
      if (!(node instanceof HTMLElement)) continue;
      if (node === el) break;
      if (isVerticallyScrollable(node)) return;
    }

    if (isVerticallyScrollable(el)) return;

    if (forwardWheelToAncestor(el, event.deltaY)) {
      event.preventDefault();
    }
  };

  el.addEventListener('wheel', onWheel, { passive: false });
  return () => el.removeEventListener('wheel', onWheel);
}
