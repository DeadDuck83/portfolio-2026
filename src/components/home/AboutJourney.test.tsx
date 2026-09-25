import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutJourney from './AboutJourney';
import { aboutChapters, aboutToday } from '../../data/aboutJourney';
import { createRunner } from './aboutJourneyRunner';

vi.mock('@rive-app/react-canvas', () => ({
  useRive: () => ({ rive: null, RiveComponent: () => null }),
  useViewModelInstanceNumber: () => ({ value: null, setValue: () => {} }),
  Layout: class {
    constructor() {}
  },
  Fit: { Cover: 'cover', Contain: 'contain' },
  Alignment: { Center: 'center', TopCenter: 'topCenter' },
}));

// jsdom has no media playback; mock the runner so no <video> ever loads.
vi.mock('./aboutJourneyRunner', () => ({
  createRunner: vi.fn(() => ({ place: vi.fn(), start: vi.fn(), destroy: vi.fn() })),
}));

const originalMatchMedia = window.matchMedia;

function mockStackQuery(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('max-width: 880px') ? matches : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe('AboutJourney', () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.clearAllMocks();
  });

  it('renders the intro, every chapter and the Today stats', () => {
    render(<AboutJourney />);
    expect(screen.getByRole('heading', { level: 2, name: /nonlinear path/i })).toBeInTheDocument();
    for (const c of aboutChapters) {
      expect(screen.getByText(c.discipline)).toBeInTheDocument();
      expect(screen.getByText(c.lesson)).toBeInTheDocument();
    }
    for (const s of aboutToday.stats) {
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }
  });

  it('keeps the #about anchor the header and footer link to', () => {
    const { container } = render(<AboutJourney />);
    expect(container.querySelector('section#about')).not.toBeNull();
  });

  it('pins on desktop and keeps Today inert until it rises', () => {
    mockStackQuery(false);
    const { container } = render(<AboutJourney />);
    expect(container.querySelector('section')).toHaveAttribute('data-mode', 'pin');
    expect(container.querySelector('.about-journey__today')).toHaveProperty('inert', true);
    expect(screen.queryByRole('link', { name: /the work/i })).not.toBeInTheDocument();
  });

  it('stacks on narrow / short viewports and when pinning is off', () => {
    mockStackQuery(true);
    const { container, unmount } = render(<AboutJourney />);
    expect(container.querySelector('section')).toHaveAttribute('data-mode', 'stack');
    unmount();

    mockStackQuery(false);
    const off = render(<AboutJourney pinned={false} />);
    expect(off.container.querySelector('section')).toHaveAttribute('data-mode', 'stack');
  });

  it('mounts the pixel runner canvas and creates it in pin mode', () => {
    mockStackQuery(false);
    const { container } = render(<AboutJourney />);
    expect(container.querySelector('canvas.about-journey__runner')).not.toBeNull();
    expect(createRunner).toHaveBeenCalled();
  });

  it('never creates the runner when runner is off', () => {
    mockStackQuery(false);
    render(<AboutJourney runner={false} />);
    expect(createRunner).not.toHaveBeenCalled();
  });
});
