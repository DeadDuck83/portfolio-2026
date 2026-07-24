/**
 * Content model for a case study. Every case study is one object of this
 * shape rendered by <CaseStudyLayout>; new case studies (Parker & Ace, Bexa,
 * Sage) are new data files, not new layouts. Structure mirrors the chapter
 * flow: 00 Brief → 01 Context → 02 Users → 03 Process → 04 Solution →
 * 05 Outcome → Next-case footer.
 */

/** A gray placeholder figure block. Final imagery drops in at `dims` later. */
export interface Figure {
  /** Top-left label, shown as "Placeholder · {placeholder}". */
  placeholder: string;
  /** Required export size, e.g. "2880 × 1260". */
  dims: string;
  /** CSS aspect-ratio, e.g. "16/7". */
  aspect: string;
  /** Centered description under the dimensions. */
  innerLabel: string;
  /** Solution screens lift -6px on hover. */
  hoverLift?: boolean;
  /** Optional caption rendered beneath the figure. */
  caption?: FigureCaption;
  /** Final image path under /public when the asset is ready. */
  src?: string;
  /** Accessible alt text; defaults to `innerLabel` when omitted. */
  alt?: string;
}

export interface FigureCaption {
  /** Small accent tag, e.g. "FIG. A" or "01". */
  tag?: string;
  /** Serif lead phrase. */
  lead?: string;
  /**
   * When true the lead is rendered inline (serif, bright) immediately before
   * `desc` (solution details); otherwise it is its own serif block.
   */
  leadInline?: boolean;
  /** Muted description text. */
  desc?: string;
}

/** A stat in the 05 Outcome band. Numeric targets count up on scroll. */
export interface OutcomeStat {
  /**
   * "count" animates from 0 → `to`, optionally rendered as "{value} → 1".
   * "static" shows `display` verbatim (e.g. "0 → 1").
   */
  kind: 'count' | 'static';
  /** For kind:"count" — the target integer. */
  to?: number;
  /** For kind:"count" — appended after the counted value (e.g. " → 1"). */
  suffix?: string;
  /** For kind:"static" — the literal display string. */
  display?: string;
  /** Caption under the number. */
  label: string;
}

/** A collapsible row in the 03 Process decision log. */
export interface Decision {
  title: string;
  /** "The call". */
  choice: string;
  /** "What it cost". */
  cost: string;
}

export interface Persona {
  /** e.g. "User 01". */
  label: string;
  name: string;
  /** Italic serif subtitle. */
  subtitle: string;
  /** Three em-dash needs. */
  needs: string[];
}

/** A chapter-heading trio: accent numeral, uppercase label, italic subtitle. */
export interface ChapterMeta {
  numeral: string;
  label: string;
  subtitle: string;
}

export interface CaseStudy {
  /** URL slug, e.g. "plmc". */
  slug: string;
  /** Two-digit case number, e.g. "04". Also the ghost numeral behind the hero. */
  caseNumber: string;
  /** Right eyebrow text, e.g. "PLMC · Personalized Lifestyle Medical Center". */
  eyebrowRight: string;

  // 00 Brief / Hero
  headlineLead: string;
  headlineAccent: string;
  intro: string;
  tldr: string;
  meta: { role: string; org: string; timeline: string; scope: string };
  heroFigure: Figure;

  // 01 Context
  context: {
    chapter: ChapterMeta;
    h2: string;
    paragraphs: string[];
    panelLabel: string;
    chips: string[];
    captionBefore: string;
    captionAfter: string;
  };

  // 02 Users
  users: {
    chapter: ChapterMeta;
    h2: string;
    personas: [Persona, Persona];
    pullLead: string;
    pullAccent: string;
  };

  // 03 Process
  process: {
    chapter: ChapterMeta;
    h2: string;
    paragraph: string;
    decisions: Decision[];
    figures: Figure[];
  };

  // 04 Solution
  solution: {
    chapter: ChapterMeta;
    principles: { numeral: string; text: string }[];
    figures: Figure[];
  };

  // 05 Outcome
  outcome: {
    chapter: ChapterMeta;
    stats: OutcomeStat[];
    closingParagraph: string;
    ifIDidItAgain: string;
  };

  // Next-case footer
  nextCase: {
    label: string;
    /** Italic serif note after the name. */
    note?: string;
    /** Internal route if the next case exists; omit for "Brewing." states. */
    to?: string;
  };
}
