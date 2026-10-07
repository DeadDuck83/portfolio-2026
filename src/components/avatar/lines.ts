/**
 * Avatar guide content: pre-rendered lines (ElevenLabs audio + viseme track,
 * built in the hey-avatar repo) and the question chips.
 */
import type { GuideFocus } from '../../lib/guide';

export const AVATAR_BASE = '/avatar';

export const WISDOM = ['wisdom1', 'wisdom2', 'wisdom3', 'wisdom4', 'wisdom5', 'wisdom6', 'wisdom7'] as const;

export type LineId =
  | 'join'
  | 'showwork'
  | 'journey'
  | 'casestudy'
  | 'skills'
  | 'realai'
  | 'wisdomintro'
  | 'tourintro'
  | 'tour1'
  | 'tour2'
  | 'tour3'
  | 'tour4'
  | 'tour5'
  | 'shirt'
  | 'shirt0'
  | 'shirt1'
  | 'shirt2'
  | 'shirt4'
  | 'footer'
  | 'typing'
  | (typeof WISDOM)[number];

export type Track = {
  text: string;
  words: [string, number][]; // [word, start seconds]
  keys: [number, number][]; // [seconds, viseme]
  cues?: [number, number][]; // [seconds, cue] - head/brow accents: 1 phrase, 2 beat, 3 question, 4 smile, 5 ponder
  duration: number;
};

export const lineAudio = (id: LineId) => `${AVATAR_BASE}/speech/${id}.mp3`;
export const lineTrack = (id: LineId) => `${AVATAR_BASE}/speech/${id}.json`;

/** Somewhere on the site the guide can take the visitor. */
export type Destination = { label: string; to: string };

/** One stop on a guided tour: optionally bring part of the page into focus, then say a line. */
export type TourStep = { line: LineId; focus?: GuideFocus };

export type Chip = {
  label: string;
  line?: LineId;
  pick?: readonly LineId[]; // one at random, no repeats until all are heard
  intro?: LineId; // before the first pick only
  go?: string; // navigate here as he starts answering
  offer?: Destination; // a link in his message
  choices?: Destination[]; // follow-up options in his message
  tour?: TourStep[]; // a guided walk through part of the site, step by step
  shirts?: boolean; // offer Derek's other shirts in his message
};

/**
 * Derek's other Hawaiian shirts (the avatar's `shirt` value) and his reaction
 * when you pick one - a short line, or (no line) just a big grin.
 */
export type Shirt = { id: number; label: string; line?: LineId };
export const SHIRTS: Shirt[] = [
  { id: 1, label: 'Light blue', line: 'shirt1' }, // "Nice!"
  { id: 2, label: 'Red', line: 'shirt2' }, // "Bold. I like it."
  { id: 3, label: 'Beige' }, // a delighted grin, no words
  { id: 4, label: 'Green', line: 'shirt4' }, // "Good choice."
  { id: 0, label: 'The original', line: 'shirt0' }, // "Good call."
];

export const CASE_STUDIES: Destination[] = [
  { label: 'Sage', to: '/work/sage' },
  { label: 'Bexa', to: '/work/bexa' },
  { label: 'Parker & Ace', to: '/work/parker-ace' },
  { label: 'PLMC', to: '/work/plmc' },
];

export const CHIPS: Chip[] = [
  {
    // walks the "nonlinear path" section, anchoring each chapter as he talks
    label: 'Tell me about your work journey',
    go: '/#about',
    tour: [
      { line: 'tourintro' },
      { line: 'tour1', focus: { section: 'about', step: 1 } },
      { line: 'tour2', focus: { section: 'about', step: 2 } },
      { line: 'tour3', focus: { section: 'about', step: 3 } },
      { line: 'tour4', focus: { section: 'about', step: 4 } },
      { line: 'tour5', focus: { section: 'about', step: 5 } }, // "Today, I bring it together"
    ],
  },
  { label: 'Show me your work', line: 'showwork', go: '/#work' },
  { label: 'Walk me through a case study', line: 'casestudy', choices: CASE_STUDIES },
  { label: 'What are your technical skills?', line: 'skills' },
  { label: 'Are you really an AI?', line: 'realai' },
  { label: 'Words of wisdom', pick: WISDOM, intro: 'wisdomintro' },
  { label: 'I like your shirt', line: 'shirt', shirts: true },
];

/** Character offset where each word of `track.words` ends inside `track.text`. */
export function wordEnds(track: Track): number[] {
  const ends: number[] = [];
  let from = 0;
  for (const [w] of track.words) {
    const i = track.text.indexOf(w, from);
    if (i >= 0) from = i + w.length;
    ends.push(from);
  }
  return ends;
}

/** Shuffle bag: every item once before any repeat, never the same twice in a row. */
export function makeBag<T>(items: readonly T[], random: () => number = Math.random) {
  let bag: T[] = [];
  let last: T | undefined;
  return (): T => {
    if (bag.length === 0) {
      bag = [...items].sort(() => random() - 0.5);
      if (bag.length > 1 && bag[0] === last) bag.push(bag.shift()!);
    }
    last = bag.shift()!;
    return last;
  };
}
