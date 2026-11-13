import { describe, expect, it } from 'vitest';
import { ENGAGEMENT, EngagementMeter } from './engagement';

const s = (n: number) => n * 1000;

describe('EngagementMeter', () => {
  it('needs both active time and deliberate input', () => {
    const m = new EngagementMeter(0, true);
    m.check(s(20));
    expect(m.engaged).toBe(false); // 20 s of reading, no input

    const quick = new EngagementMeter(0, true);
    quick.input(s(1));
    quick.input(s(3));
    expect(quick.engaged).toBe(false); // two inputs, only 3 s in

    quick.check(s(15));
    expect(quick.engaged).toBe(true);
  });

  it('does not count a hidden tab', () => {
    const m = new EngagementMeter(0, true);
    m.input(s(1));
    m.input(s(4));
    m.visibility(s(5), false);
    m.check(s(60)); // a minute in the background
    expect(m.active).toBe(s(5));
    m.visibility(s(60), true);
    m.check(s(70));
    expect(m.active).toBe(s(15));
    expect(m.engaged).toBe(true);
  });

  it('stops counting after the visitor goes idle', () => {
    const m = new EngagementMeter(0, true);
    m.input(s(2));
    m.check(s(300)); // left the tab open and walked away
    expect(m.active).toBe(s(2) + ENGAGEMENT.idleMs);
  });

  it('counts a burst of input (one flick, one key-repeat) once', () => {
    const m = new EngagementMeter(0, true);
    for (let t = 1000; t < 1500; t += 50) m.input(t);
    expect(m.inputs).toBe(1);
    m.input(3000);
    expect(m.inputs).toBe(2);
  });

  it('says how long until the time bar could be met', () => {
    const m = new EngagementMeter(0, true);
    m.input(s(5));
    expect(m.msToGo(s(5))).toBe(s(10));
    m.visibility(s(6), false);
    expect(m.msToGo(s(6))).toBeNull(); // hidden: nothing to wait for
  });
});
