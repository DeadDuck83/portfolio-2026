import { fonts, colors } from '../theme/tokens';

/**
 * "Derek Moore" serif wordmark + accent dot. Shared across headers and
 * footers; `size` sets the serif font-size and the dot scales with it.
 */
export default function Wordmark({ size = 1.6 }: { size?: number }) {
  const dot = size >= 1.5 ? 7 : 6;
  return (
    <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
      <span
        style={{
          fontFamily: fonts.display,
          fontSize: `${size}rem`,
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        Derek Moore
      </span>
      <span
        style={{
          width: dot,
          height: dot,
          borderRadius: '50%',
          background: colors.accent,
          display: 'inline-block',
          transform: size >= 1.5 ? 'translateY(-2px)' : undefined,
        }}
      />
    </span>
  );
}
