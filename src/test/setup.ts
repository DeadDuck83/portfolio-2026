import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount React trees between tests so they don't leak into one another.
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement IntersectionObserver, which the reveal system and the
// outcome count-up rely on. A no-op stub lets those components mount without
// firing (elements simply render in their initial, visible state).
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);

// jsdom leaves these unimplemented; stub them so navigation/scroll code is quiet.
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

// jsdom has no matchMedia. Default every query to "not matching" (so pointer /
// reduced-motion feature detection resolves to the interactive path); individual
// tests override window.matchMedia when they need a specific media state.
window.matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
