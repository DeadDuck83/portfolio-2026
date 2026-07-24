/**
 * Design tokens for the Derek Moore portfolio.
 * Values transcribed 1:1 from the design handoff (README.md "Design Tokens").
 * Keep these in sync with any brand changes — every component reads from here.
 */

export const colors = {
  bg: '#1a1712', // page background
  bgAlt: '#16130e', // alternating sections
  cardActive: '#1d1912', // slider card, active
  cardRest: '#181510', // slider card, rest
  text: '#ece6da', // headings, primary text
  textBody: '#b3a996', // paragraphs
  textMuted: '#8f8674', // labels, eyebrows
  textFaint: '#6f6858', // metadata, italic asides
  textFaintest: '#5c5648', // inactive card tags
  accent: '#848945', // buttons, rules, dots (warm olive)
  accentBright: '#9da767', // italic emphasis, hover, chapter numerals
  accentTint: '#b0b48a', // active nav, outlined-CTA text
  success: '#5a9a6e', // "open to work" — soft forest, not neon
  placeholderBg: '#c9c7c2', // image placeholder fill
  placeholderX: '#b0aea9', // placeholder corner-to-corner X
  placeholderDims: '#55524c', // placeholder pixel dims
  placeholderLabel: '#77746e', // placeholder labels
  buttonTextOnAccent: '#17140f', // solid CTA label
} as const;

export const border = {
  hairline: 'rgba(236,230,218,0.08)',
  hairlineStrong: 'rgba(236,230,218,0.1)',
  hairlineStronger: 'rgba(236,230,218,0.12)',
  hairlineFaint: 'rgba(236,230,218,0.06)',
  chip: 'rgba(236,230,218,0.22)',
  menuButton: 'rgba(236,230,218,0.18)',
  accentSoft: 'rgba(132,137,69,0.4)',
  accentMed: 'rgba(132,137,69,0.5)',
  accentStrong: 'rgba(132,137,69,0.6)',
  gridBg: 'rgba(236,230,218,0.1)',
  gridBgFaint: 'rgba(236,230,218,0.08)',
} as const;

export const fonts = {
  display: "'Instrument Serif', serif",
  mono: "'JetBrains Mono', monospace",
} as const;

/** Shared layout constants used across sections. */
export const layout = {
  maxWidth: 1240,
  sidePad: 'clamp(1.5rem, 6vw, 6rem)',
} as const;
