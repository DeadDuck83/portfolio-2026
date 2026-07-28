import { useEffect, useId, useRef, useState } from 'react';
import type { Figure } from '../../data/caseStudies/types';
import { isVideoFigure } from '../../data/caseStudies/figures';
import { border, colors, fonts } from '../../theme/tokens';

/**
 * Full-viewport collage of case-study images with captions.
 * Click media to open a fill-screen lightbox; Escape backs out
 * (lightbox first, then collage). Backdrop / Close also dismiss.
 */
export default function ImageCollage({
  title,
  figures,
  onClose,
}: {
  title: string;
  figures: Figure[];
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [lightbox, setLightbox] = useState<Figure | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (lightbox) {
        setLightbox(null);
        return;
      }
      onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose, lightbox]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(18, 16, 12, 0.94)',
        overflowY: lightbox ? 'hidden' : 'auto',
        overscrollBehavior: 'contain',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: 'clamp(1.4rem, 4vh, 2.4rem) clamp(1.2rem, 4vw, 2.5rem) clamp(3rem, 8vh, 5rem)',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.2rem',
            marginBottom: 'clamp(1.6rem, 4vh, 2.4rem)',
            position: 'sticky',
            top: 0,
            padding: '0.6rem 0 0.9rem',
            background: 'linear-gradient(180deg, rgba(18,16,12,0.98) 70%, rgba(18,16,12,0))',
            zIndex: 1,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: colors.accentBright,
                marginBottom: '0.35rem',
              }}
            >
              Image collage
            </div>
            <h2
              id={titleId}
              style={{
                margin: 0,
                fontFamily: fonts.display,
                fontWeight: 400,
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                lineHeight: 1.15,
                color: colors.text,
              }}
            >
              {title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close image collage"
            style={{
              flex: '0 0 auto',
              fontFamily: fonts.mono,
              fontSize: '0.7rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: colors.textBody,
              background: 'none',
              border: `1px solid ${border.hairlineStronger}`,
              padding: '0.7rem 1rem',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.accentTint;
              e.currentTarget.style.borderColor = border.accentMed;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.textBody;
              e.currentTarget.style.borderColor = border.hairlineStronger;
            }}
          >
            Close
          </button>
        </header>

        <div
          style={{
            columnWidth: 280,
            columnCount: 3,
            columnGap: 'clamp(1.2rem, 3vw, 2rem)',
          }}
        >
          {figures.map((fig) => (
            <CollageItem
              key={`${fig.src}-${fig.placeholder}`}
              figure={fig}
              onOpen={() => setLightbox(fig)}
            />
          ))}
        </div>
      </div>

      {lightbox && <Lightbox figure={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

function Media({
  figure,
  label,
  interactive = false,
}: {
  figure: Figure;
  label: string;
  interactive?: boolean;
}) {
  const mediaStyle = interactive
    ? {
        display: 'block' as const,
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain' as const,
      }
    : {
        display: 'block' as const,
        width: '100%',
        height: 'auto',
      };

  if (isVideoFigure(figure) && figure.src) {
    return (
      <video
        src={figure.src}
        aria-label={label}
        autoPlay
        muted
        loop
        playsInline
        controls={interactive}
        style={mediaStyle}
        onClick={interactive ? (e) => e.stopPropagation() : undefined}
      />
    );
  }

  return (
    <img
      src={figure.src}
      alt={label}
      loading={interactive ? undefined : 'lazy'}
      style={{
        ...mediaStyle,
        ...(interactive ? { cursor: 'zoom-out' } : {}),
      }}
    />
  );
}

function CollageItem({ figure, onOpen }: { figure: Figure; onOpen: () => void }) {
  const cap = figure.caption;
  const label = figure.alt ?? figure.innerLabel;
  const video = isVideoFigure(figure);
  return (
    <figure
      style={{
        breakInside: 'avoid',
        margin: '0 0 clamp(1.4rem, 3.5vh, 2.2rem)',
        display: 'block',
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={video ? `Play larger: ${label}` : `View larger: ${label}`}
        style={{
          display: 'block',
          width: '100%',
          padding: 0,
          margin: 0,
          border: `1px solid ${border.hairlineFaint}`,
          background: colors.placeholderBg,
          cursor: video ? 'pointer' : 'zoom-in',
          overflow: 'hidden',
        }}
      >
        <Media figure={figure} label={label} />
      </button>
      {(cap?.tag || cap?.lead || cap?.desc || figure.innerLabel) && (
        <figcaption style={{ marginTop: '0.75rem' }}>
          {cap?.tag && (
            <div
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: colors.accentBright,
                marginBottom: '0.35rem',
              }}
            >
              {cap.tag}
            </div>
          )}
          {cap?.lead ? (
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: '1.05rem',
                lineHeight: 1.25,
                color: colors.text,
                marginBottom: cap.desc ? '0.35rem' : 0,
              }}
            >
              {cap.lead}
            </div>
          ) : (
            !cap?.desc && (
              <div
                style={{
                  fontSize: '0.74rem',
                  lineHeight: 1.5,
                  color: colors.textMuted,
                }}
              >
                {figure.innerLabel}
              </div>
            )
          )}
          {cap?.desc && (
            <p
              style={{
                margin: 0,
                fontSize: '0.74rem',
                lineHeight: 1.6,
                color: colors.textMuted,
              }}
            >
              {cap.desc}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function Lightbox({ figure, onClose }: { figure: Figure; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const label = figure.alt ?? figure.innerLabel;

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(10, 9, 7, 0.96)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(0.8rem, 2vw, 1.4rem)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '0.6rem',
        }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close full-size media"
          style={{
            fontFamily: fonts.mono,
            fontSize: '0.7rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: colors.textBody,
            background: 'none',
            border: `1px solid ${border.hairlineStronger}`,
            padding: '0.65rem 0.95rem',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <Media figure={figure} label={label} interactive />
      </div>
      {(figure.caption?.lead || figure.caption?.desc) && (
        <p
          style={{
            margin: '0.8rem auto 0',
            maxWidth: '52ch',
            textAlign: 'center',
            fontSize: '0.74rem',
            lineHeight: 1.55,
            color: colors.textMuted,
          }}
        >
          {figure.caption.lead}
          {figure.caption.lead && figure.caption.desc ? ' — ' : null}
          {figure.caption.desc}
        </p>
      )}
    </div>
  );
}
