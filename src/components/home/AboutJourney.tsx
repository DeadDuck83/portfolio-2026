import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { aboutChapters, aboutIntro, aboutToday } from '../../data/aboutJourney';
import { track } from '../../lib/analytics';
import { chip, eyebrow } from '../../theme/patterns';
import { border, colors, fonts, layout } from '../../theme/tokens';
import AboutJourneyBackground from './AboutJourneyBackground';
import {
  buildTimeline,
  clamp01,
  locate,
  lockedChapter,
  ramp,
  riveOpacityAt,
  segmentProgress,
  smoothstep,
  themeAt,
  type Segment,
} from './aboutJourneyEngine';
import { createRunner, type Runner } from './aboutJourneyRunner';
import '../../styles/about-journey.css';

type Mode = 'pin' | 'stack';

const STACK_QUERY = '(max-width: 880px), (max-height: 640px), (prefers-reduced-motion: reduce)';
const TODAY = aboutChapters.length + 1;

/** Engine-written inline properties, cleared on mode change / unmount. */
const ENGINE_PROPS = ['opacity', 'transform', 'transition', 'transition-delay', 'pointer-events'];

/** Tokens handed to about-journey.css; --ab-* start dark and are re-blended by the engine. */
const sectionVars = {
  ...themeAt(0).vars,
  '--font-display': fonts.display,
  '--font-mono': fonts.mono,
  '--side-pad': layout.sidePad,
  '--measure': `${layout.maxWidth}px`,
  '--accent': colors.accent,
  '--accent-ring': border.accentMed,
  '--c-bg': colors.bg,
  '--c-text': colors.text,
  '--c-body': colors.textBody,
  '--c-muted': colors.textMuted,
  '--c-em': colors.accentBright,
  '--grid': border.gridBg,
  '--ab-rive': '0',
} as CSSProperties;

const themedEyebrow: CSSProperties = { ...eyebrow, color: 'var(--ab-ink-3)' };
const themedChip: CSSProperties = {
  ...chip,
  color: 'var(--ab-ink-2)',
  borderColor: 'var(--ab-tag)',
};

const todayEyebrow: CSSProperties = { ...eyebrow, color: colors.textMuted };

export interface AboutJourneyProps {
  /** Pin the section and carry chapters into focus (false = plain vertical flow). */
  pinned?: boolean;
  /** Arrive dark, shift light once pinned, back to dark for Today (false = light throughout). */
  themeShift?: boolean;
  /** Scroll px per px of horizontal travel — lower is brisker. */
  pace?: number;
  /** How long each chapter holds focus, as a fraction of viewport height (0–0.7). */
  chapterDwell?: number;
  /** Pixel runner jogs in and stands beside Today (desktop only). */
  runner?: boolean;
}

function resolveMode(pinned: boolean): Mode {
  if (!pinned) return 'stack';
  return window.matchMedia(STACK_QUERY).matches ? 'stack' : 'pin';
}

/**
 * "About me" — a nonlinear path in four chapters. On desktop the section pins
 * and scroll carries each chapter into focus along a rail, theme shifting
 * dark → light → dark, then "Today" rises as the finale. Narrow / short
 * viewports and reduced-motion users get a stacked flow with a swipeable
 * chapter row. Per-frame work is imperative (refs + inline styles) so scroll
 * never triggers a React render; only mode and active chapter are state.
 */
