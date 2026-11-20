import { border, colors, fonts, weights } from '../../theme/tokens';
import EmailLink from '../../ui/EmailLink';
import Button from '../../ui/Button';
import { buttonClass } from '../../ui/buttonClass';
import { CONTACT_EMAIL, RESUME_URL } from '../../data/site';
import { track } from '../../lib/analytics';

/**
 * Contact section — display headline with an accent-coloured word, short
 * paragraph, and CTA row (copy-email, outlined LinkedIn, optional Résumé).
 * Résumé opens the Google Doc share link from `RESUME_URL` when set.
 */
export default function ContactSection({ showResume = true }: { showResume?: boolean }) {
  const resumeHref = RESUME_URL.trim();
  const showResumeLink = showResume && Boolean(resumeHref);
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
        <h2
          style={{
            fontFamily: fonts.display,
            fontWeight: weights.display,
            fontSize: 'clamp(2.6rem, 7vw, 5.6rem)',
            lineHeight: 1.02,
            margin: 0,
            maxWidth: '16ch',
          }}
        >
          Got a product that needs{' '}
          <span style={{ color: colors.accentBright }}>focus?</span>
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
          I'm always up for a good product puzzle. The fastest way to reach me is email — click
          the address to copy it.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: 'clamp(2.2rem, 6vh, 3.2rem)',
          }}
        >
          <EmailLink source="contact" plain={false} className={buttonClass({ variant: 'solid' })}>
            {CONTACT_EMAIL}
          </EmailLink>
          <Button
            variant="outline"
            href="https://linkedin.com/in/derekjmoore1"
            target="_blank"
            rel="noopener"
            onClick={() => track('ExternalProfileClick', { profile: 'linkedin', source: 'contact' })}
          >
            LinkedIn
          </Button>
          {showResumeLink && (
            <Button
              variant="outline"
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('ResumeClick', { source: 'contact' })}
            >
              Résumé ↗
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
