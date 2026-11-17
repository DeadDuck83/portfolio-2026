import { describe, expect, it } from 'vitest';
import skillsTrack from '../../../public/avatar/speech/skills.json';
import type { Track } from './lines';
import { FOLLOW_S, SKILL_GROUPS, cueMoments, skillCues, type SkillGroup } from './skills';

const words = (skillsTrack as Track).words;
const when = (word: string, after = 0) => words.find(([w, t]) => w === word && t >= after)![1];

describe('skills screen share cues', () => {
  it('finds every section and tool in the recorded answer, in order', () => {
    const cues = skillCues(words);
    expect(cues).not.toBeNull();
    expect(cues!.groups).toHaveLength(SKILL_GROUPS.length);
    const moments = cues!.groups.flatMap((g, i) => [g, ...cues!.items[i]]);
    expect(moments).toEqual([...moments].sort((a, b) => a - b)); // each appears after the last
    expect(cueMoments(cues!)).toHaveLength(moments.length);
  });

  it('every tool is said out loud, so each lands on its own word', () => {
    const cues = skillCues(words)!;
    SKILL_GROUPS.forEach((g) => g.items.forEach((it) => expect(it.cue, it.label).toBeTruthy()));
    expect(cues.items[0][0]).toBe(when('Figma'));
    // "After Effects", not the "after" in "expert after twenty years"
    expect(cues.items[0][4]).toBe(when('After'));
    // the "A" of "A.B. tests", not "A big part is research"
    expect(cues.items[3][2]).toBe(when('A', when('forms')));
    expect(cues.items[5][2]).toBe(when('Claude'));
  });

  it('shows nothing if the line is re-recorded without a cue word', () => {
    expect(skillCues(words.filter(([w]) => w !== 'Jira'))).toBeNull();
  });
});

describe('a tool he does not name out loud', () => {
  it('joins its section just after the one before it', () => {
    const groups: SkillGroup[] = [
      { title: 'Dev', cue: 'Dev', items: [{ icon: 'react', label: 'React', cue: 'React' }, { icon: 'git', label: 'Git' }] },
    ];
    const cues = skillCues(words, groups)!;
    expect(cues.items[0][1]).toBeCloseTo(when('React') + FOLLOW_S, 5);
  });
});
