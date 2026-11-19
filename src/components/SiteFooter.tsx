import { Link } from 'react-router';
import Wordmark from './Wordmark';
import EmailLink from './EmailLink';
import MotionToggle from './MotionToggle';
import { border, colors, layout } from '../theme/tokens';
import { accentLinkHover } from '../lib/hover';
import { track } from '../lib/analytics';

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
      data-chassis-handle
      title="Drag up"
      style={{
        borderTop: `1px solid ${border.hairline}`,
        background: variant === 'case' ? colors.bgAlt : undefined,
        cursor: 'grab',
        touchAction: 'pan-x',
        userSelect: 'none',
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem 1.6rem' }}>
          {variant === 'home' ? (
            <>
              <a href="#about" style={linkStyle} {...accentLinkHover(colors.textMuted)}>
                About
              </a>
              <a href="#work" style={linkStyle} {...accentLinkHover(colors.textMuted)}>
                Work
              </a>
              <a
                href="#contact"
                style={linkStyle}
                {...accentLinkHover(colors.textMuted)}
                onClick={() => track('GetInTouchClick', { source: 'footer' })}
              >
                Contact
              </a>
            </>
          ) : (
            <>
              <Link to="/#work" style={linkStyle} {...accentLinkHover(colors.textMuted)}>
                All work
              </Link>
              <EmailLink style={linkStyle} {...accentLinkHover(colors.textMuted)} source="footer">
                Contact
              </EmailLink>
            </>
          )}
          {/* the site-wide pause for the videos and animations: tucked down
              here so it doesn't take room in the header */}
          <MotionToggle source="footer" style={linkStyle} {...accentLinkHover(colors.textMuted)} />
        </div>

        <div style={{ fontSize: '0.66rem', letterSpacing: '0.1em', color: colors.textFaint }}>
          © 2026 · Mission Viejo, CA
        </div>
      </div>
    </footer>
  );
}
