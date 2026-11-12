import { useEffect, useRef } from 'react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-webgl2';
import { useGuideShirt } from '../../lib/guide';
import { AvatarController } from './controller';
import { useEyeFollow } from './eyeFollow';
import { AVATAR_BASE } from './lines';

/**
 * The hero tile's live avatar: idle and watching the cursor, never speaking
 * (the call card does the talking). Lazy-loaded after the page has.
 */
export default function HeroAvatarLive({ active, onReady }: { active: boolean; onReady: () => void }) {
  const host = useRef<HTMLSpanElement>(null);
  const ctl = useRef<AvatarController | null>(null);
  const shirt = useGuideShirt();
  const { rive, RiveComponent } = useRive({
    src: `${AVATAR_BASE}/avatar.riv`,
    stateMachines: 'Avatar',
    autoplay: true,
    autoBind: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.TopCenter }),
  });

  useEffect(() => {
    if (!rive) return;
    try {
      ctl.current = new AvatarController(rive);
      onReady();
    } catch (err) {
      console.error(err);
    }
    return () => ctl.current?.dispose();
    // onReady is stable enough; re-running would rebuild the controller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive]);

  // wear what he wore on the call
  useEffect(() => {
    ctl.current?.set('shirt', shirt);
  }, [shirt, rive]);

  // off screen or out on a call: hold still
  useEffect(() => {
    if (!rive) return;
    if (active) rive.play();
    else rive.pause();
  }, [active, rive]);

  useEyeFollow(host, ctl, active);

  return (
    <span ref={host} className="hx-avatar__rive">
      <RiveComponent />
    </span>
  );
}
