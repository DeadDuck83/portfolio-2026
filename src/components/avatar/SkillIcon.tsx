import type { ReactNode } from 'react';
import { BRAND_PATHS, type BrandId } from './brandPaths';
import type { SkillIconId } from './skills';

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** A plain monogram tile, for tools whose marks aren't freely available. */
const monogram = (text: string, size = 10.5) => (
  <>
    <rect x="1.8" y="1.8" width="20.4" height="20.4" rx="4.5" {...line} />
    <text
      x="12"
      y="12.4"
      textAnchor="middle"
      dominantBaseline="middle"
      fill="currentColor"
      fontFamily="'Host Grotesk', system-ui, sans-serif"
      fontWeight="700"
      fontSize={size}
      letterSpacing="-0.2"
    >
      {text}
    </text>
  </>
);

/** Glyphs drawn here: research methods (no logos) and the monograms. */
const DRAWN: Partial<Record<SkillIconId, ReactNode>> = {
  photoshop: monogram('Ps'),
  illustrator: monogram('Ai'),
  indesign: monogram('Id'),
  aftereffects: monogram('Ae'),
  premiere: monogram('Pr'),
  aws: monogram('aws', 8.6),
  azure: <path d="M7 18.5h10.5a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7.5 9a4.75 4.75 0 0 0-.5 9.5z" {...line} />,
  sql: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" {...line} />
      <path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8" {...line} />
    </>
  ),
  workshops: (
    <>
      <path d="M3 4.5h9.5V14H6.2L3 17.2z" {...line} />
      <path d="M15.5 8h5.5v9.5h-3.3L14.5 21v-3.5h-2V17" {...line} />
    </>
  ),
  chat: (
    <>
      <path d="M9.5 3.5 7.5 20.5M16.5 3.5l-2 17M4 9h16.5M3.5 15H20" {...line} />
    </>
  ),
  interviews: (
    <>
      <path d="M3 5.5a2 2 0 0 1 2-2h8.5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8.5L5 15.5v-3a2 2 0 0 1-2-2z" {...line} />
      <path d="M18 8.5h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2v3l-3.5-3h-4a2 2 0 0 1-2-2" {...line} />
    </>
  ),
  forms: (
    <>
      <rect x="4" y="2.5" width="16" height="19" rx="2.2" {...line} />
      <rect x="7" y="6.5" width="3" height="3" rx="0.6" {...line} />
      <path d="M12.5 8h4.5M7 13h10M7 17h7" {...line} />
    </>
  ),
  abtests: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2.5" {...line} />
      <path d="M12 4v16" {...line} />
      <path d="M4.8 15.5 7 8.5l2.2 7M5.6 13h2.8" {...line} />
      <path d="M15 8.5v7h2.4a1.75 1.75 0 0 0 0-3.5H15h2a1.75 1.75 0 0 0 0-3.5z" {...line} />
    </>
  ),
  ai: (
    <>
      <path d="M10 3.5c.6 4.3 2.2 5.9 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.6 5.9-2.2 6.5-6.5z" fill="currentColor" />
      <path d="M18 14c.3 2.1 1.1 2.9 3.2 3.2-2.1.3-2.9 1.1-3.2 3.2-.3-2.1-1.1-2.9-3.2-3.2 2.1-.3 2.9-1.1 3.2-3.2z" fill="currentColor" />
    </>
  ),
};

const isBrand = (id: SkillIconId): id is SkillIconId & BrandId => id in BRAND_PATHS;

export default function SkillIcon({ id, className }: { id: SkillIconId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {isBrand(id) ? <path d={BRAND_PATHS[id]} fill="currentColor" /> : DRAWN[id]}
    </svg>
  );
}
