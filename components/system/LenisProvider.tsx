'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { lenisOptions, prefersReducedMotion, registerGsap } from '@/lib/motion';

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/**
 * Smooth-scroll provider. Lenis is driven by GSAP's ticker on ONE rAF loop and
 * kept in sync with ScrollTrigger. Disabled entirely under reduced-motion (native
 * scrolling) and paused while the tab is hidden, per the perf contract (brief §6).
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Reduced motion → native scroll, no smoothing, no rAF loop.
    if (prefersReducedMotion()) return;

    let lenis: Lenis | null = null;
    let cleanup = () => {};

    (async () => {
      const { gsap, ScrollTrigger } = await registerGsap();

      lenis = new Lenis(lenisOptions);
      lenis.on('scroll', ScrollTrigger.update);

      const onTick = (time: number) => {
        // GSAP ticker time is in seconds; Lenis expects milliseconds.
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      // Pause scroll work while the tab is backgrounded.
      const onVisibility = () => {
        if (document.hidden) lenis?.stop();
        else lenis?.start();
      };
      document.addEventListener('visibilitychange', onVisibility);

      // Intercept same-page anchor clicks → smooth-scroll via Lenis (offset for
      // the fixed header). Avoids native hash jumps fighting Lenis (snap-back).
      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey)
          return;
        const anchor = (e.target as HTMLElement | null)?.closest?.('a');
        const href = anchor?.getAttribute('href');
        if (!href || !href.includes('#')) return;
        const [path, id] = href.split('#');
        if (!id) return;
        // Only handle in-page targets that actually exist right now.
        if (path && path !== window.location.pathname) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const headerH = document.querySelector('header')?.clientHeight ?? 72;
        lenis?.scrollTo(target, { offset: -headerH - 8 });
        history.replaceState(null, '', `#${id}`);
      };
      document.addEventListener('click', onClick);

      window.__lenis = lenis;

      cleanup = () => {
        document.removeEventListener('visibilitychange', onVisibility);
        document.removeEventListener('click', onClick);
        gsap.ticker.remove(onTick);
        lenis?.destroy();
        window.__lenis = null;
      };
    })();

    return () => cleanup();
  }, []);

  return <>{children}</>;
}
