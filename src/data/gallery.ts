/**
 * Unlisted experiments gallery.
 * Pieces are reachable by URL only — nothing on the home page links here yet.
 */
export interface GalleryPiece {
  slug: string;
  title: string;
  cover: string;
  coverAlt: string;
  kind?: 'html' | 'react';
  /** Static file under `public/`. Used when kind is `html`. */
  src?: string;
  /** External prototype URL. Opens in a new tab. */
  href?: string;
}

export const gallery: GalleryPiece[] = [
  {
    slug: 'lifespan-vs-healthspan',
    title: 'Lifespan vs Healthspan',
    cover: '/gallery/lifespan-vs-healthspan.png',
    coverAlt: 'Healthspan vs lifespan interactive curve with quality-of-life levers',
    kind: 'react',
  },
  {
    slug: 'reef-runners',
    title: 'Reef Runners',
    cover: '/gallery/reef-runners.png',
    coverAlt: 'Reef Runners Dive Co. dashboard prototype for a PADI five star dive center',
    href: 'https://padi-prototype.moore8577.workers.dev/',
  },
];

export function isGalleryPieceOpen(piece: GalleryPiece): boolean {
  return piece.kind === 'react' || Boolean(piece.src) || Boolean(piece.href);
}

export function getGalleryPiece(slug: string): GalleryPiece | undefined {
  const piece = gallery.find((entry) => entry.slug === slug);
  if (!piece || piece.href) return undefined;
  if (!isGalleryPieceOpen(piece)) return undefined;
  return piece;
}
