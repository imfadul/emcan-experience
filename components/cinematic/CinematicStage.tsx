'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CINEMATIC_CHAPTERS, COMPANIES, type CompanyId } from '@/lib/config';
import { ACCENT_RGB, bandForProgress, createFrameSource, type FrameSource } from '@/lib/cinematic';
import { registerGsap } from '@/lib/motion';
import { useLockBodyScroll } from '@/lib/hooks';
import { LoadingScreen } from '@/components/system/LoadingScreen';
import { ScrollCanvas, type ScrollCanvasHandle } from './ScrollCanvas';
import { ProgressRail, type RailItem } from './ProgressRail';
import { SceneCopy, type SceneHandle } from './SceneCopy';
import { RamaDashboard, type RamaDashboardHandle } from './RamaDashboard';
import { FinalReveal } from './FinalReveal';

const N = CINEMATIC_CHAPTERS.length;
const REVEAL_ACCENT = ACCENT_RGB.beige;

type STInstance = { start: number; end: number; kill: () => void };

const COMPANY_LOGO = Object.fromEntries(COMPANIES.map((c) => [c.id, c.logo])) as Record<
  CompanyId,
  string
>;

export function CinematicStage() {
  const t = useTranslations('cinematic');

  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
    [],
  );
  const sources = useMemo<FrameSource[]>(
    () => CINEMATIC_CHAPTERS.map((c) => createFrameSource(c, isMobile)),
    [isMobile],
  );

  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<ScrollCanvasHandle>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(SceneHandle | null)[]>([]);
  const ramaRef = useRef<RamaDashboardHandle | null>(null);
  const finalRef = useRef<SceneHandle | null>(null);
  const stRef = useRef<STInstance | null>(null);
  const prevActiveRef = useRef(0);

  useLockBodyScroll(!entered);

  // Preload chapter 1 only; lazy-load the rest (brief §6).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await sources[0]?.ensureLoaded((p) => !cancelled && setLoadProgress(p));
      if (cancelled) return;
      setReady(true);
      canvasRef.current?.draw(0);
      for (let i = 1; i < sources.length; i++) {
        if (cancelled) break;
        await sources[i]?.ensureLoaded();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sources]);

  // Per-frame scrub update — canvas + spine only (no React renders here).
  const onScroll = useCallback((p: number) => {
    canvasRef.current?.draw(p);
    if (spineRef.current) spineRef.current.style.transform = `scaleY(${p})`;
    const { index, reveal } = bandForProgress(p, N);
    const a = reveal ? N : index;
    setActive((prev) => (prev === a ? prev : a));
  }, []);

  // Drive scene reveals + accent atmosphere on chapter change (infrequent).
  useEffect(() => {
    const prev = prevActiveRef.current;
    for (let i = 0; i < N; i++) {
      if (i === active) sceneRefs.current[i]?.setActive(true);
      else if (i === prev) sceneRefs.current[i]?.setActive(false);
      // A fast scroll can skip several bands in one update; anything further
      // back than the immediately-previous chapter snaps to hidden instead of
      // animating out, so at most two chapters are ever visible at once.
      else sceneRefs.current[i]?.hideInstantly?.();
    }
    prevActiveRef.current = active;
    ramaRef.current?.setActive(CINEMATIC_CHAPTERS[active]?.id === 'control');
    finalRef.current?.setActive(active >= N);
    const accent = active >= N ? REVEAL_ACCENT : ACCENT_RGB[CINEMATIC_CHAPTERS[active]!.accent];
    stageRef.current?.style.setProperty('--scene-accent', accent);
  }, [active]);

  // ScrollTrigger drives progress (CSS sticky handles pinning — robust on iOS).
  useEffect(() => {
    if (!ready) return;
    let cleanup = () => {};
    registerGsap().then(({ ScrollTrigger }) => {
      if (!trackRef.current) return;
      const st = ScrollTrigger.create({
        trigger: trackRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => onScroll(self.progress),
      });
      stRef.current = st as unknown as STInstance;
      onScroll(0);
      ScrollTrigger.refresh();
      cleanup = () => st.kill();
    });
    return () => cleanup();
  }, [ready, onScroll]);

  const seek = useCallback((i: number) => {
    const st = stRef.current;
    if (!st) return;
    const target = st.start + ((i + 0.35) / (N + 1)) * (st.end - st.start);
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.2 });
    else window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  const railItems: RailItem[] = useMemo(
    () =>
      CINEMATIC_CHAPTERS.map((c) => ({
        id: c.id,
        kicker: t(`chapters.${c.id}.kicker`),
        accentRgb: ACCENT_RGB[c.accent],
      })),
    [t],
  );

  return (
    <>
      {!entered && (
        <LoadingScreen
          progress={loadProgress}
          ready={ready}
          onEnter={() => setEntered(true)}
          labels={{ loading: t('loading'), enter: t('enter'), hook: t('hook') }}
        />
      )}

      <section
        ref={trackRef}
        aria-label={t('reveal.tagline')}
        className="relative"
        style={{ height: `${(N + 1) * 100}svh` }}
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-svh overflow-hidden"
          style={{ ['--scene-accent' as string]: ACCENT_RGB[CINEMATIC_CHAPTERS[0]!.accent] }}
        >
          <ScrollCanvas ref={canvasRef} sources={sources} />

          {/* Per-chapter accent atmosphere */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 60% at 78% 72%, rgba(var(--scene-accent),0.12), transparent 70%)',
            }}
          />
          {/* Legibility vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-ink/45"
          />

          {/* Chapter copy (all present for a11y; one revealed at a time) */}
          <div className="absolute inset-0 mx-auto w-full max-w-shell px-gutter">
            {CINEMATIC_CHAPTERS.map((c, i) => (
              <SceneCopy
                key={c.id}
                ref={(el) => {
                  sceneRefs.current[i] = el;
                }}
                kicker={t(`chapters.${c.id}.kicker`)}
                company={t(`chapters.${c.id}.company`)}
                title={t(`chapters.${c.id}.title`)}
                body={t(`chapters.${c.id}.body`)}
                accentRgb={ACCENT_RGB[c.accent]}
                logo={
                  // Only the design chapter uses the DOM signage plate. Build/power
                  // logos are baked into the footage (in-scene hoarding/genset badge),
                  // and control's branding is carried by the Rama dashboard.
                  c.id === 'design' && c.company
                    ? { src: COMPANY_LOGO[c.company], alt: t(`chapters.${c.id}.company`) }
                    : undefined
                }
              />
            ))}
          </div>

          {/* Rama Technology MES/IoT layer — real HTML/CSS over the smart-factory plate */}
          <RamaDashboard ref={ramaRef} logo={COMPANY_LOGO.rama} />

          <FinalReveal ref={finalRef} />

          <ProgressRail
            items={railItems}
            active={active}
            label={t('railLabel')}
            onSeek={seek}
            spineRef={spineRef}
          />
        </div>
      </section>
    </>
  );
}
