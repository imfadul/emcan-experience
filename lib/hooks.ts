'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Tracks page scroll: `scrolled` (past a small threshold) and `progress` (0..1).
 * rAF-throttled and passive. Works with Lenis active (it drives window scroll)
 * and with native scrolling under reduced-motion.
 */
export function useScrollProgress(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > threshold);
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return { scrolled, progress };
}

/** Locks background scroll while `active` (also pauses Lenis). Restores on cleanup. */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    window.__lenis?.stop();
    return () => {
      root.style.overflow = previous;
      window.__lenis?.start();
    };
  }, [active]);
}

/**
 * Traps Tab focus within `ref` while `active`. Focuses the first focusable on
 * activation and restores focus to the previously-focused element on teardown.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    restoreRef.current = document.activeElement as HTMLElement | null;

    const selector =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focusables = () =>
      Array.from(el.querySelectorAll<HTMLElement>(selector)).filter(
        (n) => n.offsetParent !== null,
      );

    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    el.addEventListener('keydown', onKeyDown);
    return () => {
      el.removeEventListener('keydown', onKeyDown);
      restoreRef.current?.focus?.();
    };
  }, [active, ref]);
}
