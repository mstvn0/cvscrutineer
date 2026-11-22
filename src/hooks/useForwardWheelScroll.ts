'use client';

import { useEffect, useRef } from 'react';
import { attachForwardWheel } from '@/lib/forwardWheelScroll';

/** Attach wheel-forwarding so nested non-scroll regions still move the page. */
export function useForwardWheelScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return attachForwardWheel(el);
  }, []);

  return ref;
}
