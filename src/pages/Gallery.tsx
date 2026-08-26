import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router';
import Grain from '../components/Grain';
import Wordmark from '../components/Wordmark';
import SiteFooter from '../components/SiteFooter';
import { gallery, isGalleryPieceOpen, type GalleryPiece } from '../data/gallery';
import { accentLinkHover } from '../lib/hover';
import { border, colors, fonts, layout } from '../theme/tokens';

const coverStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  aspectRatio: '16 / 10',
  objectFit: 'cover',
  objectPosition: 'top center',
  background: colors.bgAlt,
  border: `1px solid ${border.hairline}`,
};

const titleStyle: CSSProperties = {
  display: 'block',
  marginTop: '0.85rem',
  fontFamily: fonts.display,
  fontSize: 'clamp(1.25rem, 2.2vw, 1.55rem)',
  lineHeight: 1.2,
  color: colors.text,
};

/**
 * Quiet index of experiments. Not linked from the rest of the site.
 */
export default function Gallery() {
  useEffect(() => {
    document.title = 'Derek Moore — Gallery';
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: colors.bg,
        color: colors.text,
        fontFamily: fonts.mono,
        overflowX: 'clip',
      }}
    >
      <Grain enabled />
      <header
        style={{
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          padding: `1.4rem ${layout.sidePad}`,
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <Wordmark size={1.35} />
        </Link>
        <span
          style={{
            fontSize: '0.66rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: colors.textMuted,
          }}
        >
          Gallery
        </span>
      </header>

      <main
        style={{
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          padding: `clamp(2.4rem, 7vh, 4.5rem) ${layout.sidePad} clamp(4rem, 12vh, 8rem)`,
        }}
      >
        <ul className="gallery-grid">
          {gallery.map((piece) => (
            <li key={piece.slug}>
              <GalleryTile piece={piece} />
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter variant="case" />
    </div>
  );
}

function GalleryTile({ piece }: { piece: GalleryPiece }) {
  const body = (
    <>
      <img src={piece.cover} alt={piece.coverAlt} style={coverStyle} />
      <span style={titleStyle}>
        {piece.title}
        {piece.href ? (
          <span
            aria-hidden="true"
            style={{
              fontFamily: fonts.display,
              fontSize: '0.78em',
              marginLeft: '0.35em',
              color: colors.textMuted,
              verticalAlign: '0.08em',
            }}
          >
            ↗
          </span>
        ) : null}
      </span>
    </>
  );

  if (!isGalleryPieceOpen(piece)) {
    return <TileShell>{body}</TileShell>;
  }

  if (piece.href) {
    return (
      <a
        href={piece.href}
        target="_blank"
        rel="noreferrer"
        style={{ color: 'inherit', textDecoration: 'none' }}
        {...accentLinkHover(colors.text)}
      >
        <TileShell>{body}</TileShell>
      </a>
    );
  }

  return (
    <Link
      to={`/gallery/${piece.slug}`}
      style={{ color: 'inherit', textDecoration: 'none' }}
      {...accentLinkHover(colors.text)}
    >
      <TileShell>{body}</TileShell>
    </Link>
  );
}

function TileShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}
