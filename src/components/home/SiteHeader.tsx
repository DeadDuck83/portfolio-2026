import { useEffect, useState } from 'react';
import Wordmark from '../Wordmark';
import { border, colors, fonts, layout, radius } from '../../theme/tokens';
import { accentLinkHover } from '../../lib/hover';
import Button from '../../ui/Button';
import { track } from '../../lib/analytics';

const MOBILE_BP = 820;

const navLinkStyle = {
  fontSize: '0.72rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: colors.textBody,
};

/**
 * Home page header — fixed, blurred, and hidden while the hero's name column
 * is on screen. Above 820px shows About / Work / Contact (Contact outlined);
 * below it collapses to a Menu button toggling a stacked link list.
 */
export default function SiteHeader() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BP,
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const m = window.innerWidth < MOBILE_BP;
      setIsMobile((prev) => {
        if (m !== prev && !m) setMenuOpen(false);
        return m;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // The hero's name column carries name, title and links, so the bar stays
  // tucked away until that column has scrolled out of view.
  const [revealed, setRevealed] = useState(false);
  // Vertical position only: an IntersectionObserver would also see the page's
  // horizontal entrance slide (PageTransition) and reveal the bar on load.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const heroId = document.querySelector('[data-hero-id]');
      // Show once the name column is mostly scrolled away.
      const gone = heroId
        ? heroId.getBoundingClientRect().bottom < window.innerHeight * 0.35
        : true;
      setRevealed(gone);
      if (!gone) setMenuOpen(false);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      data-site-header
      inert={!revealed}
      aria-hidden={!revealed}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        transform: revealed ? 'none' : 'translateY(-105%)',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        background: 'rgba(26,23,18,0.72)',
        borderBottom: `1px solid ${border.hairline}`,
      }}
    >
      <div
        style={{
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          padding: `1.1rem ${layout.sidePad}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <a href="#top">
          <Wordmark size={1.6} />
        </a>

        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2.2rem' }}>
            <a href="#about" style={navLinkStyle} {...accentLinkHover(colors.textBody)}>
              About
            </a>
            <a href="#work" style={navLinkStyle} {...accentLinkHover(colors.textBody)}>
              Work
            </a>
            <Button
              variant="outline"
              size="compact"
              href="#contact"
              onClick={() => track('GetInTouchClick', { source: 'header' })}
            >
              Contact
            </Button>
          </nav>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: 'none',
              border: `1px solid ${border.menuButton}`,
              borderRadius: radius.control,
              color: colors.text,
              fontFamily: fonts.text,
              fontSize: '0.68rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              padding: '0.55rem 0.9rem',
              cursor: 'pointer',
            }}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        )}
      </div>

      {isMobile && menuOpen && (
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: `0.4rem ${layout.sidePad} 1.4rem`,
            borderTop: `1px solid ${border.hairlineFaint}`,
          }}
        >
          <a
            href="#about"
            onClick={closeMenu}
            style={{
              padding: '0.85rem 0',
              fontSize: '0.8rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: colors.textBody,
              borderBottom: `1px solid ${border.hairlineFaint}`,
            }}
          >
            About
          </a>
          <a
            href="#work"
            onClick={closeMenu}
            style={{
              padding: '0.85rem 0',
              fontSize: '0.8rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: colors.textBody,
              borderBottom: `1px solid ${border.hairlineFaint}`,
            }}
          >
            Work
          </a>
          <a
            href="#contact"
            onClick={() => {
              track('GetInTouchClick', { source: 'menu' });
              closeMenu();
            }}
            style={{
              padding: '0.85rem 0',
              fontSize: '0.8rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: colors.accentTint,
            }}
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}
