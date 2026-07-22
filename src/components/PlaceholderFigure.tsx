import { useState, type CSSProperties } from 'react';
import type { Figure } from '../data/caseStudies/types';
import { fonts, colors } from '../theme/tokens';

/**
 * Gray placeholder block with corner-to-corner X, top-left label, centered
 * pixel dimensions + description, and an optional caption. `<img>`-ready:
 * pass `src` (and `alt`) to drop the final asset in at the same aspect ratio.
 * `prominent` bumps the centered dimension type for feature figures.
 */
export default function PlaceholderFigure({
  figure,
  prominent = false,
  src,
  alt,
}: {
  figure: Figure;
  prominent?: boolean;
  src?: string;
  alt?: string;
}) {
  const [hover, setHover] = useState(false);

  const blockStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: figure.aspect,
    background: colors.placeholderBg,
    overflow: 'hidden',
    ...(figure.hoverLift
      ? {
          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
          transform: hover ? 'translateY(-6px)' : 'none',
        }
      : {}),
  };

  const hoverProps = figure.hoverLift
    ? { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) }
    : {};

  return (
    <figure style={{ margin: 0 }}>
      <div style={blockStyle} {...hoverProps}>
        {src ? (
          <img
            src={src}
            alt={alt ?? figure.innerLabel}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              aria-hidden="true"
            >
              <line x1="0" y1="0" x2="100" y2="100" stroke={colors.placeholderX} strokeWidth="0.25" />
              <line x1="100" y1="0" x2="0" y2="100" stroke={colors.placeholderX} strokeWidth="0.25" />
            </svg>
            <span
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1.2rem',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: colors.placeholderLabel,
              }}
            >
              Placeholder · {figure.placeholder}
            </span>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: prominent ? 'clamp(1.4rem, 3vw, 2.2rem)' : 'clamp(1.3rem, 2.6vw, 1.9rem)',
                  color: colors.placeholderDims,
                  letterSpacing: '0.06em',
                }}
              >
                {figure.dims}
              </span>
              <span
                style={{
                  fontSize: prominent ? '0.68rem' : '0.66rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: colors.placeholderLabel,
                }}
              >
                {figure.innerLabel}
              </span>
            </div>
          </>
        )}
      </div>
      {figure.caption && <FigureCaption caption={figure.caption} />}
    </figure>
  );
}

function FigureCaption({ caption }: { caption: NonNullable<Figure['caption']> }) {
  const { tag, lead, leadInline, desc } = caption;
  const blockLead = lead && !leadInline;

  return (
    <figcaption
      style={{
        display: 'flex',
        gap: '0.8rem',
        alignItems: 'baseline',
        marginTop: blockLead ? '1rem' : '0.9rem',
        ...(blockLead ? { maxWidth: '70ch', flexWrap: 'wrap' } : {}),
      }}
    >
      {tag && (
        <span style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: colors.accentBright }}>
          {tag}
        </span>
      )}
      {blockLead && (
        <span style={{ fontFamily: fonts.display, fontSize: '1.15rem' }}>{lead}</span>
      )}
      {leadInline ? (
        <span style={{ fontSize: '0.74rem', lineHeight: 1.6, color: colors.textMuted }}>
          <span style={{ fontFamily: fonts.display, fontSize: '1.05rem', color: colors.text }}>
            {lead}
          </span>
          {desc}
        </span>
      ) : (
        desc && (
          <span style={{ fontSize: '0.74rem', lineHeight: 1.6, color: colors.textMuted }}>
            {desc}
          </span>
        )
      )}
    </figcaption>
  );
}
