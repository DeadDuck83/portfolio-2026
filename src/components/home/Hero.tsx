import { useEffect, useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { colors, fonts } from '../../theme/tokens';
import { accentLinkHover, solidCtaHover } from '../../lib/hover';
import PixelCameo from './PixelCameo';

const eyebrow = {
  fontSize: '0.7rem',
  letterSpacing: '0.24em',
  textTransform: 'uppercase' as const,
  color: colors.textMuted,
};

/** Magnetic reach: start attracting within this distance of the CTA center. */
const MAGNET_RADIUS = 500;
/** Furthest the button will lean toward the cursor. */
const MAGNET_MAX_PULL = 10;
/** Within this distance of the rest center, add a tiny reaching shake. */
const SHAKE_RADIUS = 90;
/** Peak amplitude of the reach-shake (px). */
const SHAKE_AMP = 1;
/** Spring constants — stiff + damped enough to feel elastic without wobbling forever. */
const MAGNET_STIFFNESS = 220;
const MAGNET_DAMPING = 18;

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
        Making complex products feel{' '}
        <span style={{ fontStyle: 'italic', color: colors.accentBright }}>refreshingly simple.</span>
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
        <MagneticCta href="#contact" {...solidCtaHover}>
          Get in touch{' '}
          <span style={{ fontFamily: fonts.display, fontSize: '1.1rem', transform: 'translateY(-1px)' }}>
            →
          </span>
        </MagneticCta>
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

      <PixelCameo />
    </section>
  );
}

const ctaStyle: CSSProperties = {
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
  willChange: 'transform',
};

/**
 * Solid hero CTA that leans toward the pointer within MAGNET_RADIUS.
 * Anchor stays fixed; the link springs (up to MAGNET_MAX_PULL) so rapid cursor
 * motion feels elastic rather than locked-on. Inside the button, tracking freezes
 * so it doesn't jitter; when very close it adds a tiny reaching shake.
 */
function MagneticCta({
  href,
  children,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  children: ReactNode;
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
}) {
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const btnRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduceMotion) return;

    const target = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    const reachDir = { x: 1, y: 0 };
    let shakeAmount = 0;
    let pointerInside = false;
    let raf = 0;
    let last = performance.now();
    let running = false;

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rest = anchorRef.current;
      if (!rest) return;
      const rect = rest.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      pointerInside = inside;

      if (inside) {
        // Freeze chase while hovering the CTA — hold current lean, no cursor tracking.
        target.x = offset.x;
        target.y = offset.y;
        shakeAmount = 0;
        velocity.x = 0;
        velocity.y = 0;
        start();
        return;
      }

      if (dist >= MAGNET_RADIUS || dist === 0) {
        target.x = 0;
        target.y = 0;
        shakeAmount = 0;
      } else {
        // Squared falloff: barely moves at the edge, reaches hardest when close.
        const t = 1 - dist / MAGNET_RADIUS;
        const pull = MAGNET_MAX_PULL * t * t;
        reachDir.x = dx / dist;
        reachDir.y = dy / dist;
        target.x = reachDir.x * pull;
        target.y = reachDir.y * pull;
        // Ramp shake in as we get really close (outside the button).
        shakeAmount = dist < SHAKE_RADIUS ? (1 - dist / SHAKE_RADIUS) * SHAKE_AMP : 0;
      }
      start();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      if (!pointerInside) {
        velocity.x += ((target.x - offset.x) * MAGNET_STIFFNESS - velocity.x * MAGNET_DAMPING) * dt;
        velocity.y += ((target.y - offset.y) * MAGNET_STIFFNESS - velocity.y * MAGNET_DAMPING) * dt;
        offset.x += velocity.x * dt;
        offset.y += velocity.y * dt;
      }

      // Tiny back-and-forth along the reach direction — eager, not chaotic.
      const quiver = shakeAmount > 0 ? Math.sin(now * 0.056) * shakeAmount : 0;
      const x = offset.x + reachDir.x * quiver;
      const y = offset.y + reachDir.y * quiver;

      if (btnRef.current) {
        btnRef.current.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      }

      const settled =
        shakeAmount < 0.01 &&
        Math.abs(target.x) < 0.01 &&
        Math.abs(target.y) < 0.01 &&
        Math.abs(offset.x) < 0.05 &&
        Math.abs(offset.y) < 0.05 &&
        Math.abs(velocity.x) < 0.05 &&
        Math.abs(velocity.y) < 0.05;

      if (settled) {
        offset.x = 0;
        offset.y = 0;
        velocity.x = 0;
        velocity.y = 0;
        if (btnRef.current) btnRef.current.style.transform = '';
        running = false;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      if (btnRef.current) btnRef.current.style.transform = '';
    };
  }, []);

  return (
    <span ref={anchorRef} style={{ display: 'inline-flex' }}>
      <a
        ref={btnRef}
        href={href}
        style={ctaStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </a>
    </span>
  );
}
