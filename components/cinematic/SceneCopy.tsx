'use client';

import Image from 'next/image';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { EASE, loadScene } from '@/lib/motion';

export interface SceneHandle {
  /** Play the reveal in (true) or reverse it out (false). */
  setActive: (active: boolean) => void;
  /** Snap to fully hidden with no animation (for chapters skipped during a fast scroll). */
  hideInstantly?: () => void;
}

type SplitInstance = { lines: HTMLElement[]; revert: () => void };

export interface SceneCopyProps {
  kicker: string;
  company: string;
  title: string;
  body: string;
  accentRgb: string;
  /** Optional company logo revealed "on a sign/plate" within the scene. */
  logo?: { src: string; alt: string };
}

/**
 * One cinematic chapter's copy. The title reveals line-by-line behind masks
 * (SplitText), kicker/company/body settle in, and the company logo settles onto a
 * placeholder plate — all transform/opacity/clip only. Driven imperatively by the
 * stage on chapter change, so there are no per-frame React renders.
 */
export const SceneCopy = forwardRef<SceneHandle, SceneCopyProps>(function SceneCopy(
  { kicker, company, title, body, accentRgb, logo },
  ref,
) {
  const t = useTranslations('cinematic');
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const companyRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const wantActive = useRef(false);

  useImperativeHandle(ref, () => ({
    setActive: (active: boolean) => {
      wantActive.current = active;
      const tl = tlRef.current;
      if (!tl) return;
      // Reverse (exit) plays faster than the reveal so an outgoing chapter
      // clears well before a slow scroll settles on the next one.
      tl.timeScale(active ? 1 : 2.5);
      if (active) tl.play();
      else tl.reverse();
    },
    hideInstantly: () => {
      wantActive.current = false;
      tlRef.current?.pause(0);
    },
  }));

  useEffect(() => {
    let cancelled = false;
    let split: SplitInstance | null = null;

    (async () => {
      // Wait for fonts so SplitText measures line breaks correctly.
      if (document.fonts?.ready) await document.fonts.ready;
      if (cancelled || !titleRef.current) return;
      const { gsap, SplitText } = await loadScene();
      if (cancelled || !titleRef.current) return;

      split = new SplitText(titleRef.current, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'overflow-hidden',
      }) as unknown as SplitInstance;

      // logoRef only mounts when `logo` is passed — filter it out otherwise so GSAP
      // isn't handed a null target (harmless, but noisy in the console).
      const supporting = [
        kickerRef.current,
        companyRef.current,
        bodyRef.current,
        logoRef.current,
      ].filter((el): el is NonNullable<typeof el> => el !== null);
      gsap.set(supporting, { autoAlpha: 0, y: 18 });
      gsap.set(split.lines, { yPercent: 115 });

      const tl = gsap.timeline({ paused: true });
      tl.to(kickerRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.outExpo })
        .to(companyRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.outExpo }, '<0.06')
        .to(
          split.lines,
          { yPercent: 0, duration: 0.9, stagger: 0.09, ease: EASE.outExpo },
          '<0.05',
        )
        .to(bodyRef.current, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.outExpo }, '-=0.45');
      if (logoRef.current) {
        tl.to(
          logoRef.current,
          { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.outExpo },
          '-=0.3',
        );
      }

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
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-gutter top-1/2 max-w-2xl -translate-y-1/2 border-s-2 ps-6" style={{ borderColor: `rgb(${accentRgb})` }}>
        <p
          ref={kickerRef}
          className="text-xs font-semibold uppercase tracking-eyebrow"
          style={{ opacity: 0, color: `rgb(${accentRgb})` }}
        >
          {kicker}
        </p>
        <p ref={companyRef} className="mt-2 text-sm text-muted" style={{ opacity: 0 }}>
          {company}
        </p>
        <h2 ref={titleRef} className="mt-4 text-headline font-bold">
          {title}
        </h2>
        <p
          ref={bodyRef}
          className="mt-4 max-w-xl text-base leading-relaxed text-mist md:text-lg"
          style={{ opacity: 0 }}
        >
          {body}
        </p>
      </div>

      {logo && (
        <div
          ref={logoRef}
          style={{ opacity: 0 }}
          className="absolute bottom-[12%] end-[var(--gutter)] hidden w-44 rounded border border-line/15 bg-ink/40 p-4 backdrop-blur-sm sm:block"
        >
          <span className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `rgb(${accentRgb})` }} />
            <span className="text-[0.6rem] uppercase tracking-eyebrow text-muted">{t('signage')}</span>
          </span>
          <Image
            src={logo.src}
            alt={logo.alt}
            width={400}
            height={220}
            sizes="176px"
            className="h-auto w-full [filter:brightness(0)_invert(1)]"
          />
        </div>
      )}
    </div>
  );
});
