/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Component tests need a DOM; jsdom provides one in Node.
    environment: 'jsdom',
    globals: true,
    // Registers @testing-library/jest-dom matchers + auto-cleanup.
    setupFiles: './src/test/setup.ts',
    css: false,
  },
});
