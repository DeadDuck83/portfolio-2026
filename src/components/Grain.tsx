/**
 * Fixed full-viewport film-grain overlay: SVG feTurbulence noise at low
 * opacity with overlay blend. Non-interactive. Toggleable via `enabled`.
 */
const NOISE_URL =
  "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')";

export default function Grain({ enabled = true }: { enabled?: boolean }) {
  if (!enabled) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        pointerEvents: 'none',
        opacity: 0.05,
        mixBlendMode: 'overlay',
        backgroundImage: NOISE_URL,
      }}
    />
  );
}
