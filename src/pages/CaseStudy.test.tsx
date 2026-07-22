import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import CaseStudy from './CaseStudy';
import { plmc } from '../data/caseStudies/plmc';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/" element={<div>HOME</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CaseStudy page', () => {
  it('renders the PLMC case study for its slug', () => {
    renderAt('/work/plmc');
    expect(screen.getByText(plmc.eyebrowRight)).toBeInTheDocument();
    // Headline accent phrase renders in its own span.
    expect(screen.getByText(plmc.headlineAccent)).toBeInTheDocument();
    // Chapter nav is present.
    expect(screen.getByText('00 Brief')).toBeInTheDocument();
  });

  it('drives content from the data object (meta + decisions)', () => {
    renderAt('/work/plmc');
    expect(screen.getByText(plmc.meta.role)).toBeInTheDocument();
    expect(screen.getByText(plmc.process.decisions[0].title)).toBeInTheDocument();
  });

  it('redirects an unknown slug back to home', () => {
    renderAt('/work/does-not-exist');
    expect(screen.getByText('HOME')).toBeInTheDocument();
    expect(screen.queryByText(plmc.eyebrowRight)).toBeNull();
  });
});
