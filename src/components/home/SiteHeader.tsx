import { useEffect, useState } from 'react';
import Wordmark from '../Wordmark';
import { border, colors, fonts, layout } from '../../theme/tokens';
import { accentLinkHover, outlinedCtaHover } from '../../lib/hover';

const MOBILE_BP = 820;

const navLinkStyle = {
  fontSize: '0.72rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: colors.textBody,
};

/**
 * Home page header — sticky, blurred. Above 820px shows About / Work / Contact
 * (Contact outlined); below it collapses to a Menu button toggling a stacked
 * link list.
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
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
            <a
              href="#contact"
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '0.55rem 1.1rem',
                border: `1px solid ${border.accentMed}`,
                color: colors.accentTint,
              }}
              {...outlinedCtaHover}
            >
              Contact
            </a>
          </nav>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: 'none',
              border: `1px solid ${border.menuButton}`,
              color: colors.text,
              fontFamily: fonts.mono,
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
            onClick={closeMenu}
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
