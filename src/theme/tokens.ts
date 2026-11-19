/**
 * Design tokens for the Derek Moore portfolio, in two layers:
 *
 * 1. `primitive`: raw values, named by what they are (olive500 is a colour,
 *    not a job). Translucent colours are primitives too, named after their
 *    base colour plus alpha (sand100A08 = sand100 at 8%).
 * 2. Semantic roles (`colors`, `border`, `fonts`, `weights`, `radius`): named
 *    by what they do, and each points at a primitive. `semantic` groups them.
 *
 * src/theme/tokens.css is generated from this file (`npm run tokens`); a test
 * fails if it falls behind. Components read roles, never primitives.
 */

export const primitive = {
  // warm near-blacks, light to dark
  umber910: '#1d1912',
  umber920: '#1a1712',
  umber930: '#181510',
  umber940: '#17140f',
  umber950: '#16130e',

  // warm sand for text, light to dark, then sand100 translucent
  sand100: '#ece6da',
  sand300: '#b3a996',
  sand400: '#8f8674',
  sand500: '#6f6858',
  sand600: '#5c5648',
  sand100A06: 'rgba(236,230,218,0.06)',
  sand100A08: 'rgba(236,230,218,0.08)',
  sand100A10: 'rgba(236,230,218,0.1)',
  sand100A12: 'rgba(236,230,218,0.12)',
  sand100A15: 'rgba(236,230,218,0.15)',
  sand100A18: 'rgba(236,230,218,0.18)',
  sand100A22: 'rgba(236,230,218,0.22)',

  // warm olive accent, light to dark, then olive500 translucent
  olive300: '#b0b48a',
  olive400: '#9da767',
  olive500: '#848945',
  olive500A14: 'rgba(132,137,69,0.14)',
  olive500A40: 'rgba(132,137,69,0.4)',
  olive500A50: 'rgba(132,137,69,0.5)',
  olive500A60: 'rgba(132,137,69,0.6)',

  forest500: '#5a9a6e',

  // neutral greys (image placeholders)
  stone200: '#c9c7c2',
  stone300: '#b0aea9',
  stone500: '#77746e',
  stone700: '#55524c',

  fontBigShoulders: "'Big Shoulders', 'Arial Narrow', sans-serif",
  fontHostGrotesk: "'Host Grotesk', system-ui, sans-serif",

  weight800: 800,

  radius8: '8px',
} as const;

export const colors = {
  bg: primitive.umber920, // page background
  bgAlt: primitive.umber950, // alternating sections
  cardActive: primitive.umber910, // slider card, active
  cardRest: primitive.umber930, // slider card, rest
  text: primitive.sand100, // headings, primary text
  textBody: primitive.sand300, // paragraphs
  textMuted: primitive.sand400, // labels, eyebrows
  textFaint: primitive.sand500, // metadata, italic asides
  textFaintest: primitive.sand600, // inactive card tags
  accent: primitive.olive500, // buttons, rules, dots (warm olive)
  accentBright: primitive.olive400, // italic emphasis, hover, chapter numerals
  accentTint: primitive.olive300, // active nav, outlined-CTA text
  accentWash: primitive.olive500A14, // outline-button hover fill
  success: primitive.forest500, // "open to work" — soft forest, not neon
  placeholderBg: primitive.stone200, // image placeholder fill
  placeholderX: primitive.stone300, // placeholder corner-to-corner X
  placeholderDims: primitive.stone700, // placeholder pixel dims
  placeholderLabel: primitive.stone500, // placeholder labels
  buttonTextOnAccent: primitive.umber940, // solid CTA label
} as const;

/**
 * Light "paper" counterpart to the dark palette — only used by the About
 * journey's scroll theme shift, which blends between the two. Kept as plain
 * values outside both layers, because aboutJourneyEngine.ts reads and blends
 * them in JavaScript.
 */
export const paper = {
  bg: '#ebe5d8',
  card: '#f4efe6',
  text: '#1a1712',
  textBody: '#4f4a40',
  textMuted: '#665f4f',
  accentBright: '#5f6530',
  rule: 'rgba(26,23,18,0.28)',
  edge: 'rgba(26,23,18,0.14)',
  chip: 'rgba(26,23,18,0.22)',
} as const;

export const border = {
  hairline: primitive.sand100A08,
  hairlineStrong: primitive.sand100A10,
  hairlineStronger: primitive.sand100A12,
  hairlineFaint: primitive.sand100A06,
  chip: primitive.sand100A22,
  menuButton: primitive.sand100A18,
  control: primitive.sand100A15, // outline-button border
  accentSoft: primitive.olive500A40,
  accentMed: primitive.olive500A50,
  accentStrong: primitive.olive500A60,
  gridBg: primitive.sand100A10,
  gridBgFaint: primitive.sand100A08,
} as const;

/**
 * Type (Nov 2026, Derek's pick): Big Shoulders for display (names, headings,
 * numerals; has an optical-size axis), Host Grotesk for everything else.
 * Display text runs heavy; small titles and subtitles use the text face.
 */
export const fonts = {
  display: primitive.fontBigShoulders,
  text: primitive.fontHostGrotesk,
} as const;

export const weights = {
  display: primitive.weight800,
} as const;

/**
 * One corner radius for buttons, work tiles and the avatar card, so they read
 * as one family (hero.css uses the same 8px).
 */
export const radius = { control: primitive.radius8 } as const;

/**
 * Shared layout constants used across sections. Not aliased to primitives:
 * sidePad is a fluid clamp(), not a raw value.
 */
export const layout = {
  maxWidth: 1240,
  sidePad: 'clamp(1.5rem, 6vw, 6rem)',
} as const;

/** The semantic layer, grouped. Group names become CSS prefixes (--color-bg). */
export const semantic = {
  color: colors,
  border,
  font: fonts,
  fontWeight: weights,
  radius,
  layout,
} as const;
