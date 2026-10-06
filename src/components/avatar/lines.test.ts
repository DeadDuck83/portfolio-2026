import { describe, expect, it } from 'vitest';
import { makeBag, wordEnds, type Track } from './lines';

describe('wordEnds', () => {
  it('maps each spoken word to the end of it in the display text', () => {
    const track = { text: "Hey — you made it.", words: [['Hey', 0], ['you', 0.6], ['made', 0.7], ['it', 1]] } as Track;
    expect(wordEnds(track)).toEqual([3, 9, 14, 17]);
  });
});

describe('makeBag', () => {
  it('plays every item once before repeating, and never twice in a row', () => {
    const next = makeBag(['a', 'b', 'c']);
    const seen = [next(), next(), next()];
    expect(new Set(seen).size).toBe(3);
    let prev = seen[2];
    for (let i = 0; i < 60; i++) {
      const v = next();
      expect(v).not.toBe(prev);
      prev = v;
    }
  });
});
