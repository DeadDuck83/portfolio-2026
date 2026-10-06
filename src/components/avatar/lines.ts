/**
 * Avatar guide content: pre-rendered lines (ElevenLabs audio + viseme track,
 * built in the hey-avatar repo) and the question chips.
 */
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
  | (typeof WISDOM)[number];

export type Track = {
  text: string;
  words: [string, number][]; // [word, start seconds]
  keys: [number, number][]; // [seconds, viseme]
  duration: number;
};

export const lineAudio = (id: LineId) => `${AVATAR_BASE}/speech/${id}.mp3`;
export const lineTrack = (id: LineId) => `${AVATAR_BASE}/speech/${id}.json`;

/** Somewhere on the site the guide can take the visitor. */
export type Destination = { label: string; to: string };

export type Chip = {
  label: string;
  line?: LineId;
  pick?: readonly LineId[]; // one at random, no repeats until all are heard
  intro?: LineId; // before the first pick only
  go?: string; // navigate here as he starts answering
  offer?: Destination; // a link in his message
  choices?: Destination[]; // follow-up options in his message
};

export const CASE_STUDIES: Destination[] = [
  { label: 'Sage', to: '/work/sage' },
  { label: 'Bexa', to: '/work/bexa' },
  { label: 'Parker & Ace', to: '/work/parker-ace' },
  { label: 'PLMC', to: '/work/plmc' },
];

export const CHIPS: Chip[] = [
  { label: 'Tell me about your work journey', line: 'journey', offer: { label: 'See the journey', to: '/#about' } },
  { label: 'Show me your work', line: 'showwork', go: '/#work' },
  { label: 'Walk me through a case study', line: 'casestudy', choices: CASE_STUDIES },
  { label: 'What are your technical skills?', line: 'skills' },
  { label: 'Are you really an AI?', line: 'realai' },
  { label: 'Words of wisdom', pick: WISDOM, intro: 'wisdomintro' },
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
