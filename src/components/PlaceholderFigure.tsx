import type { CSSProperties } from 'react';
import type { Figure } from '../data/caseStudies/types';
import { useMotionOff } from '../lib/motion';
import { fonts, colors } from '../theme/tokens';

/**
 * A figure in a case study: an image at a fixed aspect ratio with an optional
 * caption (a tag, a lead, a description). Until the image exists it draws a grey
 * placeholder in the same shape: an X from corner to corner, a "Placeholder · …"
 * label, the size to export and what goes there. Use it for every figure in a case
 * study's chapters; the image collage shows the same figures. Data: a `Figure`
 * (`placeholder`, `dims`, `aspect`, `innerLabel`, and `src` and `alt` once the image
 * exists). `prominent` sets the placeholder's type larger, for full-width figures.
 * `src` and `alt` props override the figure's own.
 *
 * @import import PlaceholderFigure from '../components/PlaceholderFigure';
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
  // an animated GIF holds on its still frame while motion is off
  const still = useMotionOff() && figure.still;
  const imageSrc = src ?? (still || figure.src);
  const imageAlt = alt ?? figure.alt ?? figure.innerLabel;

  const blockStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: figure.aspect,
    background: colors.placeholderBg,
    overflow: 'hidden',
  };

  return (
    <figure style={{ margin: 0 }}>
      <div style={blockStyle}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: figure.objectFit ?? 'contain',
              objectPosition: figure.objectPosition ?? 'center',
              display: 'block',
            }}
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
        <span style={{ fontFamily: fonts.text, fontWeight: 600, fontSize: '1.15rem' }}>{lead}</span>
      )}
      {leadInline ? (
        <span style={{ fontSize: '0.74rem', lineHeight: 1.6, color: colors.textMuted }}>
          <span style={{ fontFamily: fonts.text, fontWeight: 600, fontSize: '1.05rem', color: colors.text }}>
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
