import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { roles } from '../../data/roles';
import { border, colors, fonts } from '../../theme/tokens';
import BrainBackground from './BrainBackground';

const GAP = 20;
const DRAG_THRESHOLD = 55;
const CLICK_SUPPRESS_PX = 6;

/**
 * "The path here" — the career-journey section. A draggable / keyboard /
 * click card slider over the six roles, with two decorative background SVGs
 * whose weight follows the active role, plus a stat band and skill chips.
 * Initial active index is 5 (Sage Healthspan), matching the reference.
 */
export default function CareerSlider() {
  const [active, setActive] = useState(roles.length - 1);
  const [vw, setVw] = useState(900);
  const [dragging, setDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState(0);

  const vpRef = useRef<HTMLDivElement | null>(null);
  const startX = useRef(0);
  const suppressClick = useRef(false);

  // Track viewport width for responsive card sizing.
  useEffect(() => {
    const measure = () => {
      if (vpRef.current) setVw(vpRef.current.clientWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const clamp = (i: number) => Math.max(0, Math.min(roles.length - 1, i));
  const goTo = (i: number) => {
    if (suppressClick.current) return;
    setActive(clamp(i));
  };
  const goPrev = () => setActive((a) => clamp(a - 1));
  const goNext = () => setActive((a) => clamp(a + 1));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    setDragging(true);
    setDragDelta(0);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDragDelta(e.clientX - startX.current);
  };
  const onUp = () => {
    if (!dragging) return;
    const d = dragDelta;
    suppressClick.current = Math.abs(d) > CLICK_SUPPRESS_PX;
    if (suppressClick.current) setTimeout(() => (suppressClick.current = false), 60);
    setActive((a) => {
      let next = a;
      if (d > DRAG_THRESHOLD) next -= 1;
      else if (d < -DRAG_THRESHOLD) next += 1;
      return clamp(next);
    });
    setDragging(false);
    setDragDelta(0);
  };

  const cardW = Math.max(238, Math.min(354, vw - 90));
  const offset = vw / 2 - (active * (cardW + GAP) + cardW / 2) + dragDelta;

  const trackStyle: CSSProperties = {
    display: 'flex',
    gap: `${GAP}px`,
    alignItems: 'stretch',
    transform: `translateX(${offset}px)`,
    transition: dragging ? 'none' : 'transform .55s cubic-bezier(.22,.61,.36,1)',
    willChange: 'transform',
  };

  const cur = roles[active];

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        borderTop: `1px solid ${border.hairline}`,
        background: colors.bgAlt,
        overflow: 'hidden',
      }}
    >
      <BrainBackground designW={cur.designW} devW={cur.devW} />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1240,
          margin: '0 auto',
          padding: 'clamp(4rem, 11vh, 8rem) clamp(1.5rem, 6vw, 6rem)',
        }}
      >
        {/* Intro + arrows */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          <div style={{ maxWidth: '52ch', minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: colors.textMuted,
              }}
            >
              / The path here
            </div>
            <p
              style={{
                fontFamily: fonts.display,
                fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                lineHeight: 1.32,
                margin: '1rem 0 0',
                color: colors.text,
                letterSpacing: '-0.005em',
              }}
            >
              A decade spanning graphic design, front-end engineering, and product ownership —
              each role widening the scope. Comfortable in an architecture diagram and a design
              file alike.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', alignItems: 'flex-start' }}>
            <span
              style={{
                fontSize: '0.64rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: colors.textFaint,
              }}
            >
              Drag · step · or tap a role
            </span>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <ArrowButton label="Previous role" glyph="←" onClick={goPrev} disabled={active === 0} />
              <ArrowButton
                label="Next role"
                glyph="→"
                onClick={goNext}
                disabled={active === roles.length - 1}
              />
            </div>
          </div>
        </div>

        {/* Slider viewport */}
        <div
          ref={vpRef}
          tabIndex={0}
          onKeyDown={onKey}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          style={{
            marginTop: 'clamp(2.5rem, 6vh, 4rem)',
            overflow: 'hidden',
            outline: 'none',
            touchAction: 'pan-y',
            WebkitMaskImage:
              'linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)',
            maskImage: 'linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)',
          }}
        >
          <div style={trackStyle}>
            {roles.map((r, i) => (
              <RoleCard
                key={r.n}
                role={r}
                cardW={cardW}
                active={i === active}
                dist={Math.abs(i - active)}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        {/* Stat band */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 1,
            marginTop: 'clamp(2.6rem, 6vh, 4rem)',
            background: border.gridBgFaint,
            border: `1px solid ${border.gridBgFaint}`,
          }}
        >
          {[
            { big: '10 yrs', label: 'Design · Eng · Product' },
            { big: '0 → 6k+', label: 'Users, founding hire' },
            { big: '4', label: 'Connected products shipped' },
          ].map((s) => (
            <div key={s.label} style={{ background: colors.bgAlt, padding: '1.4rem 1.3rem' }}>
              <div style={{ fontFamily: fonts.display, fontSize: '1.9rem', color: colors.accentBright }}>
                {s.big}
              </div>
              <div
                style={{
                  fontSize: '0.66rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.textMuted,
                  marginTop: '0.4rem',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Skill chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.6rem' }}>
          {[
            'Product Lifecycle 0→1',
            'System & API Integration',
            'Software + Hardware',
            'React · Next.js · TypeScript',
          ].map((chip) => (
            <span
              key={chip}
              style={{
                fontSize: '0.66rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: colors.textBody,
                padding: '0.4rem 0.75rem',
                border: `1px solid ${border.hairlineStronger}`,
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowButton({
  label,
  glyph,
  onClick,
  disabled,
}: {
  label: string;
  glyph: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        width: 46,
        height: 46,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: fonts.display,
        fontSize: '1.4rem',
        background: 'none',
        color: colors.text,
        border: `1px solid ${border.menuButton}`,
        cursor: 'pointer',
        transition: 'all .3s ease',
        lineHeight: 1,
        opacity: disabled ? 0.3 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = border.accentStrong;
        e.currentTarget.style.color = colors.accentBright;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = border.menuButton;
        e.currentTarget.style.color = colors.text;
      }}
    >
      {glyph}
    </button>
  );
}

function RoleCard({
  role,
  cardW,
  active,
  dist,
  onClick,
}: {
  role: (typeof roles)[number];
  cardW: number;
  active: boolean;
  dist: number;
  onClick: () => void;
}) {
  const opacity = active ? 1 : dist === 1 ? 0.4 : 0.18;
  const scale = active ? 1 : 0.9;
  const accent = active ? colors.accentBright : colors.textFaint;
  const meta = role.loc ? `${role.dates}   ·   ${role.loc}` : role.dates;

  return (
    <div
      onClick={onClick}
      style={{
        flex: `0 0 ${cardW}px`,
        width: cardW,
        boxSizing: 'border-box',
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1.9rem',
        border: `1px solid ${active ? border.accentMed : border.hairlineStrong}`,
        background: active ? colors.cardActive : colors.cardRest,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center bottom',
        transition: 'opacity .5s ease, transform .5s ease, border-color .5s ease, background .5s ease',
        cursor: active ? 'default' : 'pointer',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <span style={{ fontFamily: fonts.display, fontSize: '1.5rem', color: accent, lineHeight: 1 }}>
          {role.n}
        </span>
        <span
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: active ? colors.accentTint : colors.textFaint,
            padding: '0.32rem 0.6rem',
            border: `1px solid ${active ? border.accentSoft : border.hairlineStrong}`,
            whiteSpace: 'nowrap',
          }}
        >
          {role.disc}
        </span>
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: '2.1rem',
          lineHeight: 1.04,
          color: active ? colors.text : colors.textMuted,
          marginTop: '1.5rem',
        }}
      >
        {role.company}
      </div>
      <div
        style={{
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: accent,
          marginTop: '0.6rem',
        }}
      >
        {role.role}
      </div>
      <div
        style={{
          fontSize: '0.66rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: colors.textFaint,
          marginTop: '0.9rem',
        }}
      >
        {meta}
      </div>
      <p
        style={{
          fontSize: '0.82rem',
          lineHeight: 1.65,
          color: active ? colors.textBody : colors.textFaint,
          marginTop: '1.1rem',
          flex: 1,
        }}
      >
        {role.desc}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.1rem' }}>
        {role.tags.map((t) => (
          <span
            key={t}
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: active ? colors.textMuted : colors.textFaintest,
              padding: '0.28rem 0.55rem',
              border: `1px solid ${border.hairlineStrong}`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
