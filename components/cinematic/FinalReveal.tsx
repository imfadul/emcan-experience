'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { EASE, loadScene } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import type { SceneHandle } from './SceneCopy';

type SplitInstance = { lines: HTMLElement[]; revert: () => void };

// The four subsidiary colours, in the brandmark's bar order.
const BARS = ['41,150,23', '105,170,221', '216,169,58', '221,190,108'];

/**
 * Final group reveal: the four companies resolve as one ecosystem (the brandmark's
 * four bars assemble), the headline reveals line-by-line, and the CTAs settle in.
 */
export const FinalReveal = forwardRef<SceneHandle>(function FinalReveal(_props, ref) {
  const t = useTranslations('cinematic');
  const tcm = useTranslations('common');

  const rootRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const wantActive = useRef(false);

  useImperativeHandle(ref, () => ({
    setActive: (active: boolean) => {
      wantActive.current = active;
      if (rootRef.current) rootRef.current.style.pointerEvents = active ? 'auto' : 'none';
      const tl = tlRef.current;
      if (tl) {
        if (active) tl.play();
        else tl.reverse();
      }
    },
  }));

  useEffect(() => {
    let cancelled = false;
    let split: SplitInstance | null = null;

    (async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      if (cancelled || !titleRef.current) return;
      const { gsap, SplitText } = await loadScene();
      if (cancelled || !titleRef.current) return;

      split = new SplitText(titleRef.current, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'overflow-hidden',
      }) as unknown as SplitInstance;

      const bars = barsRef.current ? Array.from(barsRef.current.children) : [];
      gsap.set(bars, { scaleY: 0, transformOrigin: 'bottom center' });
      gsap.set([taglineRef.current, ctaRef.current], { autoAlpha: 0, y: 18 });
      gsap.set(split.lines, { yPercent: 115 });

      const tl = gsap.timeline({ paused: true });
      tl.to(bars, { scaleY: 1, duration: 0.6, stagger: 0.08, ease: EASE.outExpo })
        .to(split.lines, { yPercent: 0, duration: 0.9, stagger: 0.1, ease: EASE.outExpo }, '-=0.2')
        .to(taglineRef.current, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.outExpo }, '-=0.4')
        .to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.outExpo }, '-=0.35');

      tlRef.current = tl;
      if (wantActive.current) tl.play();
    })();

    return () => {
      cancelled = true;
      tlRef.current?.kill();
      split?.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      style={{ pointerEvents: 'none' }}
      className="absolute inset-0 flex items-center justify-center text-center"
    >
      <div className="shell">
        <div ref={barsRef} className="mx-auto mb-8 flex h-10 w-24 items-end justify-center gap-1.5">
          {BARS.map((rgb) => (
            <span
              key={rgb}
              className="h-full w-3 rounded-sm"
              style={{ backgroundColor: `rgb(${rgb})` }}
            />
          ))}
        </div>
        <h2 ref={titleRef} className="mx-auto max-w-3xl text-display-2 font-extrabold">
          {t('reveal.title')}
        </h2>
        <p ref={taglineRef} className="eyebrow mt-6 text-accent" style={{ opacity: 0 }}>
          {t('reveal.tagline')}
        </p>
        <div
          ref={ctaRef}
          style={{ opacity: 0 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Button href="/#companies" size="lg">
            {tcm('exploreCompanies')}
          </Button>
          <Button href="/#contact" size="lg" variant="outline">
            {tcm('discussProject')}
          </Button>
        </div>
      </div>
    </div>
  );
});
