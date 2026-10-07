import { forwardRef } from 'react';
import { useGuideShirt } from '../../lib/guide';

/** Pattern tiles for Derek's shirts (same order as the avatar's `shirt`). */
const shirtTile = (id: number) => `/avatar/shirts/${id}.webp`;

/**
 * What's under the site when you pull the footer up: just the Hawaiian print
 * of whichever shirt the avatar has on (navy by default).
 */
const ShirtBay = forwardRef<HTMLElement, { active: boolean; chromeVisible: boolean }>(function ShirtBay(
  { active, chromeVisible },
  ref,
) {
  const shirt = useGuideShirt();
  return (
    <section
      ref={ref}
      data-telemetry-bay
      aria-hidden
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        height: 'min(320px, 40vh)',
        overflow: 'hidden',
        pointerEvents: active ? 'auto' : 'none',
        backgroundImage: `url(${shirtTile(shirt)})`,
        backgroundSize: '320px 320px',
        backgroundRepeat: 'repeat',
        boxShadow: chromeVisible ? 'inset 0 16px 32px rgba(0,0,0,0.35)' : 'none',
      }}
    />
  );
});

export default ShirtBay;
