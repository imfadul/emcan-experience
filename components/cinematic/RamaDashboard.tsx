'use client';

import Image from 'next/image';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { EASE, loadScene, prefersReducedMotion } from '@/lib/motion';

export interface RamaDashboardHandle {
  /** Reveal the dashboard (true) or reverse it out (false). */
  setActive: (active: boolean) => void;
}

const BLUE = '105,170,221'; // Bright Blue — Rama / Control
const GREEN = '41,150,23'; // Royal Green — healthy / running
const GOLD = '216,169,58'; // Harvest Gold — warning / idle

/** Production lines shown on the floor (generic process stages, not company data). */
const LINES = [
  { id: 'L01', stage: 'EXTRUSION', state: 'run' as const },
  { id: 'L02', stage: 'MOLDING', state: 'run' as const },
  { id: 'L03', stage: 'ASSEMBLY', state: 'idle' as const },
  { id: 'L04', stage: 'PACKAGING', state: 'run' as const },
];

const SPARK_N = 24; // sparkline sample count

/** A small deterministic-ish jitter around a baseline, clamped to [min,max]. */
function jitter(base: number, spread: number, min: number, max: number) {
  const v = base + (Math.random() - 0.5) * spread;
  return Math.min(max, Math.max(min, v));
}

/**
 * The Rama Technology MES / IoT layer — a real HTML/CSS dashboard composited over
 * the generated smart-factory plate for the "Control" chapter. Line status, an OEE
 * gauge, throughput, live sensor readouts and a predictive-maintenance alert make
 * Rama's actual work (connecting + controlling industry) legible. Values are
 * illustrative live-system data (clearly labelled), never fabricated Emcan figures.
 * Reveal is transform/opacity only; the live ticker mutates text/SVG directly (no
 * per-frame React renders), pauses when hidden, and is static under reduced-motion.
 */
