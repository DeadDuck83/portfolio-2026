import { type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import { work, type WorkItem } from '../../data/work';
import { track } from '../../lib/analytics';
import { colors, fonts, layout } from '../../theme/tokens';

/**
 * Spatial thesis (work section):
 * - Lead: case-study hero as a full-bleed visual plane per project.
 * - Support: title + role in the scrim; tags + CTA clustered under it.
 * - Frame: dark section field; stacked full-width bands with hairline gaps.
 * - Rhythm: tall image bands, generous header above.
 * - Adapt: same overlay stack on narrow; image stays cover.
 */

const frame = {
  bg: colors.bg,
  ink: colors.text,
  inkMuted: colors.textMuted,
  border: 'rgba(236, 230, 218, 0.1)',
} as const;

const onImage = {
  text: colors.text,
  muted: 'rgba(236, 230, 218, 0.62)',
  chipBorder: 'rgba(236, 230, 218, 0.28)',
  scrim:
    'linear-gradient(180deg, rgba(26,23,18,0.15) 0%, rgba(26,23,18,0.45) 42%, rgba(26,23,18,0.92) 100%)',
} as const;

/**
 * "Selected work" — stacked full-width hero bands. Image leads; copy rides a dark scrim.
 * Each band links to its case study. Hover lifts the photo slightly.
 */
export default function WorkList() {
  return (
    <section
      id="work"
      style={{
        background: frame.bg,
        color: frame.ink,
        borderTop: `1px solid ${frame.border}`,
      }}
    >
      <div
        style={{
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          padding: `clamp(3.5rem, 9vh, 6.5rem) ${layout.sidePad} clamp(1.6rem, 4vh, 2.4rem)`,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <h2
          style={{
            fontFamily: fonts.display,
            fontWeight: 400,
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            margin: 0,
            lineHeight: 1,
            color: frame.ink,
          }}
        >
          The work
        </h2>
        <span
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: frame.inkMuted,
          }}
        >
          04 projects · 2019 — 2026
        </span>
      </div>

      <div className="work-grid" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {work.map((item) => (
          <WorkBand key={item.n} item={item} />
        ))}
      </div>
    </section>
  );
}

function WorkBand({ item }: { item: WorkItem }) {
  const onWorkClick = () => {
    track('WorkItemClick', {
      title: item.title,
      numeral: item.n,
      ...(item.to ? { route: item.to } : {}),
      ...(item.href ? { href: item.href } : {}),
    });
  };

  const bandStyle: CSSProperties = {
    position: 'relative',
    display: 'block',
    minHeight: 'clamp(20rem, 48vh, 30rem)',
    overflow: 'hidden',
    color: onImage.text,
    textDecoration: 'none',
    isolation: 'isolate',
  };

  const inner: ReactNode = (
    <>
      <img
        className="work-band__image"
        src={item.imageSrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: item.imagePosition ?? 'center center',
          transform: 'scale(1.001)',
          transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: onImage.scrim,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div
        className="work-band__content"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          width: '100%',
          padding: `clamp(1.8rem, 4vh, 2.6rem) ${layout.sidePad}`,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '0.85rem',
          }}
        >
          <span
            style={{
              fontFamily: fonts.display,
              fontSize: '1.15rem',
              color: colors.accentTint,
              letterSpacing: '0.02em',
            }}
          >
            {item.n}
          </span>
          <span
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: onImage.muted,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            {item.endLabel}
            {item.endGlyph && (
              <span
                style={{
                  fontFamily: fonts.display,
                  fontSize: '1.15rem',
                  color: colors.accentBright,
                  lineHeight: 1,
                }}
              >
                {item.endGlyph}
              </span>
            )}
          </span>
        </div>

        <h3
          style={{
            margin: 0,
            fontFamily: fonts.display,
            fontWeight: 400,
            fontSize: 'clamp(2rem, 4.8vw, 3.2rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: onImage.text,
            maxWidth: '22ch',
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            margin: '0.55rem 0 0',
            fontSize: '0.66rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: onImage.muted,
          }}
        >
          {item.brand}
        </p>
        <div
          className="work-band__tags"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '1.1rem' }}
        >
          {item.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: onImage.muted,
                padding: '0.28rem 0.55rem',
                border: `1px solid ${onImage.chipBorder}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  const hoverHandlers = {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const img = e.currentTarget.querySelector('.work-band__image') as HTMLElement | null;
      if (img) img.style.transform = 'scale(1.04)';
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      const img = e.currentTarget.querySelector('.work-band__image') as HTMLElement | null;
      if (img) img.style.transform = 'scale(1.001)';
    },
  };

  if (item.to) {
    return (
      <Link
        to={item.to}
        className="work-band"
        aria-label={`${item.brand}: ${item.title} — ${item.endLabel}`}
        style={bandStyle}
        onClick={onWorkClick}
        {...hoverHandlers}
      >
        {inner}
      </Link>
    );
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener"
        className="work-band"
        aria-label={`${item.brand}: ${item.title} — ${item.endLabel}`}
        style={bandStyle}
        onClick={onWorkClick}
        {...hoverHandlers}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="work-band" style={bandStyle} {...hoverHandlers}>
      {inner}
    </div>
  );
}
