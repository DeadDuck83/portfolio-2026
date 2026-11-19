import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-mcp"],
  "framework": "@storybook/react-vite",
  // No usage telemetry (decided 2026-11-19). Set STORYBOOK_DISABLE_TELEMETRY=true
  // as well to stop the one boot event Storybook sends before reading this file.
  "core": { "disableTelemetry": true }
};
export default config;