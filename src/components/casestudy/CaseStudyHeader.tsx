import { Link } from 'react-router';
import Wordmark from '../Wordmark';
import EmailLink from '../EmailLink';
import { border, colors } from '../../theme/tokens';
import { outlinedCtaHover } from '../../lib/hover';

export interface Chapter {
  id: string;
  label: string;
}

/**
 * Case-study header: wordmark + "All work"/Contact, plus a second row with a
 * horizontally scrollable chapter nav. The active chapter (from scroll-spy)
 * gets accent-tint text and a 2px accent underline. Links jump to #c0…#c5.
 */
export default function CaseStudyHeader({
  chapters,
  active,
}: {
  chapters: Chapter[];
  active: number;
}) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        background: 'rgba(26,23,18,0.78)',
        borderBottom: `1px solid ${border.hairline}`,
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '1rem clamp(1.5rem, 6vw, 6rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <Link to="/">
          <Wordmark size={1.5} />
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.9rem, 3vw, 2rem)' }}>
          <Link
            to="/#work"
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.textBody,
              whiteSpace: 'nowrap',
            }}
          >
            ← All work
          </Link>
          <EmailLink
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '0.5rem clamp(0.6rem, 2vw, 1rem)',
              border: `1px solid ${border.accentMed}`,
              color: colors.accentTint,
              whiteSpace: 'nowrap',
            }}
            {...outlinedCtaHover}
          >
            Contact
          </EmailLink>
        </nav>
      </div>

      <nav style={{ borderTop: `1px solid ${border.hairlineFaint}`, overflowX: 'auto' }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 6vw, 6rem)',
            display: 'flex',
            gap: '1.8rem',
            whiteSpace: 'nowrap',
          }}
        >
          {chapters.map((c, i) => {
            const isActive = i === active;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                style={{
                  display: 'inline-block',
                  padding: '0.7rem 0',
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isActive ? colors.accentTint : colors.textFaint,
                  borderBottom: `2px solid ${isActive ? colors.accent : 'transparent'}`,
                  transition: 'color 0.3s ease, border-color 0.3s ease',
                }}
              >
                {c.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
