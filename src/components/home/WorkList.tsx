import { type ReactNode } from 'react';
import { Link } from 'react-router';
import { work, type WorkItem } from '../../data/work';
import { track } from '../../lib/analytics';
import { colors, fonts, layout } from '../../theme/tokens';
import { chip } from '../../theme/patterns';

/**
 * Spatial thesis (work section):
 * - Every row sits inside layout.maxWidth (1240) with the rest of the page.
 * - Copy takes ~5/12, the card image ~7/12, shown whole at its own aspect.
 * - Stagger: even text→image, odd image→text.
 * - The image and the title are the links; the title glows on desktop hover.
 */

const frame = {
  bg: colors.bg,
  ink: colors.text,
  inkMuted: colors.textMuted,
  border: 'rgba(236, 230, 218, 0.1)',
} as const;

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
        paddingBottom: 'clamp(3rem, 8vh, 5.5rem)',
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

      <div
        className="work-grid"
        style={{
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          padding: `0 ${layout.sidePad}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(3.5rem, 9vh, 6rem)',
        }}
      >
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

  // The image and the title both open the case study. The image link is
  // skipped by keyboard and screen readers so the title is the one stop.
  const link = (children: ReactNode, props: { className: string; label?: boolean }) => {
    const shared = {
      className: props.className,
      onClick: onWorkClick,
      ...(props.label
        ? {}
        : { tabIndex: -1, 'aria-hidden': true as const }),
    };
    if (item.to) return <Link to={item.to} {...shared}>{children}</Link>;
    if (item.href) {
      return (
        <a href={item.href} target="_blank" rel="noopener" {...shared}>
          {children}
        </a>
      );
    }
    return <span className={props.className}>{children}</span>;
  };

  const content: ReactNode = (
    <div
      className="work-band__content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.85rem',
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
        {link(item.title, { className: 'work-band__title', label: true })}
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

  const media: ReactNode = link(
    <img
      src={item.imageSrc}
      alt={item.imageAlt}
      width={1199}
      height={731}
      loading="lazy"
      decoding="async"
    />,
    { className: 'work-band__media' },
  );

  return (
    <article className="work-band" data-stagger={flip ? 'flip' : 'base'}>
      {flip ? (
        <>
          {media}
          {content}
        </>
      ) : (
        <>
          {content}
          {media}
        </>
      )}
    </article>
  );
}
