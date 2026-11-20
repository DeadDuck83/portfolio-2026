import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import type { Figure } from '../../data/caseStudies/types';
import { isVideoFigure } from '../../data/caseStudies/figures';
import { useMotionOff } from '../../lib/motion';
import { border, colors, fonts, weights } from '../../theme/tokens';
import Button from '../../ui/Button';
import Label from '../../ui/Label';

/**
 * Every image in a case study at once, in columns with their captions, over the
 * whole window. Clicking an image opens it full size; Escape backs out (the full-size
 * view first, then the collage), and Close or the backdrop also closes. Focus starts
 * on Close; in the full-size view it stays inside the view, and goes back to the
 * image when the view closes. Open it from the TL;DR Callout's link ("Show me the
 * images →"), only when the case study has images. Data: a `title` (the case study's name line,
 * `caseStudy.eyebrowRight`), the `figures` that have an image
 * (`collectCaseStudyImages(caseStudy)`), and `onClose`.
 *
 * @import import ImageCollage from '../components/casestudy/ImageCollage';
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
  // the image that opened the full-size view, to go back to when it closes
  const openerRef = useRef<HTMLElement | null>(null);
  const [lightbox, setLightbox] = useState<Figure | null>(null);

  // once, as it opens: the page behind stops scrolling, and focus starts on Close.
  // (Not again when the full-size view opens: that would take focus from it.)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Escape backs out: the full-size view first, then the collage
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (lightbox) setLightbox(null);
      else onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, lightbox]);

  // when the full-size view closes, focus goes back to the image that opened it
  useEffect(() => {
    if (lightbox) return;
    openerRef.current?.focus();
    openerRef.current = null;
  }, [lightbox]);

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
            <Label style={{ marginBottom: '0.35rem' }}>Image collage</Label>
            <h2
              id={titleId}
              style={{
                margin: 0,
                fontFamily: fonts.display,
                fontWeight: weights.display,
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                lineHeight: 1.15,
                color: colors.text,
              }}
            >
              {title}
            </h2>
          </div>
          <Button
            ref={closeRef}
            variant="outline"
            size="compact"
            onClick={onClose}
            aria-label="Close image collage"
            style={{ flex: '0 0 auto' }}
          >
            Close
          </Button>
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
              onOpen={(opener) => {
                openerRef.current = opener;
                setLightbox(fig);
              }}
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
  const off = useMotionOff();
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
      <LoopVideo
        src={figure.src}
        label={label}
        interactive={interactive}
        style={mediaStyle}
      />
    );
  }

  return (
    <img
      src={(off && figure.still) || figure.src}
      alt={label}
      loading={interactive ? undefined : 'lazy'}
      style={{
        ...mediaStyle,
        ...(interactive ? { cursor: 'zoom-out' } : {}),
      }}
    />
  );
}

/**
 * A muted looping demo. It plays by itself unless motion is off (paused, or
 * reduced by the system); then it holds its first frame, and in the lightbox
 * its controls can still play it.
 */
function LoopVideo({
  src,
  label,
  interactive,
  style,
}: {
  src: string;
  label: string;
  interactive: boolean;
  style: CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const off = useMotionOff();
  const first = useRef(true);
  // autoPlay starts it; after that, follow Pause motion / Play motion
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      return;
    }
    if (off) el.pause();
    else void Promise.resolve(el.play()).catch(() => {});
  }, [off]);
  return (
    <video
      ref={ref}
      src={src}
      aria-label={label}
      autoPlay={!off}
      muted
      loop
      playsInline
      preload="metadata"
      controls={interactive}
      style={style}
      onClick={interactive ? (e) => e.stopPropagation() : undefined}
    />
  );
}

function CollageItem({ figure, onOpen }: { figure: Figure; onOpen: (opener: HTMLElement) => void }) {
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
        onClick={(e) => onOpen(e.currentTarget)}
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
            <Label style={{ marginBottom: '0.35rem' }}>{cap.tag}</Label>
          )}
          {cap?.lead ? (
            <div
              style={{
                fontFamily: fonts.text,
                fontWeight: 600,
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

/** A stop in the full-size view's Tab loop: it takes no space and can't be seen. */
const FOCUS_STOP: CSSProperties = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' };

function Lightbox({ figure, onClose }: { figure: Figure; onClose: () => void }) {
  const viewRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const label = figure.alt ?? figure.innerLabel;

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // focus stays inside the view: an invisible stop before its controls and one after
  // them send Tab and Shift+Tab round to the other end (Close, or a video's controls)
  const controls = () => [...(viewRef.current?.querySelectorAll<HTMLElement>('button, video[controls]') ?? [])];
  const toFirst = () => controls()[0]?.focus();
  const toLast = () => controls()[controls().length - 1]?.focus();

  return (
    <div
      ref={viewRef}
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
      <span tabIndex={0} onFocus={toLast} style={FOCUS_STOP} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '0.6rem',
        }}
      >
        <Button ref={closeRef} variant="outline" size="compact" onClick={onClose} aria-label="Close full-size media">
          Close
        </Button>
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
      <span tabIndex={0} onFocus={toFirst} style={FOCUS_STOP} />
    </div>
  );
}
