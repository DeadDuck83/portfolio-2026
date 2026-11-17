import type { LineId, Track } from './lines';

/**
 * "What are your technical skills?" plays like a screen share: while he
 * answers, each section title and tool appears on the page as he names it.
 * Every entry is cued by a word in the line's transcript, so the timing comes
 * from the recording itself, not hand-set seconds. Tools he doesn't say out
 * loud (no `cue`) join their section just after the last one he names.
 */
export const SKILLS_LINE: LineId = 'skills';

export type SkillIconId =
  | 'figma'
  | 'photoshop'
  | 'illustrator'
  | 'indesign'
  | 'aftereffects'
  | 'react'
  | 'swift'
  | 'aws'
  | 'typescript'
  | 'git'
  | 'jira'
  | 'confluence'
  | 'chat'
  | 'interviews'
  | 'forms'
  | 'abtests'
  | 'workshops'
  | 'ai'
  | 'azure'
  | 'sql'
  | 'premiere'
  | 'rive'
  | 'elevenlabs'
  | 'claude';

/** `cue`: the word he says it on. Without one it follows the item before it. */
export type SkillItem = { icon: SkillIconId; label: string; cue?: string };
export type SkillGroup = {
  title: string;
  cue: string;
  items: SkillItem[];
  /** "working knowledge, not mastery": drawn lighter, as he says it */
  soft?: boolean;
};

/** Derek's list (2026-11-17), in the order the re-recorded answer says them. Cues are transcript words, matched in sequence. */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Design',
    cue: 'Design',
    items: [
      { icon: 'figma', label: 'Figma', cue: 'Figma' },
      { icon: 'photoshop', label: 'Photoshop', cue: 'Photoshop' },
      { icon: 'illustrator', label: 'Illustrator', cue: 'Illustrator' },
      { icon: 'indesign', label: 'InDesign', cue: 'InDesign' },
      { icon: 'aftereffects', label: 'After Effects', cue: 'After' },
    ],
  },
  {
    title: 'Dev',
    cue: 'Dev',
    items: [
      { icon: 'react', label: 'React', cue: 'React' },
      { icon: 'swift', label: 'iOS · Swift', cue: 'iOS' },
      { icon: 'aws', label: 'AWS', cue: 'AWS' },
      { icon: 'typescript', label: 'TypeScript', cue: 'TypeScript' },
      { icon: 'git', label: 'Git', cue: 'Git' },
    ],
  },
  {
    title: 'Product',
    cue: 'product',
    items: [
      { icon: 'jira', label: 'Jira', cue: 'Jira' },
      { icon: 'confluence', label: 'Confluence', cue: 'Confluence' },
      { icon: 'chat', label: 'Slack / Teams', cue: 'Slack' },
    ],
  },
  {
    title: 'Research',
    cue: 'research',
    items: [
      { icon: 'interviews', label: 'Interviews', cue: 'interviews' },
      { icon: 'forms', label: 'Forms', cue: 'forms' },
      { icon: 'abtests', label: 'A/B tests', cue: 'A' },
      { icon: 'workshops', label: 'Workshops', cue: 'workshops' },
    ],
  },
  {
    title: 'Working knowledge',
    cue: 'edges',
    soft: true,
    items: [
      { icon: 'ai', label: 'AI pair', cue: 'AI' },
      { icon: 'azure', label: 'Azure', cue: 'Azure' },
      { icon: 'sql', label: 'SQL', cue: 'SQL' },
      { icon: 'premiere', label: 'Premiere', cue: 'Premiere' },
    ],
  },
  {
    title: 'This avatar',
    cue: 'avatar',
    items: [
      { icon: 'rive', label: 'Rive', cue: 'Rive' },
      { icon: 'elevenlabs', label: 'ElevenLabs', cue: 'ElevenLabs' },
      { icon: 'claude', label: 'Claude', cue: 'Claude' },
    ],
  },
];

/** When (seconds into the line) each group title and each item appears. */
export type SkillCues = { groups: number[]; items: number[][] };

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Gap between tools that join a section without being named. */
export const FOLLOW_S = 0.35;

/**
 * Find every cue word in the transcript, each after the one before. Null if
 * any is missing (the line was re-recorded with different wording): better
 * no screen share than one that fires at the wrong moments.
 */
export function skillCues(words: Track['words'], groups: SkillGroup[] = SKILL_GROUPS): SkillCues | null {
  let from = 0;
  const at = (cue: string) => {
    const want = norm(cue);
    for (let i = from; i < words.length; i++) {
      if (norm(words[i][0]) === want) {
        from = i + 1;
        return words[i][1];
      }
    }
    return null;
  };
  const cues: SkillCues = { groups: [], items: [] };
  for (const g of groups) {
    const t = at(g.cue);
    if (t === null) return null;
    cues.groups.push(t);
    const items: number[] = [];
    let last = t;
    for (const it of g.items) {
      const ti = it.cue ? at(it.cue) : last + FOLLOW_S;
      if (ti === null) return null;
      items.push(ti);
      last = ti;
    }
    cues.items.push(items);
  }
  return cues;
}

/** Every cue time, sorted: the moments the screen share changes. */
export const cueMoments = (c: SkillCues) => [...c.groups, ...c.items.flat()].sort((a, b) => a - b);
