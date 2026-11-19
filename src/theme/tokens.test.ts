import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as tokens from './tokens';
import { buildTokensCss, cssName } from './tokensCss';

describe('design tokens', () => {
  it('tokens.css is up to date with tokens.ts (run `npm run tokens` if this fails)', () => {
    // Path from the project root: under jsdom, import.meta.url isn't a file: URL.
    const css = readFileSync(resolve(process.cwd(), 'src/theme/tokens.css'), 'utf8');
    expect(css).toBe(buildTokensCss(tokens));
  });

  it('gives every primitive a unique value, so each role resolves to one primitive', () => {
    const values = Object.values(tokens.primitive);
    expect(new Set(values).size).toBe(values.length);
  });

  it('points every role at a primitive, except layout', () => {
    const primitives = new Set<string | number>(Object.values(tokens.primitive));
    for (const [group, roles] of Object.entries(tokens.semantic)) {
      if (group === 'layout') continue;
      for (const [role, value] of Object.entries(roles)) {
        expect(primitives.has(value), `${group}.${role} is not a primitive value`).toBe(true);
      }
    }
  });

  it('names CSS variables the way the Figma code syntax expects', () => {
    expect(cssName('olive500')).toBe('olive-500');
    expect(cssName('sand100A08')).toBe('sand-100-a08');
    expect(cssName('textBody')).toBe('text-body');
    expect(buildTokensCss(tokens)).toContain('--color-accent: var(--olive-500);');
  });
});
