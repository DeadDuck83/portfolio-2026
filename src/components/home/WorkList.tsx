import { type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router';
import { work, type WorkItem } from '../../data/work';
import { track } from '../../lib/analytics';
import { colors, fonts, layout } from '../../theme/tokens';
import { chip } from '../../theme/patterns';

/**
 * Spatial thesis (work section):
 * - Type aligns to layout.maxWidth (1240) with the rest of the page.
 * - Text share ≈ 27.5% of that measure (¼ + 10%); image takes the rest and bleeds out.
 * - Image container caps at 2500px; outer edge fades 1500 → 2500 into the section bg.
 * - Stagger: even text→image, odd image→text. Hover: 1px lift.
 */

const frame = {
  bg: colors.bg,
  ink: colors.text,
  inkMuted: colors.textMuted,
  border: 'rgba(236, 230, 218, 0.1)',
  cta: colors.accentBright,
} as const;

/** Text share of the content measure (¼ + 10%). */
const TEXT_RATIO = 1.1 / 4;

const IMAGE_MAX = 2500;
const IMAGE_FADE_START = 1500;

/**
 * "Selected work" — staggered copy · image rows with outer fade.
 */
export default function WorkList() {
  return (
    <section
      id="work"
      style={{
        background: frame.bg,
        color: frame.ink,
        borderTop: `1px solid ${frame.border}`,
        // Shared by .work-band grid / mask in global.css
        ['--work-measure' as string]: `${layout.maxWidth}px`,
        ['--work-text-ratio' as string]: String(TEXT_RATIO),
        ['--work-image-max' as string]: `${IMAGE_MAX}px`,
        ['--work-image-fade-start' as string]: `${IMAGE_FADE_START}px`,
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
        {work.map((item, index) => (
          <WorkBand key={item.n} item={item} flip={index % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function WorkBand({ item, flip }: { item: WorkItem; flip: boolean }) {
  const onWorkClick = () => {
    track('WorkItemClick', {
      title: item.title,
      numeral: item.n,
      ...(item.to ? { route: item.to } : {}),
      ...(item.href ? { href: item.href } : {}),
    });
  };

  const bandStyle: CSSProperties = {
    display: 'grid',
    minHeight: 'clamp(18rem, 42vh, 26rem)',
    overflow: 'hidden',
    color: frame.ink,
    textDecoration: 'none',
    background: frame.bg,
    isolation: 'isolate',
  };

  const content: ReactNode = (
    <div
      className="work-band__content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.85rem',
        paddingTop: 'clamp(1.5rem, 3.5vh, 2.4rem)',
        paddingBottom: 'clamp(1.5rem, 3.5vh, 2.4rem)',
        paddingLeft: flip ? 'clamp(1.1rem, 2vw, 1.6rem)' : layout.sidePad,
        paddingRight: flip ? layout.sidePad : 'clamp(1.1rem, 2vw, 1.6rem)',
        boxSizing: 'border-box',
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontSize: '0.66rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: frame.inkMuted,
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
              fontSize: '1.05rem',
              color: frame.cta,
              lineHeight: 1,
            }}
          >
            {item.endGlyph}
          </span>
        )}
      </span>

      <h3
        style={{
          margin: 0,
          fontFamily: fonts.display,
          fontWeight: 400,
          fontSize: 'clamp(1.45rem, 2.4vw, 2.15rem)',
          lineHeight: 1.12,
          letterSpacing: '-0.02em',
          color: frame.ink,
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: '0.66rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: frame.inkMuted,
        }}
      >
        {item.brand}
      </p>
      <div
        className="work-band__tags"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}
      >
        {item.tags.map((t) => (
          <span key={t} style={chip}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );

  const media: ReactNode = (
    <div className="work-band__media" aria-hidden>
      <img
        className="work-band__image"
        src={item.imageSrc}
        alt=""
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: item.imagePosition ?? 'center center',
        }}
      />
    </div>
  );

  const inner: ReactNode = flip ? (
    <>
      {media}
      {content}
    </>
  ) : (
    <>
      {content}
      {media}
    </>
  );

  if (item.to) {
    return (
      <Link
        to={item.to}
        className="work-band"
        data-stagger={flip ? 'flip' : 'base'}
        aria-label={`${item.brand}: ${item.title} — ${item.endLabel}`}
        style={bandStyle}
        onClick={onWorkClick}
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
        data-stagger={flip ? 'flip' : 'base'}
        aria-label={`${item.brand}: ${item.title} — ${item.endLabel}`}
        style={bandStyle}
        onClick={onWorkClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="work-band" data-stagger={flip ? 'flip' : 'base'} style={bandStyle}>
      {inner}
    </div>
  );
}
