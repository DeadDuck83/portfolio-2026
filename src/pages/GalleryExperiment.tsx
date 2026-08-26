import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { HealthspanSimulator } from '../components/healthspan';
import { getGalleryPiece, type GalleryPiece } from '../data/gallery';
import { accentLinkHover } from '../lib/hover';
import { border, colors, fonts } from '../theme/tokens';

/**
 * Full-bleed host for a gallery study. HTML pieces run in an iframe;
 * React pieces mount in the page so they stay in the same bundle.
 */
export default function GalleryExperiment() {
  const { slug } = useParams();
  const piece = slug ? getGalleryPiece(slug) : undefined;

  useEffect(() => {
    if (!piece) return;
    document.title = `${piece.title} — Derek Moore`;
  }, [piece]);

  if (!piece) return <Navigate to="/gallery" replace />;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: colors.bg,
        color: colors.text,
        fontFamily: fonts.mono,
      }}
    >
      <header
        style={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '0.75rem clamp(1rem, 4vw, 2rem)',
          borderBottom: `1px solid ${border.hairline}`,
          background: colors.bgAlt,
        }}
      >
        <Link
          to="/gallery"
          style={{
            fontSize: '0.66rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: colors.textMuted,
            textDecoration: 'none',
          }}
          {...accentLinkHover(colors.textMuted)}
        >
          ← Gallery
        </Link>
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: '1.05rem',
            letterSpacing: '-0.01em',
            color: colors.text,
          }}
        >
          {piece.title}
        </span>
      </header>
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <ExperimentBody piece={piece} />
      </div>
    </div>
  );
}

function ExperimentBody({ piece }: { piece: GalleryPiece }) {
  if (piece.slug === 'lifespan-vs-healthspan') {
    return <HealthspanSimulator />;
  }

  if (piece.src) {
    return (
      <iframe
        title={piece.title}
        src={piece.src}
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          background: colors.bg,
        }}
      />
    );
  }

  return null;
}
