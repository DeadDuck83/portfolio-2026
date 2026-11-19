import type { Preview } from '@storybook/react-vite';
// Same order as src/main.tsx: the token variables first, then the site's global CSS.
import '../src/theme/tokens.css';
import '../src/styles/global.css';
import { colors } from '../src/theme/tokens';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        page: { name: 'Page', value: colors.bg },
        section: { name: 'Section', value: colors.bgAlt },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'page' },
  },
};

export default preview;
