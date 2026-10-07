import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { aboutChapters, aboutCompanies, aboutIntro, aboutToday } from '../../data/aboutJourney';
import { track } from '../../lib/analytics';
import { useGuideFocus } from '../../lib/guide';
import { border, colors, fonts, layout } from '../../theme/tokens';
import CompanyPopover from './CompanyPopover';
import { createSquares, type SquaresController } from './aboutRailSquares';
import '../../styles/about-rail.css';

const SRC = '/background/journey.riv';
/** Desktop: the card that has crossed this fraction of viewport height is active. */
const LINE = 0.42;
/** Mobile: leave the "appear" pose once the chapter-1 heading reaches this fraction of the viewport (≈ as it enters from the bottom). */
const MOBILE_ENGAGE = 0.95;
/** Below this width the section becomes the horizontal swipe layout. */
const SWIPE_QUERY = '(max-width: 880px)';
const TODAY = aboutChapters.length + 1;

const sectionVars = {
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
  '--card': colors.cardActive,
  '--edge': border.hairlineStronger,
  '--rule': border.chip,
  '--grid': border.gridBg,
} as CSSProperties;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** "at Mob Media and Metagenics" — each name a popover, joined with commas / and. */
function companyNodes(keys: string[]): ReactNode[] {
  const companies = keys.map((k) => aboutCompanies[k]).filter(Boolean);
  const out: ReactNode[] = [];
  companies.forEach((c, i) => {
    if (i > 0) {
      if (companies.length > 2) out.push(i === companies.length - 1 ? ', and ' : ', ');
      else out.push(' and ');
    }
    out.push(<CompanyPopover key={c.name} company={c} />);
  });
  return out;
}

/**
 * "About me" journey. On desktop it's a sticky animation column on the left with
 * a rail of four chapter cards on the right; a card crossing the 42% line picks
 * the chapter the squares show (journey.riv plays the transition and that
 * chapter's hold loop). On mobile it's a self-contained swipe unit — squares up
 * top, a through-line of dots, and the chapter content as a horizontal
 * scroll-snap row below; swiping picks the chapter. "Today" is the
 * payoff. (The earlier pinned / Rive-background version lives on in AboutJourney.)
 */
