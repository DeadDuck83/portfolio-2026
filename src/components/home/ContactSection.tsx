import { border, colors, fonts } from '../../theme/tokens';
import { outlinedCtaHover, solidCtaHover } from '../../lib/hover';

const outlinedCta = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.6rem',
  fontSize: '0.74rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: colors.textBody,
  border: '1px solid rgba(236,230,218,0.15)',
  padding: '1rem 1.5rem',
};

/**
 * Contact section — eyebrow, serif headline with an italic accent word, short
 * paragraph, and CTA row (solid email, outlined LinkedIn, optional Résumé).
 * The résumé href is a stub until the file is added.
 */
export default function ContactSection({ showResume = true }: { showResume?: boolean }) {
  return (
    <section
      id="contact"
      style={{ borderTop: `1px solid ${border.hairline}`, background: colors.bgAlt }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: 'clamp(4.5rem, 13vh, 9rem) clamp(1.5rem, 6vw, 6rem)',
        }}
      >
        <div
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: colors.textMuted,
          }}
        >
          / Contact
        </div>
        <h2
          style={{
            fontFamily: fonts.display,
            fontWeight: 400,
            fontSize: 'clamp(2.6rem, 7vw, 5.6rem)',
            lineHeight: 1.02,
            margin: '1rem 0 0',
            maxWidth: '16ch',
          }}
        >
          Got something complex worth{' '}
          <span style={{ fontStyle: 'italic', color: colors.accentBright }}>simplifying?</span>
        </h2>
        <p
          style={{
            maxWidth: '44ch',
            margin: '1.6rem 0 0',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            color: colors.textBody,
          }}
        >
          I'm always up for a good product puzzle. The fastest way to reach me is email — I read
          everything.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: 'clamp(2.2rem, 6vh, 3.2rem)',
          }}
        >
          <a
            href="mailto:moore8577@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.7rem',
              background: colors.accent,
              color: colors.buttonTextOnAccent,
              fontSize: '0.74rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 700,
              padding: '1rem 1.7rem',
            }}
            {...solidCtaHover}
          >
            moore8577@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/derekjmoore1"
            target="_blank"
            rel="noopener"
            style={outlinedCta}
            {...outlinedCtaHover}
          >
            LinkedIn
          </a>
          {showResume && (
            <a href="#" style={outlinedCta} {...outlinedCtaHover}>
              Résumé ↓
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
