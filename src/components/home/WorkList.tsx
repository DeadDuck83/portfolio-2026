import { type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router';
import { work, type WorkItem } from '../../data/work';
import { track } from '../../lib/analytics';
import { border, colors, fonts } from '../../theme/tokens';

/**
 * "Selected work" — four full-width rows (numeral · title/desc/tags · date).
 * Rows link externally, to an internal case study, or nowhere yet. Hovering a
 * row tints its background and shifts the numeral to the accent color.
 */
export default function WorkList() {
  return (
    <section id="work" style={{ borderTop: `1px solid ${border.hairline}` }}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: 'clamp(4rem, 11vh, 8rem) clamp(1.5rem, 6vw, 6rem) clamp(2rem, 6vh, 4rem)',
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
          }}
        >
          Selected work
        </h2>
        <span
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.textMuted,
          }}
        >
          04 projects · 2019 — 2026
        </span>
      </div>

      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 6vw, 6rem) clamp(4rem, 10vh, 7rem)',
        }}
      >
        {work.map((item, i) => (
          <WorkRow key={item.n} item={item} last={i === work.length - 1} />
        ))}
      </div>
    </section>
  );
}

function WorkRow({ item, last }: { item: WorkItem; last: boolean }) {
  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '3.5rem 1fr auto',
    gap: 'clamp(1rem, 4vw, 3rem)',
    alignItems: 'start' as const,
    padding: 'clamp(2rem, 5vh, 3rem) 0',
    borderTop: `1px solid ${border.hairlineStronger}`,
    ...(last ? { borderBottom: `1px solid ${border.hairlineStronger}` } : {}),
  };

  const onEnter = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = 'rgba(191,106,65,0.05)';
    const numeral = e.currentTarget.querySelector('span');
    if (numeral) (numeral as HTMLElement).style.color = colors.accentBright;
  };
  const onLeave = (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = 'transparent';
    const numeral = e.currentTarget.querySelector('span');
    if (numeral) (numeral as HTMLElement).style.color = colors.textMuted;
  };

  const inner: ReactNode = (
    <>
      <span style={{ fontFamily: fonts.display, fontSize: '1.5rem', color: colors.textMuted }}>
        {item.n}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: fonts.display, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.05 }}>
            {item.title}
          </span>
          <span
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: colors.textMuted,
            }}
          >
            {item.roleTag}
          </span>
        </div>
        <p
          style={{
            maxWidth: '60ch',
            margin: '0.9rem 0 0',
            fontSize: '0.86rem',
            lineHeight: 1.7,
            color: colors.textBody,
          }}
        >
          {item.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {item.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: colors.textMuted,
                padding: '0.3rem 0.6rem',
                border: `1px solid ${border.hairlineStrong}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <span
        style={{
          fontSize: '0.68rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: colors.textMuted,
          whiteSpace: 'nowrap',
          ...(item.endGlyph
            ? { display: 'flex', alignItems: 'center', gap: '0.5rem' }
            : {}),
        }}
      >
        {item.endLabel}
        {item.endGlyph && (
          <span style={{ fontFamily: fonts.display, fontSize: '1.2rem', color: colors.accent }}>
            {item.endGlyph}
          </span>
        )}
      </span>
    </>
  );

  const onWorkClick = () => {
    track('WorkItemClick', {
      title: item.title,
      numeral: item.n,
      ...(item.to ? { route: item.to } : {}),
      ...(item.href ? { href: item.href } : {}),
    });
  };

  // Internal case-study route.
  if (item.to) {
    return (
      <Link
        to={item.to}
        style={rowStyle}
        onClick={onWorkClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {inner}
      </Link>
    );
  }
  // External link.
  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener"
        style={rowStyle}
        onClick={onWorkClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {inner}
      </a>
    );
  }
  // Not yet linked.
  return (
    <div style={rowStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {inner}
    </div>
  );
}