export default function AboutJourney({
  pinned = true,
  themeShift = true,
  pace = 0.4,
  chapterDwell = 0.38,
  runner = true,
}: AboutJourneyProps) {
  const [mode, setMode] = useState<Mode>(() => resolveMode(pinned));
  const [chapter, setChapter] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const moverRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const todayRef = useRef<HTMLDivElement | null>(null);
  const runnerRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(STACK_QUERY);
    const sync = () => setMode(resolveMode(pinned));
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [pinned]);

  const seenRef = useRef(new Set<number>());
  useEffect(() => {
    if (chapter < 1 || seenRef.current.has(chapter)) return;
    seenRef.current.add(chapter);
    track('AboutChapterView', {
      chapter,
      name: chapter === TODAY ? 'Today' : aboutChapters[chapter - 1].discipline,
    });
  }, [chapter]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const mover = moverRef.current;
    const intro = introRef.current;
    const today = todayRef.current;
    if (!section || !stage || !mover || !intro || !today) return;

    const panels = Array.from(stage.querySelectorAll<HTMLElement>('.about-journey__panel')).map(
      (el) => ({
        el,
        nat: 0,
        parts: ['head', 'dot', 'card']
          .map((k) => el.querySelector<HTMLElement>(`[data-reveal="${k}"]`))
          .filter((p): p is HTMLElement => p !== null),
        rail: el.querySelector<HTMLElement>('.about-journey__rail'),
      }),
    );
    const introParts = Array.from(intro.querySelectorAll<HTMLElement>('[data-reveal="intro"]'));
    const introRail = intro.querySelector<HTMLElement>('.about-journey__intro-rail');
    const introLine = intro.querySelector<HTMLElement>('.about-journey__intro-line');
    const todayParts = (Array.from(today.children) as HTMLElement[]).filter(
      (el) => !el.classList.contains('about-journey__runner'),
    );
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lastChapter = -1;
    const commitChapter = (n: number) => {
      if (n === lastChapter) return;
      lastChapter = n;
      setChapter(n);
    };

    let lastTheme = -1;
    let dip = 1;
    const applyTheme = (raw: number) => {
      const frame = themeAt(raw);
      dip = frame.dip;
      if (frame.t === lastTheme) return;
      lastTheme = frame.t;
      for (const [k, v] of Object.entries(frame.vars)) section.style.setProperty(k, v);
    };

    const applyRive = (opacity: number) => {
      section.style.setProperty('--ab-rive', clamp01(opacity).toFixed(3));
    };

    const reveal = (el: HTMLElement, r: number, dy: number) => {
      if (el.dataset.reveal === 'dot') {
        el.style.transform = `scale(${r.toFixed(3)})`;
        return;
      }
      el.style.opacity = r.toFixed(3);
      el.style.transform = `translate3d(0,${((1 - r) * dy).toFixed(1)}px,0)`;
    };

    const syncHeader = () => {
      const header = document.querySelector('[data-site-header]');
      const h = header ? header.getBoundingClientRect().height : 0;
      if (h > 0) section.style.setProperty('--ab-head', `${Math.round(h)}px`);
    };

    let raf = 0;
    let frame: () => void;
    let measure: () => void;
    let io: IntersectionObserver | null = null;
    let run: Runner | null = null;
    let detachStack: (() => void) | null = null;

    if (mode === 'stack') {
      measure = () => {
        syncHeader();
        // Sit the figure in the open space above the first chapter card (stack
        // layout) — between the intro and the "01" head — instead of over the intro.
        const riveEl = stage.querySelector<HTMLElement>('.about-journey__rive');
        const firstHead = panels[0]?.el.querySelector<HTMLElement>('.about-journey__head');
        if (riveEl && firstHead) {
          const stageTop = stage.getBoundingClientRect().top;
          const bandTop = intro.getBoundingClientRect().bottom - stageTop;
          const bandH = Math.max(160, firstHead.getBoundingClientRect().top - stageTop - bandTop);
          riveEl.style.top = `${bandTop}px`;
          riveEl.style.left = '0';
          riveEl.style.width = '100%';
          riveEl.style.height = `${bandH}px`;
          riveEl.style.transform = 'none';
        }
        frame();
      };
      frame = () => {
        const vh = window.innerHeight;
        const top = section.getBoundingClientRect().top;
        // Snap the paper dark → light like a switch (not a scroll-long fade), a
        // touch before the section has fully reached the top of the screen.
        const tIn = (vh * 0.12 - top) / (vh * 0.03);
        const tOut = (today.getBoundingClientRect().top - vh * 0.3) / (vh * 0.35);
        if (themeShift) {
          applyTheme(Math.min(tIn, tOut));
        } else {
          applyTheme(1);
        }
        // Fade the figure in on the now-light paper as its band and the first
        // card rise into view; fade it back out as Today (dark) approaches.
        const firstCard = panels[0]?.el.getBoundingClientRect();
        const towardFirst = firstCard ? ramp(vh * 0.7 - firstCard.top, 0, vh * 0.35) : 1;
        const light = themeShift ? clamp01(Math.min(tIn, tOut)) : 1;
        applyRive(light * towardFirst);
        // The paper snaps rather than crossfades, so keep the content solid — the
        // opacity dip is only meaningful for pin mode's slow chapter transitions.
        introParts.forEach((p) => (p.style.opacity = '1'));
        panels.forEach((pn) => (pn.el.style.opacity = '1'));
        syncChapter();
      };

      // Chapter follows the card snapped into focus (both directions), so the Rive
      // figure resets and plays that chapter; 0 over the intro, Today at the end.
      const trackEl = panels[0]?.el.parentElement ?? null;
      const stride =
        panels.length > 1
          ? panels[1].el.offsetLeft - panels[0].el.offsetLeft
          : panels[0]?.el.offsetWidth || 1;
      const syncChapter = () => {
        const vhNow = window.innerHeight;
        if (today.getBoundingClientRect().top < vhNow * 0.45) {
          commitChapter(TODAY);
          return;
        }
        const tr = trackEl?.getBoundingClientRect();
        if (trackEl && tr && tr.bottom > vhNow * 0.2 && tr.top < vhNow * 0.9) {
          const idx = Math.round(trackEl.scrollLeft / Math.max(1, stride));
          commitChapter(Math.min(panels.length, Math.max(1, idx + 1)));
          return;
        }
        commitChapter(0);
      };
      trackEl?.addEventListener('scroll', syncChapter, { passive: true });
      detachStack = () => trackEl?.removeEventListener('scroll', syncChapter);

      // Each chapter reveals once as it scrolls or swipes into view, parts staggered.
      const groups = [
        ...panels.map((pn, i) => ({ el: pn.el, parts: pn.parts, n: i + 1 })),
        { el: today, parts: todayParts, n: TODAY },
      ];
      const parts = groups.flatMap((g) => g.parts);
      parts.forEach((p) => reveal(p, 0, 18));
      void stage.offsetWidth;
      if (!reduceMotion) {
        groups.forEach((g) =>
          g.parts.forEach((p, k) => {
            p.style.transition =
              'opacity 0.55s ease, transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)';
            p.style.transitionDelay = `${(k * 0.13).toFixed(2)}s`;
          }),
        );
      }
      io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (!en.isIntersecting) continue;
            const g = groups.find((gr) => gr.el === en.target);
            if (!g) continue;
            g.parts.forEach((p) => reveal(p, 1, 18));
            io?.unobserve(en.target);
          }
        },
        { threshold: 0.55 },
      );
      groups.forEach((g) => io?.observe(g.el));
    } else {
      let W = 0;
      let pW = 0;
      let spacing = 1;
      let segs: Segment[] = [];
      let total = 0;
      if (runner && runnerRef.current) run = createRunner(runnerRef.current);

      measure = () => {
        syncHeader();
        const vh = window.innerHeight;
        W = stage.clientWidth;
        section.style.setProperty('--ab-w', `${W}px`);
        // One chapter in focus: card centred, previous receding at the left edge, next peeking at the right.
        const peek = Math.round(Math.min(96, Math.max(56, W * 0.05)));
        pW = panels[0]?.el.offsetWidth || Math.round(W * 0.26);
        spacing = Math.max(pW + 1, Math.round(W / 2 + pW / 2 - peek));
        const pad = panels[0] ? parseFloat(getComputedStyle(panels[0].el).paddingLeft) || 0 : 0;
        intro.style.width = `${W - peek}px`;
        if (introLine) introLine.style.right = `${-(pad + 7)}px`;
        panels.forEach((pn) => {
          pn.el.style.marginRight = `${spacing - pW}px`;
          if (pn.rail) {
            pn.rail.style.left = '7px';
            pn.rail.style.right = 'auto';
            pn.rail.style.width = `${spacing}px`;
            pn.rail.style.transformOrigin = 'left center';
          }
        });
        panels.forEach((pn) => (pn.nat = pn.el.offsetLeft));
        ({ segs, total } = buildTimeline({
          vh,
          spacing,
          count: panels.length,
          pace: Number(pace) || 0.4,
          dwell: Math.round(vh * Math.min(0.7, Math.max(0, Number(chapterDwell) || 0))),
          themeShift,
        }));
        section.style.height = `${vh + total}px`;
        today.style.paddingLeft = `${Math.round((W - pW) / 2) + pad}px`;
        if (run && todayParts.length) {
          const first = todayParts[0];
          const last = todayParts[todayParts.length - 1];
          const F = Math.round((W - pW) / 2);
          run.place({
            copyLeft: F + pad,
            copyTop: first.offsetTop,
            copyHeight: last.offsetTop + last.offsetHeight - first.offsetTop,
            sideInset: parseFloat(getComputedStyle(intro).paddingLeft) || 0,
          });
        }
        frame();
      };

      frame = () => {
        if (!segs.length) return;
        const top = section.getBoundingClientRect().top;
        const y = Math.min(total, Math.max(0, -top));
        const { seg, u, x, moved } = locate(segs, y);
        applyTheme(!themeShift ? 1 : seg.kind === 'in' ? u : seg.kind === 'out' ? 1 - u : 1);

        const last = segs[segs.length - 1];
        const uOut = last.kind === 'out' ? segmentProgress(last, y) : 0;
        const gone = smoothstep(uOut / 0.6);
        if (uOut >= 0.35) run?.start();
        mover.style.transform = `translate3d(${(-x).toFixed(1)}px,0,0)`;

        // Intro dissolves as chapter 01 is carried into focus.
        const first = segs.find((sg) => sg.kind === 'step');
        applyRive(riveOpacityAt(y, first, themeShift) * (last.kind === 'out' ? 1 - uOut : 1));
        const firstMoved = first && first.travel > 0 ? clamp01((y - first.start) / first.travel) : 1;
        const gi = smoothstep(firstMoved / 0.6);
        const fi = ((1 - gi) * dip).toFixed(3);
        introParts.forEach((p) => (p.style.opacity = fi));
        if (introRail) introRail.style.opacity = (1 - gone).toFixed(3);

        // Presence peaks at centre; the rail draws from the focused node toward the next.
        const half = W / 2;
        const pw2 = pW / 2;
        panels.forEach((pn) => {
          const dist = (pn.nat - x + pw2 - half) / spacing;
          const pres = 1 - clamp01(Math.abs(dist));
          pn.el.style.opacity = ((0.38 + 0.62 * smoothstep(pres)) * dip * (1 - gone)).toFixed(3);
          if (pn.rail) pn.rail.style.transform = `scaleX(${clamp01(-dist).toFixed(3)})`;
        });

        // Finale: Today rises over the darkened stage.
        const qT = ramp(uOut, 0.4, 1);
        const shown = qT > 0.5;
        today.style.opacity = ramp(uOut, 0.3, 0.7).toFixed(3);
        today.style.pointerEvents = shown ? 'auto' : 'none';
        today.inert = !shown;
        todayParts.forEach((p, k) => reveal(p, ramp(qT, k * 0.07, 0.6 + k * 0.07), 22));

        // Only lock a chapter (and fire its Rive timeline) once travel has finished.
        const next = lockedChapter(seg, moved, shown, panels.length);
        if (next !== null) commitChapter(next);
      };
    }

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        frame();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null;
    ro?.observe(mover);
    let alive = true;
    document.fonts?.ready.then(() => alive && measure());
    measure();

    return () => {
      alive = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      ro?.disconnect();
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      run?.destroy();
      detachStack?.();
      // Clear only what the engine wrote so the next mode starts from the stylesheet.
      const clear = (el: HTMLElement | null, props = ENGINE_PROPS) =>
        props.forEach((p) => el?.style.removeProperty(p));
      section.style.height = '';
      clear(mover);
      clear(stage.querySelector<HTMLElement>('.about-journey__rive'), [
        'top',
        'left',
        'width',
        'height',
        'transform',
      ]);
      intro.style.width = '';
      if (introLine) introLine.style.right = '';
      clear(introRail);
      introParts.forEach((p) => clear(p));
      panels.forEach((pn) => {
        pn.el.style.marginRight = '';
        clear(pn.el);
        clear(pn.rail, ['left', 'right', 'width', 'transform', 'transform-origin']);
        pn.parts.forEach((p) => clear(p));
      });
      todayParts.forEach((p) => clear(p));
      clear(today, [...ENGINE_PROPS, 'padding-left']);
      today.inert = false;
    };
  }, [mode, themeShift, pace, chapterDwell, runner]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-journey"
      data-mode={mode}
      data-shift={themeShift ? 'on' : 'off'}
      data-chapter={chapter}
      aria-labelledby="about-title"
      style={sectionVars}
    >
      <div ref={stageRef} className="about-journey__stage">
        <div className="about-journey__bg" aria-hidden="true">
          <AboutJourneyBackground chapter={chapter} />
        </div>

        <div ref={moverRef} className="about-journey__mover">
          <div ref={introRef} className="about-journey__intro">
            <div data-reveal="intro" className="about-journey__intro-top">
              <span style={themedEyebrow}>{aboutIntro.eyebrow}</span>
              <h2 id="about-title" className="about-journey__title">
                {aboutIntro.titleLead} <em>{aboutIntro.titleEm}</em> {aboutIntro.titleTail}
              </h2>
            </div>
            <div className="about-journey__intro-rail" aria-hidden="true">
              <span className="about-journey__intro-line" />
            </div>
            <div data-reveal="intro" className="about-journey__intro-bottom">
              <p className="about-journey__lede">{aboutIntro.body}</p>
              <span className="about-journey__hint" aria-hidden="true">
                Scroll <span className="about-journey__glyph">→</span>
              </span>
            </div>
          </div>

          <ol
            className="about-journey__track"
            aria-label="Career chapters"
            tabIndex={mode === 'stack' ? 0 : undefined}
          >
            {aboutChapters.map((c) => (
              <li key={c.n} className="about-journey__panel">
                <div data-reveal="head" className="about-journey__head">
                  <span className="about-journey__num">{c.n}</span>
                  <span className="about-journey__discipline">{c.discipline}</span>
                </div>
                <div className="about-journey__node" aria-hidden="true">
                  <span className="about-journey__rail" />
                  <span data-reveal="dot" className="about-journey__dot" />
                </div>
                <div data-reveal="card" className="about-journey__card">
                  <span className="about-journey__kicker">{c.companies}</span>
                  <h3 className="about-journey__title">
                    Taught me <em>{c.lesson}</em>
                  </h3>
                  <p className="about-journey__lede">{c.body}</p>
                  <span className="about-journey__divider" aria-hidden="true" />
                  <ul className="about-journey__tags" aria-label="Skills">
                    {c.tags.map((t) => (
                      <li key={t} style={themedChip}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div ref={todayRef} className="about-journey__today">
          <canvas ref={runnerRef} className="about-journey__runner" aria-hidden="true" />
          <span style={todayEyebrow}>{aboutToday.eyebrow}</span>
          <h3 className="about-journey__title">
            {aboutToday.titleLead} <em>{aboutToday.titleEm}</em>
          </h3>
          <p className="about-journey__lede">{aboutToday.body}</p>
          <dl className="about-journey__stats">
            {aboutToday.stats.map((s) => (
              <div key={s.label} className="about-journey__stat">
                <dt>{s.big}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
