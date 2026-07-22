import { colors, fonts } from '../../theme/tokens';
import { accentLinkHover, solidCtaHover } from '../../lib/hover';

const eyebrow = {
  fontSize: '0.7rem',
  letterSpacing: '0.24em',
  textTransform: 'uppercase' as const,
  color: colors.textMuted,
};

/**
 * Hero — eyebrow row with a scaling accent hairline, serif H1 with an italic
 * accent phrase, intro, CTA row, and an optional "open to work" pill. Elements
 * enter with staggered floatIn (delays 0 / .08 / .16 / .24 / .32s).
 */
export default function Hero({ openToWork = true }: { openToWork?: boolean }) {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        maxWidth: 1240,
        margin: '0 auto',
        padding: 'clamp(4rem, 12vh, 9rem) clamp(1.5rem, 6vw, 6rem) clamp(3.5rem, 9vh, 7rem)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: 'clamp(1.8rem, 5vh, 3rem)',
          animation: 'floatIn 0.7s ease both',
        }}
      >
        <span style={eyebrow}>Product Manager</span>
        <span
          style={{
            flex: '0 0 46px',
            height: 1,
            background: colors.accent,
            transformOrigin: 'left',
            animation: 'hairline 0.9s 0.3s ease both',
          }}
        />
        <span style={eyebrow}>Systems &amp; Integrations</span>
      </div>

      <h1
        style={{
          fontFamily: fonts.display,
          fontWeight: 400,
          fontSize: 'clamp(2.9rem, 8.5vw, 7.4rem)',
          lineHeight: 0.98,
          letterSpacing: '-0.01em',
          margin: 0,
          maxWidth: '15ch',
          position: 'relative',
          zIndex: 1,
          animation: 'floatIn 0.8s 0.08s ease both',
        }}
      >
        I turn tangled product systems into things that{' '}
        <span style={{ fontStyle: 'italic', color: colors.accentBright }}>actually work.</span>
      </h1>

      <p
        style={{
          maxWidth: '46ch',
          margin: 'clamp(1.8rem, 5vh, 2.6rem) 0 0',
          fontSize: '0.92rem',
          lineHeight: 1.7,
          color: colors.textBody,
          position: 'relative',
          zIndex: 1,
          animation: 'floatIn 0.8s 0.16s ease both',
        }}
      >
        Ten years across design, engineering, and product — mapping data flows, wiring
        integrations, and shipping the checkout, portals, and platforms that keep complex
        ecosystems running.
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1.4rem',
          marginTop: 'clamp(2.2rem, 6vh, 3.2rem)',
          position: 'relative',
          zIndex: 1,
          animation: 'floatIn 0.8s 0.24s ease both',
        }}
      >
        <a
          href="#contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.7rem',
            background: colors.accent,
            color: colors.buttonTextOnAccent,
            fontSize: '0.74rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 700,
            padding: '0.95rem 1.6rem',
          }}
          {...solidCtaHover}
        >
          Get in touch{' '}
          <span style={{ fontFamily: fonts.display, fontSize: '1.1rem', transform: 'translateY(-1px)' }}>
            →
          </span>
        </a>
        <a
          href="#work"
          style={{
            fontSize: '0.74rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: colors.textBody,
            borderBottom: '1px solid rgba(179,169,150,0.35)',
            paddingBottom: 3,
          }}
          {...accentLinkHover(colors.textBody)}
        >
          See selected work
        </a>
      </div>

      {openToWork && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginTop: 'clamp(2.6rem, 7vh, 3.6rem)',
            padding: '0.5rem 0.9rem',
            border: '1px solid rgba(236,230,218,0.1)',
            borderRadius: 40,
            position: 'relative',
            zIndex: 1,
            animation: 'floatIn 0.8s 0.32s ease both',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: colors.success,
              boxShadow: '0 0 0 3px rgba(127,174,107,0.18)',
            }}
          />
          <span
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: colors.textBody,
            }}
          >
            Open to new product roles
          </span>
        </div>
      )}
    </section>
  );
}
