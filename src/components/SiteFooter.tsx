import { Link } from 'react-router';
import Wordmark from './Wordmark';
import EmailLink from '../ui/EmailLink';
import MotionToggle from './MotionToggle';
import TextLink from '../ui/TextLink';
import { textLinkClass } from '../ui/textLinkClass';
import { border, colors, layout } from '../theme/tokens';
import { track } from '../lib/analytics';

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
              <TextLink href="#about">About</TextLink>
              <TextLink href="#work">Work</TextLink>
              <TextLink href="#contact" onClick={() => track('GetInTouchClick', { source: 'footer' })}>
                Contact
              </TextLink>
            </>
          ) : (
            <>
              <Link to="/#work" className={textLinkClass()}>
                All work
              </Link>
              <EmailLink className={textLinkClass()} plain={false} source="footer">
                Contact
              </EmailLink>
            </>
          )}
          {/* the site-wide pause for the videos and animations: tucked down
              here so it doesn't take room in the header */}
          <MotionToggle source="footer" className={textLinkClass()} />
        </div>

        <div style={{ fontSize: '0.66rem', letterSpacing: '0.1em', color: colors.textFaint }}>
          © 2026 · Mission Viejo, CA
        </div>
      </div>
    </footer>
  );
}
