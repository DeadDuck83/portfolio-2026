import { useEffect, useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { track } from '../../lib/analytics';
import { colors, fonts } from '../../theme/tokens';
import { accentLinkHover, solidCtaHover } from '../../lib/hover';
import PixelCameo from './PixelCameo';

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
 * Hero — statement-led composition. Quiet role signature above the display lockup.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="hero"
      aria-label="Introduction"
      style={{
        position: 'relative',
        maxWidth: 1240,
        margin: '0 auto',
        padding: 'clamp(3.5rem, 11vh, 8.5rem) clamp(1.15rem, 5vw, 6rem) clamp(3rem, 8vh, 6.5rem)',
        overflowX: 'clip',
      }}
    >
      <div className="hero__grid">
        <p className="hero__meta">
          Product manager
          <span className="hero__meta-sep" aria-hidden="true">
            ·
          </span>
          Systems &amp; integrations
        </p>

        <h1 className="hero__title" aria-label={HERO_TITLE}>
          <DofTitleCanvas />
        </h1>

        <p className="hero__body">
          Ten years across design, engineering, and product — mapping data flows, wiring
          integrations, and shipping the checkout, portals, and platforms that keep complex
          ecosystems running.
        </p>

        <div className="hero__actions">
          <MagneticCta
            href="#contact"
            onClick={() => track('GetInTouchClick')}
            {...solidCtaHover}
          >
            Get in touch{' '}
            <span
              style={{
                fontFamily: fonts.display,
                fontSize: '1.1rem',
                transform: 'translateY(-1px)',
              }}
            >
              →
            </span>
          </MagneticCta>
          <a className="hero__secondary" href="#work" {...accentLinkHover(colors.textBody)}>
            See selected work
          </a>
        </div>
      </div>

      <PixelCameo />
    </section>
  );
}

/**
 * Canvas depth-of-field lockup.
 * Blur radius is driven by Euclidean distance from the center of “focus”,
 * so wrap lines still soften radially (not just by character index).
 */
const HERO_TITLE = 'Bringing focus to the product.';
const HERO_FOCUS = 'focus';
const FOCUS_COLOR = '#9da767';
const SOFT_COLOR = '#ece6da';

type Glyph = {
  ch: string;
  x: number;
  y: number;
  w: number;
  focus: boolean;
};

