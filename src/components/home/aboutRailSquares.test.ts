import { describe, expect, it } from 'vitest';
import { knockOutFill } from './aboutRailSquares';

describe('knockOutFill', () => {
  it('clears the corner fill and keeps the stroke pixels', () => {
    const width = 2;
    const data = new Uint8ClampedArray([
      40, 40, 40, 255, 255, 255, 255, 255, 40, 40, 40, 255, 40, 40, 40, 255,
    ]);
    expect(knockOutFill(data, width)).toBe(true);
    expect(Array.from(data)).toEqual([
      40, 40, 40, 0, 255, 255, 255, 255, 40, 40, 40, 0, 40, 40, 40, 0,
    ]);
  });

  it('leaves an already transparent frame alone', () => {
    const data = new Uint8ClampedArray(9 * 4);
    data[16] = data[17] = data[18] = data[19] = 255;
    expect(knockOutFill(data, 3)).toBe(false);
    expect(data[19]).toBe(255);
  });

  it('does not treat a minority stroke as the fill', () => {
    const data = new Uint8ClampedArray([
      255, 255, 255, 255, 40, 40, 40, 255, 40, 40, 40, 255, 40, 40, 40, 255,
    ]);
    expect(knockOutFill(data, 2)).toBe(false);
    expect(data[3]).toBe(255);
    expect(data[7]).toBe(255);
  });
});
