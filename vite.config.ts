/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** localhost only: an orange "D" in the tab, so the test tab is easy to tell from the live site. */
const devFavicon: Plugin = {
  name: 'dev-favicon',
  apply: 'serve',
  transformIndexHtml: (html) => html.replace('href="/favicon.svg"', 'href="/favicon-dev.svg"'),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devFavicon],
  test: {
    // Component tests need a DOM; jsdom provides one in Node.
    environment: 'jsdom',
    globals: true,
    // Registers @testing-library/jest-dom matchers + auto-cleanup.
    setupFiles: './src/test/setup.ts',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx'],
    },
  },
});