function DofTitleCanvas() {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const paint = async () => {
      await document.fonts.ready;
      if (cancelled || !hostRef.current || !canvasRef.current) return;

      const style = getComputedStyle(host);
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.02;
      const letterSpacing = parseFloat(style.letterSpacing) || 0;
      const maxWidth = host.clientWidth;
      if (!maxWidth || !fontSize) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const font = `400 ${fontSize}px ${fonts.display}`;
      const focusFont = `italic 400 ${fontSize}px ${fonts.display}`;

      await Promise.all([
        document.fonts.load(font),
        document.fonts.load(focusFont),
      ]);
      if (cancelled) return;

      const glyphs = layoutTitle(ctx, {
        text: HERO_TITLE,
        focus: HERO_FOCUS,
        font,
        focusFont,
        fontSize,
        lineHeight,
        letterSpacing,
        maxWidth,
      });

      const pad = Math.ceil(fontSize * 0.35);
      const contentW = Math.max(...glyphs.map((g) => g.x + g.w), maxWidth);
      const contentH = Math.max(...glyphs.map((g) => g.y + lineHeight * 0.35), lineHeight);
      const cssW = Math.ceil(contentW + pad * 2);
      const cssH = Math.ceil(contentH + pad * 2);

      canvas.width = Math.ceil(cssW * dpr);
      canvas.height = Math.ceil(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      // Pull canvas back by blur pad so glyphs share the meta/body left edge
      canvas.style.marginLeft = `${-pad}px`;
      canvas.style.marginTop = `${-pad}px`;
      host.style.height = `${cssH - pad}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.textBaseline = 'alphabetic';

      const focusGlyphs = glyphs.filter((g) => g.focus);
      const fx =
        focusGlyphs.reduce((s, g) => s + g.x + g.w / 2, 0) / Math.max(focusGlyphs.length, 1);
      const fy =
        focusGlyphs.reduce((s, g) => s + g.y - fontSize * 0.35, 0) /
        Math.max(focusGlyphs.length, 1);

      const falloff = fontSize * 2.4;
      const blurMax = fontSize * 0.055;
      const noBlur = reduceMotion.matches;
      const ox = pad;
      const oy = pad;

      for (const g of glyphs) {
        if (g.focus) continue;
        const cx = g.x + g.w / 2;
        const cy = g.y - fontSize * 0.35;
        const dist = Math.hypot(cx - fx, cy - fy);
        const t = Math.min(1, dist / falloff);
        const e = t * t;
        const blur = noBlur ? 0 : 0.1 + e * (blurMax - 0.1);
        const alpha = noBlur ? 0.55 : 0.98 - e * 0.32;

        ctx.save();
        ctx.font = font;
        ctx.fillStyle = SOFT_COLOR;
        ctx.globalAlpha = alpha;
        if (blur > 0.15) ctx.filter = `blur(${blur.toFixed(2)}px)`;
        ctx.fillText(g.ch, ox + g.x, oy + g.y);
        ctx.restore();
      }

      ctx.save();
      ctx.font = focusFont;
      ctx.fillStyle = FOCUS_COLOR;
      ctx.globalAlpha = 1;
      ctx.filter = 'none';
      if (!noBlur) {
        ctx.shadowColor = 'rgba(26, 23, 18, 0.55)';
        ctx.shadowBlur = fontSize * 0.35;
      }
      for (const g of focusGlyphs) {
        ctx.fillText(g.ch, ox + g.x, oy + g.y);
      }
      ctx.restore();
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        void paint();
      });
    };

    const ro = new ResizeObserver(schedule);
    ro.observe(host);
    reduceMotion.addEventListener('change', schedule);
    const narrow = window.matchMedia('(max-width: 720px)');
    narrow.addEventListener('change', schedule);
    document.fonts.addEventListener('loadingdone', schedule);
    schedule();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      reduceMotion.removeEventListener('change', schedule);
      narrow.removeEventListener('change', schedule);
      document.fonts.removeEventListener('loadingdone', schedule);
    };
  }, []);

  return (
    <span ref={hostRef} className="hero__title-canvas-host" aria-hidden="true">
      <canvas ref={canvasRef} className="hero__title-canvas" />
    </span>
  );
}

function layoutTitle(
  ctx: CanvasRenderingContext2D,
  opts: {
    text: string;
    focus: string;
    font: string;
    focusFont: string;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    maxWidth: number;
  },
): Glyph[] {
  const { text, focus, font, focusFont, fontSize, lineHeight, letterSpacing, maxWidth } = opts;
  const focusAt = text.indexOf(focus);
  const focusEnd = focusAt + focus.length;
  const words = text.split(/(\s+)/);
  const lines: { start: number; chars: string }[] = [];
  let line = '';
  let lineStart = 0;
  let cursor = 0;

  const measure = (str: string, from: number) => {
    let w = 0;
    for (let i = 0; i < str.length; i++) {
      const abs = from + i;
      const isFocus = abs >= focusAt && abs < focusEnd;
      ctx.font = isFocus ? focusFont : font;
      w += ctx.measureText(str[i]!).width + letterSpacing;
    }
    return w;
  };

  for (const token of words) {
    if (!token) continue;
    const next = line + token;
    const width = measure(next, lineStart);
    if (line && width > maxWidth && token.trim()) {
      lines.push({ start: lineStart, chars: line });
      line = token.replace(/^\s+/, '');
      lineStart = cursor + (token.length - line.length);
    } else {
      if (!line) lineStart = cursor;
      line = next;
    }
    cursor += token.length;
  }
  if (line) lines.push({ start: lineStart, chars: line });

  const glyphs: Glyph[] = [];
  lines.forEach((ln, li) => {
    let x = 0;
    const y = fontSize + li * lineHeight;
    for (let i = 0; i < ln.chars.length; i++) {
      const abs = ln.start + i;
      const ch = ln.chars[i]!;
      const isFocus = abs >= focusAt && abs < focusEnd;
      ctx.font = isFocus ? focusFont : font;
      const w = ctx.measureText(ch).width;
      glyphs.push({ ch, x, y, w, focus: isFocus });
      x += w + letterSpacing;
    }
  });

  return glyphs;
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
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  href: string;
  children: ReactNode;
  onClick?: () => void;
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
        const t = 1 - dist / MAGNET_RADIUS;
        const pull = MAGNET_MAX_PULL * t * t;
        reachDir.x = dx / dist;
        reachDir.y = dy / dist;
        target.x = reachDir.x * pull;
        target.y = reachDir.y * pull;
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

      const quiver = shakeAmount > 0 ? Math.sin(now * 0.056) * shakeAmount : 0;
      const x = offset.x + reachDir.x * quiver;
      const y = offset.y + reachDir.y * quiver;

      if (btnRef.current) {
        btnRef.current.style.willChange = 'transform';
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
        if (btnRef.current) {
          btnRef.current.style.transform = '';
          btnRef.current.style.willChange = '';
        }
        running = false;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      if (btnRef.current) {
        btnRef.current.style.transform = '';
        btnRef.current.style.willChange = '';
      }
    };
  }, []);

  return (
    <span ref={anchorRef} style={{ display: 'inline-flex' }}>
      <a
        ref={btnRef}
        href={href}
        style={ctaStyle}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </a>
    </span>
  );
}
