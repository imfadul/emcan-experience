'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { DURATION, EASE, prefersReducedMotion, registerGsap } from '@/lib/motion';

/** Chronological order of the milestones i18n keys (messages: milestones.items.*). */
const MILESTONE_IDS = [
  'pioneers',
  'foundation',
  'expansion',
  'epc',
  'sustainability',
  'iconic',
  'partnerships',
  'multidisciplinary',
  'today',
] as const;

/**
 * The company timeline, with a restrained scroll-driven treatment: a connecting
 * rail fills in step with scroll (same spine motif as the cinematic ProgressRail),
 * and each row settles in once as it scrolls into view. Static and fully visible
 * without JS or under prefers-reduced-motion — this is progressive enhancement,
 * not a requirement to read the timeline.
 */
export function Milestones() {
  const t = useTranslations('milestones');
  const listRef = useRef<HTMLOListElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let triggers: { kill: () => void }[] = [];

    (async () => {
      const { gsap, ScrollTrigger } = await registerGsap();
      if (cancelled || !listRef.current) return;

      // Wait for the page to fully load (fonts/images settled) before measuring
      // trigger positions — creating these against a not-yet-final layout has
      // caused them to fire immediately at the wrong (stale) coordinates. Uses
      // the `load` event rather than rAF: rAF does not fire in a backgrounded/
      // hidden tab, which would hang this forever, while `load` always fires.
      await new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
      });
      if (cancelled || !listRef.current) return;

      const items = itemRefs.current.filter((el): el is HTMLLIElement => el !== null);
      const dots = dotRefs.current.filter((el): el is HTMLSpanElement => el !== null);

      gsap.set(items, { autoAlpha: 0, y: 20 });
      gsap.set(dots, { scale: 0 });
      if (railRef.current) gsap.set(railRef.current, { scaleY: 0, transformOrigin: 'top center' });

      const created: ReturnType<typeof ScrollTrigger.create>[] = [];

      items.forEach((item, i) => {
        created.push(
          ScrollTrigger.create({
            trigger: item,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              gsap.to(item, { autoAlpha: 1, y: 0, duration: DURATION.base, ease: EASE.outExpo });
              const dot = dots[i];
              if (dot) gsap.to(dot, { scale: 1, duration: DURATION.fast, ease: EASE.outExpo });
            },
          }),
        );
      });

      if (railRef.current) {
        created.push(
          ScrollTrigger.create({
            trigger: listRef.current,
            start: 'top 75%',
            end: 'bottom 65%',
            scrub: 0.6,
            onUpdate: (self) => gsap.set(railRef.current, { scaleY: self.progress }),
          }),
        );
      }

      // Belt-and-braces: recalculate against final layout in case anything above
      // this section (the pinned cinematic track) shifted after these were created.
      ScrollTrigger.refresh();

      if (cancelled) {
        created.forEach((st) => st.kill());
        return;
      }
      triggers = created;
    })();

    return () => {
      cancelled = true;
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <section className="border-t border-line/10 bg-carbon">
      <div className="shell py-section">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="mt-4 text-headline font-bold">{t('title')}</h2>
        </div>

        <div className="relative mt-12">
          {/* Connecting rail — fills as the timeline scrolls through view. */}
          <div className="pointer-events-none absolute inset-y-0 start-[3px] w-px bg-line/10" aria-hidden>
            <div ref={railRef} className="h-full w-full bg-accent/70" />
          </div>

          <ol ref={listRef}>
            {MILESTONE_IDS.map((id, i) => (
              <li
                key={id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="grid gap-2 border-t border-line/10 py-6 first:border-t-0 sm:grid-cols-12 sm:items-baseline sm:gap-8"
              >
                <div className="flex items-center gap-3 sm:col-span-3">
                  <span
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    aria-hidden
                    className="relative z-10 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span className="font-mono text-sm tabular-nums text-accent">
                    {t(`items.${id}.year`)}
                  </span>
                </div>
                <div className="sm:col-span-9">
                  <h3 className="font-bold">{t(`items.${id}.title`)}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
                    {t(`items.${id}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
