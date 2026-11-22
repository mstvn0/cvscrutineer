'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { attachForwardWheel } from '@/lib/forwardWheelScroll';

type ScrollHintPanelProps = {
  children: ReactNode;
  'aria-label'?: string;
  className?: string;
  onScrollTopReady?: (scrollToTop: () => void) => void;
};

export function ScrollHintPanel({
  children,
  'aria-label': ariaLabel,
  className = '',
  onScrollTopReady,
}: ScrollHintPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  const updateHints = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const hasOverflow = maxScroll > 4;
    setCanScrollUp(hasOverflow && el.scrollTop > 4);
    setCanScrollDown(hasOverflow && el.scrollTop < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScrollTop = () => {
      el.scrollTop = 0;
      updateHints();
    };
    onScrollTopReady?.(onScrollTop);

    const schedule = () => {
      requestAnimationFrame(() => {
        updateHints();
        requestAnimationFrame(updateHints);
      });
    };

    schedule();

    const detachWheel = attachForwardWheel(el);

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(el);
    if (el.parentElement) {
      resizeObserver.observe(el.parentElement);
    }
    if (el.firstElementChild) {
      resizeObserver.observe(el.firstElementChild);
    }

    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);

    return () => {
      detachWheel();
      resizeObserver.disconnect();
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
    };
  }, [onScrollTopReady, updateHints, children]);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    void event;
    updateHints();
  }

  function scrollForMore() {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ top: Math.max(120, el.clientHeight * 0.55), behavior: 'smooth' });
  }

  return (
    <div
      className={`relative min-h-0 min-w-0 flex-1 max-lg:h-auto max-lg:flex-none ${className}`}
    >
      {canScrollUp ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-8 bg-gradient-to-b from-[#09090b] to-transparent lg:block"
          aria-hidden
        />
      ) : null}

      <div
        ref={ref}
        role="tabpanel"
        aria-label={ariaLabel}
        onScroll={handleScroll}
        className={`min-h-0 overflow-x-hidden pr-1 [scrollbar-width:thin] max-lg:h-auto max-lg:overflow-y-visible max-lg:overscroll-auto lg:h-full lg:overflow-y-auto lg:overscroll-y-contain lg:[scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-track]:bg-zinc-900 ${
          canScrollDown ? 'lg:pb-14' : 'pb-1'
        }`}
      >
        {children}
      </div>

      {canScrollDown ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden flex-col items-center justify-end pb-1 lg:flex">
          <div
            className="h-12 w-full bg-gradient-to-t from-[#09090b] via-[#09090b]/95 to-transparent"
            aria-hidden
          />
          <button
            type="button"
            onClick={scrollForMore}
            className="pointer-events-auto absolute bottom-2 inline-flex items-center gap-1 rounded-full border border-zinc-600 bg-zinc-900/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-200 shadow-lg shadow-black/40 transition hover:border-zinc-400 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            aria-label="Scroll for more results"
          >
            <ChevronDown className="h-3 w-3 animate-bounce" aria-hidden />
            Scroll for more
          </button>
        </div>
      ) : null}
    </div>
  );
}
