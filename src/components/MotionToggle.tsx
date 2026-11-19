import type { ButtonHTMLAttributes } from 'react';
import { track, type AnalyticsEvents } from '../lib/analytics';
import { setMotionPaused, useMotionOff, useSystemReducesMotion } from '../lib/motion';

/**
 * Pause motion / Play motion: stops everything on the site that moves by
 * itself (cover videos, the Rive animations, looping effects) and remembers
 * the choice in this browser. Not shown when the system already asks for
 * reduced motion: then nothing moves by itself, so there's nothing to pause.
 *
 * `squeeze`: on phones only the icon shows (the label stays for screen readers).
 */
export default function MotionToggle({
  source,
  className,
  squeeze = false,
  ...rest
}: {
  source: AnalyticsEvents['MotionToggled']['source'];
  squeeze?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'children' | 'title'>) {
  const off = useMotionOff();
  const system = useSystemReducesMotion();
  if (system) return null;
  const label = off ? 'Play motion' : 'Pause motion';
  return (
    <button
      {...rest}
      type="button"
      className={['motion-toggle', squeeze && 'motion-toggle--squeeze', className].filter(Boolean).join(' ')}
      title={squeeze ? label : undefined}
      onClick={() => {
        setMotionPaused(!off);
        track('MotionToggled', { paused: !off, source });
      }}
    >
      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        {off ? (
          <path d="M3 1.6v8.8L10.2 6z" fill="currentColor" />
        ) : (
          <>
            <rect x="2.4" y="1.6" width="2.4" height="8.8" rx="0.6" fill="currentColor" />
            <rect x="7.2" y="1.6" width="2.4" height="8.8" rx="0.6" fill="currentColor" />
          </>
        )}
      </svg>
      <span className="motion-toggle__text">{label}</span>
    </button>
  );
}
