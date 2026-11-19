// Regenerates src/theme/tokens.css from src/theme/tokens.ts (`npm run tokens`).
//
// Node 20 can't run TypeScript, so this strips the types with the TypeScript
// compiler the project already depends on, then imports the plain JavaScript.
// No new packages. Both files are import-free, so each loads on its own.
import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

async function load(path) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const tokens = await load('src/theme/tokens.ts');
const { buildTokensCss } = await load('src/theme/tokensCss.ts');

writeFileSync(new URL('../src/theme/tokens.css', import.meta.url), buildTokensCss(tokens));
console.log('Wrote src/theme/tokens.css');
