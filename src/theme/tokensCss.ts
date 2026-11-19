/**
 * Builds the text of src/theme/tokens.css from the token module.
 *
 * Kept free of imports on purpose: scripts/tokens.mjs runs it on Node 20,
 * which can't load TypeScript, by stripping the types file by file.
 */

type TokenValue = string | number;
type TokenGroup = Readonly<Record<string, TokenValue>>;

export interface TokenModule {
  primitive: TokenGroup;
  semantic: Readonly<Record<string, TokenGroup>>;
}

/** olive500 → olive-500, sand100A08 → sand-100-a08, textBody → text-body. */
export function cssName(key: string): string {
  return key
    .replace(/([a-z])([0-9])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/** Semantic groups whose bare numbers are pixels (React's inline-style rule). */
const PX_GROUPS = new Set(['layout']);

export function buildTokensCss({ primitive, semantic }: TokenModule): string {
  // Roles hold resolved values, so find each role's primitive by value.
  // A test keeps primitive values unique, so the lookup is never ambiguous.
  const primitiveByValue = new Map<TokenValue, string>();
  for (const [key, value] of Object.entries(primitive)) primitiveByValue.set(value, key);

  const lines = [
    '/* Generated from src/theme/tokens.ts by `npm run tokens`. Do not edit by hand. */',
    '',
    ':root {',
    '  /* Primitives: raw values */',
  ];
  let family = '';
  for (const [key, value] of Object.entries(primitive)) {
    const next = key.match(/^[a-z]+/)?.[0] ?? key;
    if (family && next !== family) lines.push('');
    family = next;
    lines.push(`  --${cssName(key)}: ${value};`);
  }

  lines.push('', '  /* Semantic: roles, each pointing at a primitive */');
  for (const [i, [group, roles]] of Object.entries(semantic).entries()) {
    if (i > 0) lines.push('');
    for (const [role, value] of Object.entries(roles)) {
      const ref = primitiveByValue.get(value);
      const css = ref
        ? `var(--${cssName(ref)})`
        : typeof value === 'number' && PX_GROUPS.has(group)
          ? `${value}px`
          : String(value);
      lines.push(`  --${cssName(group)}-${cssName(role)}: ${css};`);
    }
  }
  lines.push('}', '');
  return lines.join('\n');
}
