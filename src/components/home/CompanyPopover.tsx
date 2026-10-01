import { useEffect, useId, useRef, useState } from 'react';
import type { AboutCompany } from '../../data/aboutJourney';

export interface CompanyPopoverProps {
  company: AboutCompany;
}

/**
 * A company name in the rail sentence ("…at Mob Media and Metagenics"). The name
 * is a button that opens a small popover with a one-line description, a scale
 * note, and an outbound link — so reviewers can research without leaving the page.
 */
export default function CompanyPopover({ company }: CompanyPopoverProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span className="about-rail__company" ref={wrapRef}>
      <button
        type="button"
        className="about-rail__company-name"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {company.name}
      </button>
      {open && (
        <span id={panelId} role="dialog" aria-label={company.name} className="about-rail__popover">
          <span className="about-rail__popover-blurb">{company.blurb}</span>
          <span className="about-rail__popover-scale">{company.scale}</span>
          <a
            className="about-rail__popover-link"
            href={company.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            Visit <span aria-hidden="true">↗</span>
          </a>
        </span>
      )}
    </span>
  );
}