export default function AboutRail() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<SquaresController | null>(null);
  const desiredMark = useRef(0);
  const [active, setActive] = useState(0);

  // Fire an analytics event the first time each chapter takes focus.
  const seenRef = useRef(new Set<number>());
  useEffect(() => {
    if (active < 1 || seenRef.current.has(active)) return;
    seenRef.current.add(active);
    track('AboutChapterView', {
      chapter: active,
      name: active === TODAY ? 'Today' : aboutChapters[active - 1]?.discipline,
    });
  }, [active]);

  const scrollToCard = (i: number) => {
    sectionRef.current
      ?.querySelectorAll<HTMLElement>('.about-rail__card')
      [i]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  };

  // The avatar guide walks visitors through the chapters: bring chapter `step`
  // (1..n) into focus — on desktop by scrolling its card past the 42% line,
  // on mobile by scrolling the section into view and centring the slide.
  // Step n+1 (TODAY) brings the closing "Today, I bring it together" block up.
  const focusChapter = useCallback((step: number) => {
    const section = sectionRef.current;
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
    if (step === TODAY) {
      const today = section?.querySelector<HTMLElement>('.about-rail__today');
      if (today) window.scrollTo({ top: window.scrollY + today.getBoundingClientRect().top - window.innerHeight * 0.25, behavior });
      return;
    }
    const card = section?.querySelectorAll<HTMLElement>('.about-rail__card')[step - 1];
    if (!section || !card) return;
    if (window.matchMedia(SWIPE_QUERY).matches) {
      const r = section.querySelector('.about-rail__body')?.getBoundingClientRect();
      if (r) window.scrollTo({ top: window.scrollY + r.top - 72, behavior });
      card.scrollIntoView({ inline: 'center', block: 'nearest', behavior });
    } else {
      const top = window.scrollY + card.getBoundingClientRect().top - window.innerHeight * (LINE - 0.12);
      window.scrollTo({ top, behavior });
    }
  }, []);
  useGuideFocus('about', focusChapter);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const reduceMotion = prefersReducedMotion();
    const swipeMq = window.matchMedia(SWIPE_QUERY);
    const cards = Array.from(section.querySelectorAll<HTMLElement>('.about-rail__card'));
    const track = section.querySelector<HTMLElement>('.about-rail__cards');
    const firstHeading = cards[0]?.querySelector<HTMLElement>('.about-rail__card-title') ?? null;

    const commit = (n: number) => {
      desiredMark.current = n;
      controllerRef.current?.setMark(n);
      setActive(n);
    };

    // Lazy-load the heavy runtime as the section approaches, then drive it.
    let loaded = false;
    const loader = new IntersectionObserver(
      (entries) => {
        if (loaded || !entries.some((e) => e.isIntersecting)) return;
        loaded = true;
        loader.disconnect();
        createSquares(canvas, { src: SRC, reducedMotion: reduceMotion })
          .then((ctrl) => {
            controllerRef.current = ctrl;
            ctrl.setMark(desiredMark.current);
          })
          .catch(() => {
            /* leave the canvas blank if the clip fails to load */
          });
      },
      { rootMargin: '60% 0px 60% 0px' },
    );
    loader.observe(section);

    // Two drivers, swapped on the breakpoint. Desktop reads the vertical 42%
    // line; mobile reads which card is centred in the horizontal swipe.
    let teardown = () => {};
    const setupDriver = () => {
      teardown();
      if (swipeMq.matches && track) {
        // Which slide is centred horizontally (1..n).
        const centered = () => {
          const tr = track.getBoundingClientRect();
          const mid = tr.left + tr.width / 2;
          let best = 1;
          let bestDist = Infinity;
          cards.forEach((card, i) => {
            const r = card.getBoundingClientRect();
            const d = Math.abs(r.left + r.width / 2 - mid);
            if (d < bestDist) {
              bestDist = d;
              best = i + 1;
            }
          });
          return best;
        };
        // Rest on the "appear" pose (mark 0) until the chapter-1 heading scrolls
        // into view, then transition to the chapters. Also covers scrolled-above = 0.
        const engaged = () =>
          !firstHeading || firstHeading.getBoundingClientRect().top <= window.innerHeight * MOBILE_ENGAGE;
        const compute = () => (engaged() ? centered() : 0);
        let raf = 0;
        const onScroll = () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            commit(compute());
          });
        };
        // Horizontal swipe picks the chapter; vertical scroll gates the 0 state.
        track.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        commit(compute());
        teardown = () => {
          track.removeEventListener('scroll', onScroll);
          window.removeEventListener('scroll', onScroll);
          if (raf) cancelAnimationFrame(raf);
          teardown = () => {};
        };
      } else {
        const computeActive = () => {
          const lineY = window.innerHeight * LINE;
          let n = 0;
          cards.forEach((card, i) => {
            if (card.getBoundingClientRect().top <= lineY) n = i + 1;
          });
          return n;
        };
        const spy = new IntersectionObserver(() => commit(computeActive()), {
          rootMargin: `-${LINE * 100}% 0px -${100 - LINE * 100}% 0px`,
        });
        cards.forEach((c) => spy.observe(c));
        commit(computeActive());
        teardown = () => {
          spy.disconnect();
          teardown = () => {};
        };
      }
    };
    setupDriver();
    swipeMq.addEventListener('change', setupDriver);

    const onResize = () => controllerRef.current?.resize();
    window.addEventListener('resize', onResize);

    return () => {
      loader.disconnect();
      teardown();
      swipeMq.removeEventListener('change', setupDriver);
      window.removeEventListener('resize', onResize);
      controllerRef.current?.destroy();
      controllerRef.current = null;
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about-rail" aria-labelledby="about-title" style={sectionVars}>
      <div className="about-rail__intro">
        <h2 id="about-title" className="about-rail__title">
          {aboutIntro.titleLead} <em>{aboutIntro.titleEm}</em> {aboutIntro.titleTail}
        </h2>
        <p className="about-rail__lede">{aboutIntro.body}</p>
      </div>

      <div className="about-rail__body">
        <div className="about-rail__media">
          <div className="about-rail__stage">
            <canvas ref={canvasRef} className="about-rail__canvas" aria-hidden="true" />
          </div>
        </div>

        <div className="about-rail__line" role="tablist" aria-label="Chapters">
          {aboutChapters.map((c, i) => (
            <button
              key={c.n}
              type="button"
              className="about-rail__dot"
              role="tab"
              aria-selected={active === i + 1}
              aria-label={c.discipline}
              data-active={active === i + 1 ? 'on' : undefined}
              onClick={() => scrollToCard(i)}
            />
          ))}
        </div>

        <ol className="about-rail__cards">
          {aboutChapters.map((c, i) => (
            <li key={c.n} className="about-rail__card" data-active={active === i + 1 ? 'on' : undefined}>
              <div className="about-rail__card-head">
                <span className="about-rail__discipline">{c.discipline}</span>
              </div>
              <div className="about-rail__card-heading">
                <h3 className="about-rail__card-title">
                  {c.lead} <em>{c.lesson.replace(/\.$/, '')}</em>
                </h3>
                <p className="about-rail__card-where">at {companyNodes(c.companyKeys)}</p>
              </div>
              <p className="about-rail__lede">{c.body}</p>
              <ul className="about-rail__tags" aria-label="Skills">
                {c.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <div className="about-rail__today">
        <h3 className="about-rail__title">
          {aboutToday.titleLead} <em>{aboutToday.titleEm}</em>
        </h3>
        <p className="about-rail__lede">{aboutToday.body}</p>
        <dl className="about-rail__stats">
          {aboutToday.stats.map((s) => (
            <div key={s.label} className="about-rail__stat">
              <dt>{s.big}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