export const RamaDashboard = forwardRef<RamaDashboardHandle, { logo: string }>(
  function RamaDashboard({ logo }, ref) {
    const t = useTranslations('cinematic.rama');
    const rootRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<(HTMLElement | null)[]>([]);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const wantActive = useRef(false);

    // Live-data refs (mutated directly to avoid React renders per tick).
    const oeeArcRef = useRef<SVGCircleElement>(null);
    const oeeValRef = useRef<HTMLSpanElement>(null);
    const oeeValMobileRef = useRef<HTMLSpanElement>(null);
    const apqRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const lineThruRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const sensorRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const sparkRefs = useRef<(SVGPolylineElement | null)[]>([]);
    const sparkData = useRef<number[][]>([]);

    useImperativeHandle(ref, () => ({
      setActive: (active: boolean) => {
        wantActive.current = active;
        const tl = tlRef.current;
        if (tl) (active ? tl.play() : tl.reverse());
      },
    }));

    // Reveal timeline (transform/opacity only).
    useEffect(() => {
      let cancelled = false;
      (async () => {
        const { gsap } = await loadScene();
        if (cancelled || !rootRef.current) return;
        const panels = panelsRef.current.filter(Boolean) as HTMLElement[];
        gsap.set(panels, { autoAlpha: 0, y: 22, filter: 'blur(6px)' });
        const tl = gsap.timeline({ paused: true });
        tl.to(panels, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          stagger: 0.08,
          ease: EASE.outExpo,
        });
        tlRef.current = tl;
        if (wantActive.current) tl.play();
      })();
      return () => {
        cancelled = true;
        tlRef.current?.kill();
      };
    }, []);

    // Live synthetic telemetry ticker.
    useEffect(() => {
      // Seed sparklines.
      sparkData.current = [
        Array.from({ length: SPARK_N }, () => jitter(42, 2, 38, 46)),
        Array.from({ length: SPARK_N }, () => jitter(2.1, 0.5, 1.5, 3)),
        Array.from({ length: SPARK_N }, () => jitter(6.0, 0.4, 5.5, 6.6)),
      ];

      const CIRC = 2 * Math.PI * 52; // gauge radius 52

      const paint = () => {
        // OEE + A/P/Q
        const a = jitter(96, 3, 90, 99.5);
        const p = jitter(91, 5, 82, 98);
        const q = jitter(99, 1.2, 97, 99.9);
        const oee = (a * p * q) / 10000;
        if (oeeValRef.current) oeeValRef.current.textContent = oee.toFixed(1);
        if (oeeValMobileRef.current) oeeValMobileRef.current.textContent = oee.toFixed(1);
        if (oeeArcRef.current)
          oeeArcRef.current.style.strokeDashoffset = String(CIRC * (1 - oee / 100));
        const apq = [a, p, q];
        apqRefs.current.forEach((el, i) => {
          if (el) el.textContent = apq[i]!.toFixed(1) + '%';
        });

        // Line throughput (units/hr)
        lineThruRefs.current.forEach((el, i) => {
          if (!el) return;
          const running = LINES[i]!.state === 'run';
          el.textContent = running ? String(Math.round(jitter(680, 60, 600, 760))) : '—';
        });

        // Sensors: temp °C, vibration mm/s, pressure bar, energy kW
        const temp = jitter(42, 2, 38, 46);
        const vib = jitter(2.1, 0.5, 1.5, 3);
        const pres = jitter(6.0, 0.4, 5.5, 6.6);
        const energy = jitter(342, 30, 300, 380);
        const vals = [temp.toFixed(1), vib.toFixed(2), pres.toFixed(2), Math.round(energy).toString()];
        sensorRefs.current.forEach((el, i) => {
          if (el) el.textContent = vals[i]!;
        });

        // Push sparkline samples (temp, vibration, pressure)
        [temp, vib, pres].forEach((v, i) => {
          const arr = sparkData.current[i]!;
          arr.push(v);
          arr.shift();
          const min = Math.min(...arr);
          const max = Math.max(...arr) || 1;
          const pts = arr
            .map((s, x) => {
              const px = (x / (SPARK_N - 1)) * 100;
              const py = 24 - ((s - min) / (max - min || 1)) * 22 - 1;
              return `${px.toFixed(1)},${py.toFixed(1)}`;
            })
            .join(' ');
          sparkRefs.current[i]?.setAttribute('points', pts);
        });
      };

      paint(); // initial static snapshot
      if (prefersReducedMotion()) return; // no live loop under reduced motion

      let raf = 0;
      let last = 0;
      const loop = (ts: number) => {
        if (!document.hidden && ts - last > 700) {
          last = ts;
          paint();
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }, []);

    const setPanel = (i: number) => (el: HTMLElement | null) => {
      panelsRef.current[i] = el;
    };

    const statusColor = (s: 'run' | 'idle') => (s === 'run' ? GREEN : GOLD);

    return (
      <div
        ref={rootRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Panel cluster — sits in the plate's negative space, inset clear of the
            progress rail on the inline-end edge; opposite the chapter copy. Anchored
            from the top (not centered) so it can never overflow up past the header
            padding and get covered by the fixed nav bar on shorter viewports. */}
        <div
          className="absolute inset-y-0 hidden w-[19rem] flex-col justify-start gap-2 pb-6 pt-[calc(var(--header-h)+1rem)] lg:flex"
          style={{ insetInlineEnd: 'calc(max(1rem, (100vw - var(--shell-max)) / 2) + 7.5rem)' }}
        >
          {/* Header */}
          <div
            ref={setPanel(0)}
            className="flex items-center justify-between rounded-lg border border-line/15 bg-ink/55 px-4 py-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
                  style={{ backgroundColor: `rgb(${BLUE})` }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: `rgb(${BLUE})` }}
                />
              </span>
              <div className="leading-tight">
                <p className="text-[0.62rem] font-semibold uppercase tracking-eyebrow text-offwhite">
                  {t('system')}
                </p>
                <p className="text-[0.58rem] uppercase tracking-eyebrow text-muted">{t('live')}</p>
              </div>
            </div>
            <Image
              src={logo}
              alt="Rama Technology"
              width={320}
              height={120}
              sizes="90px"
              className="h-5 w-auto [filter:brightness(0)_invert(1)]"
            />
          </div>

          {/* OEE gauge + A/P/Q */}
          <div
            ref={setPanel(1)}
            className="flex items-center gap-4 rounded-lg border border-line/15 bg-ink/55 p-4 backdrop-blur-md"
          >
            <div className="relative h-[104px] w-[104px] shrink-0">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                <circle
                  ref={oeeArcRef}
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={`rgb(${BLUE})`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * 0.12}
                  style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span dir="ltr" className="text-2xl font-bold tabular-nums text-offwhite">
                  <span ref={oeeValRef}>88.0</span>
                </span>
                <span className="text-[0.55rem] uppercase tracking-eyebrow text-muted">{t('oee')}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[t('availability'), t('performance'), t('quality')].map((label, i) => (
                <div key={label} className="leading-tight">
                  <p className="text-[0.58rem] uppercase tracking-eyebrow text-muted">{label}</p>
                  <span
                    ref={(el) => {
                      apqRefs.current[i] = el;
                    }}
                    dir="ltr"
                    className="text-sm font-semibold tabular-nums text-offwhite"
                  >
                    —
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Production lines */}
          <div
            ref={setPanel(2)}
            className="rounded-lg border border-line/15 bg-ink/55 p-4 backdrop-blur-md"
          >
            <p className="mb-2.5 text-[0.6rem] uppercase tracking-eyebrow text-muted">
              {t('lines')}
            </p>
            <ul className="space-y-2">
              {LINES.map((ln, i) => (
                <li key={ln.id} className="flex items-center gap-2.5 text-xs">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: `rgb(${statusColor(ln.state)})` }}
                  />
                  <span className="font-semibold tabular-nums text-offwhite">{ln.id}</span>
                  <span className="text-muted">{ln.stage}</span>
                  <span dir="ltr" className="ms-auto tabular-nums text-mist">
                    <span
                      ref={(el) => {
                        lineThruRefs.current[i] = el;
                      }}
                    >
                      —
                    </span>
                    <span className="ms-1 text-[0.6rem] text-muted">u/h</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Live sensors */}
          <div
            ref={setPanel(3)}
            className="rounded-lg border border-line/15 bg-ink/55 p-4 backdrop-blur-md"
          >
            <p className="mb-2.5 text-[0.6rem] uppercase tracking-eyebrow text-muted">
              {t('sensors')}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t('temp'), unit: '°C', spark: 0 },
                { label: t('vibration'), unit: 'mm/s', spark: 1 },
                { label: t('pressure'), unit: 'bar', spark: 2 },
              ].map((s, i) => (
                <div key={s.label}>
                  <p className="text-[0.55rem] uppercase tracking-eyebrow text-muted">{s.label}</p>
                  <p dir="ltr" className="tabular-nums text-offwhite">
                    <span
                      className="text-sm font-semibold"
                      ref={(el) => {
                        sensorRefs.current[i] = el;
                      }}
                    >
                      —
                    </span>
                    <span className="ms-0.5 text-[0.55rem] text-muted">{s.unit}</span>
                  </p>
                  <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="mt-1 h-5 w-full">
                    <polyline
                      ref={(el) => {
                        sparkRefs.current[i] = el;
                      }}
                      fill="none"
                      stroke={`rgb(${BLUE})`}
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                      points=""
                    />
                  </svg>
                </div>
              ))}
            </div>
            {/* Energy readout row */}
            <div className="mt-3 flex items-center justify-between border-t border-line/10 pt-2 text-xs">
              <span className="uppercase tracking-eyebrow text-muted">{t('energy')}</span>
              <span dir="ltr" className="tabular-nums text-offwhite">
                <span
                  className="font-semibold"
                  ref={(el) => {
                    sensorRefs.current[3] = el;
                  }}
                >
                  —
                </span>
                <span className="ms-1 text-[0.6rem] text-muted">kW</span>
              </span>
            </div>
          </div>

          {/* Predictive-maintenance alert */}
          <div
            ref={setPanel(4)}
            className="flex items-start gap-2.5 rounded-lg border p-3 backdrop-blur-md"
            style={{ borderColor: `rgba(${GOLD},0.4)`, backgroundColor: `rgba(${GOLD},0.08)` }}
          >
            <span
              className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: `rgb(${GOLD})` }}
            />
            <div className="leading-snug">
              <p className="text-[0.6rem] font-semibold uppercase tracking-eyebrow" style={{ color: `rgb(${GOLD})` }}>
                {t('alert')}
              </p>
              <p className="mt-0.5 text-xs text-mist">{t('alertBody')}</p>
            </div>
          </div>

          <p ref={setPanel(5)} className="text-[0.55rem] uppercase tracking-eyebrow text-muted/70">
            {t('illustrative')}
          </p>
        </div>

        {/* Below-desktop: one compact live card so the MES story still reads. */}
        <div
          ref={setPanel(6)}
          className="absolute inset-x-gutter bottom-[8%] rounded-lg border border-line/15 bg-ink/60 p-4 backdrop-blur-md lg:hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `rgb(${BLUE})` }} />
              <span className="text-[0.58rem] uppercase tracking-eyebrow text-offwhite">{t('system')}</span>
            </div>
            <Image
              src={logo}
              alt="Rama Technology"
              width={320}
              height={120}
              sizes="80px"
              className="h-4 w-auto [filter:brightness(0)_invert(1)]"
            />
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[0.55rem] uppercase tracking-eyebrow text-muted">{t('oee')}</p>
              <p dir="ltr" className="text-xl font-bold tabular-nums text-offwhite">
                <span ref={oeeValMobileRef}>92.0</span>
                <span className="text-sm text-muted">%</span>
              </p>
            </div>
            <p className="text-[0.6rem] text-mist">{t('lines')}: 3/4 {t('running')}</p>
          </div>
        </div>
      </div>
    );
  },
);
