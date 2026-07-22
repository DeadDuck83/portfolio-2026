import { Link } from 'react-router';
import Wordmark from './Wordmark';
import { border, colors, layout } from '../theme/tokens';
import { accentLinkHover } from '../lib/hover';

const linkStyle = {
  fontSize: '0.66rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: colors.textMuted,
};

/**
 * Shared footer. `variant="home"` links to the on-page sections; `variant="case"`
 * is the compact case-study variant (dark bg, cross-route "All work" link).
 */
export default function SiteFooter({ variant = 'home' }: { variant?: 'home' | 'case' }) {
  return (
    <footer
      style={{
        borderTop: `1px solid ${border.hairline}`,
        background: variant === 'case' ? colors.bgAlt : undefined,
      }}
    >
      <div
        style={{
          maxWidth: layout.maxWidth,
          margin: '0 auto',
          padding: `2.4rem ${layout.sidePad}`,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.2rem',
        }}
      >
        <Wordmark size={1.3} />

        <div style={{ display: 'flex', gap: '1.6rem' }}>
          {variant === 'home' ? (
            <>
              <a href="#about" style={linkStyle} {...accentLinkHover(colors.textMuted)}>
                About
              </a>
              <a href="#work" style={linkStyle} {...accentLinkHover(colors.textMuted)}>
                Work
              </a>
              <a href="#contact" style={linkStyle} {...accentLinkHover(colors.textMuted)}>
                Contact
              </a>
            </>
          ) : (
            <>
              <Link to="/#work" style={linkStyle} {...accentLinkHover(colors.textMuted)}>
                All work
              </Link>
              <a
                href="mailto:moore8577@gmail.com"
                style={linkStyle}
                {...accentLinkHover(colors.textMuted)}
              >
                Contact
              </a>
            </>
          )}
        </div>

        <div style={{ fontSize: '0.66rem', letterSpacing: '0.1em', color: colors.textFaint }}>
          © 2026 · Mission Viejo, CA
        </div>
      </div>
    </footer>
  );
}
