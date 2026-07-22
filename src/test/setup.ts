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
