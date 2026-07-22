import { memo, useEffect, useRef, type CSSProperties } from 'react';

/**
 * The two decorative "brain halves" behind the career slider:
 *  - left: creative flowing strands (warm)
 *  - right: analytical grid / radar / signal (cool)
 * Their scale + opacity ease toward the active role's design vs. engineering
 * weighting (`designW` / `devW`, 0–1) via a continuous lerp so rapid role
 * changes chase the new target instead of restarting a CSS transition.
 * The SVGs are static decorative vectors ported from the design reference;
 * their internal animations rely on the svg* keyframes in global.css.
 *
 * SVG markup is injected once via refs so parent re-renders / style updates
 * never rewrite innerHTML (which would restart CSS animations).
 */

const brainBase: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  height: '100%',
  willChange: 'transform, opacity',
};

/** Seconds to cover ~63% of the remaining distance — longer = softer chase. */
const WEIGHT_SMOOTHING = 1.65;

function weightToScale(w: number) {
  return 0.75 + w * 0.55;
}

function weightToOpacity(w: number) {
  return 0.12 + w * 0.26;
}

function applyWeight(el: HTMLDivElement | null, w: number) {
  if (!el) return;
  el.style.transform = `scale(${weightToScale(w)})`;
  el.style.opacity = String(weightToOpacity(w));
}

const CREATIVE_SVG = `<svg viewBox="0 0 480 600" style="height: 100%; width: auto; overflow: visible; animation: driftL 13s ease-in-out infinite alternate;"><g style="animation: svgsway 11s ease-in-out infinite alternate;"><path d="M 30 -20 C 70 120, 2 240, 50 360 C 86 470, 14 540, 50 620" pathLength="1" fill="none" stroke="#e0954f" stroke-width="1.4" stroke-linecap="round" opacity="0.95" style="stroke-dasharray: 0.82 0.18; animation: svgflow 18.0s linear infinite;"></path><path d="M 54 -20 C 104 120, 19 240, 79 360 C 124 470, 34 540, 74 620" pathLength="1" fill="none" stroke="#d67f4f" stroke-width="1.3" stroke-linecap="round" opacity="0.86" style="stroke-dasharray: 0.82 0.18; animation: svgflow 21.5s linear infinite reverse;"></path><path d="M 78 -20 C 138 120, 36 240, 108 360 C 162 470, 54 540, 98 620" pathLength="1" fill="none" stroke="#bf6a41" stroke-width="1.2" stroke-linecap="round" opacity="0.77" style="stroke-dasharray: 0.82 0.18; animation: svgflow 25.0s linear infinite;"></path><path d="M 102 -20 C 172 120, 53 240, 137 360 C 200 470, 74 540, 122 620" pathLength="1" fill="none" stroke="#c9542f" stroke-width="1.1" stroke-linecap="round" opacity="0.68" style="stroke-dasharray: 0.82 0.18; animation: svgflow 28.5s linear infinite reverse;"></path><path d="M 126 -20 C 206 120, 70 240, 166 360 C 238 470, 94 540, 146 620" pathLength="1" fill="none" stroke="#e7b596" stroke-width="1.0" stroke-linecap="round" opacity="0.59" style="stroke-dasharray: 0.82 0.18; animation: svgflow 32.0s linear infinite;"></path><path d="M 150 -20 C 240 120, 87 240, 195 360 C 276 470, 114 540, 170 620" pathLength="1" fill="none" stroke="#e0954f" stroke-width="0.9" stroke-linecap="round" opacity="0.50" style="stroke-dasharray: 0.82 0.18; animation: svgflow 35.5s linear infinite reverse;"></path><path d="M 174 -20 C 274 120, 104 240, 224 360 C 314 470, 134 540, 194 620" pathLength="1" fill="none" stroke="#d67f4f" stroke-width="0.7" stroke-linecap="round" opacity="0.41" style="stroke-dasharray: 0.82 0.18; animation: svgflow 39.0s linear infinite;"></path><path d="M 198 -20 C 308 120, 121 240, 253 360 C 352 470, 154 540, 218 620" pathLength="1" fill="none" stroke="#bf6a41" stroke-width="0.6" stroke-linecap="round" opacity="0.32" style="stroke-dasharray: 0.82 0.18; animation: svgflow 42.5s linear infinite reverse;"></path></g><circle cx="184" cy="238" r="2.6" fill="#d67f4f" style="animation: svgpulse 7.3s ease-in-out 4.1s infinite;"></circle><circle cx="218" cy="406" r="1.1" fill="#c9542f" style="animation: svgpulse 9.9s ease-in-out 2.1s infinite;"></circle><circle cx="219" cy="88" r="2.5" fill="#c9542f" style="animation: svgpulse 5.1s ease-in-out 5.7s infinite;"></circle><circle cx="137" cy="513" r="2.6" fill="#bf6a41" style="animation: svgpulse 6.7s ease-in-out 3.5s infinite;"></circle><circle cx="177" cy="322" r="2.0" fill="#d67f4f" style="animation: svgpulse 6.2s ease-in-out 4.5s infinite;"></circle><circle cx="140" cy="127" r="1.0" fill="#e0954f" style="animation: svgpulse 10.2s ease-in-out 5.1s infinite;"></circle><circle cx="98" cy="81" r="1.0" fill="#c9542f" style="animation: svgpulse 8.0s ease-in-out 1.7s infinite;"></circle><circle cx="102" cy="69" r="1.9" fill="#d67f4f" style="animation: svgpulse 5.4s ease-in-out 1.0s infinite;"></circle><circle cx="173" cy="208" r="2.8" fill="#c9542f" style="animation: svgpulse 10.1s ease-in-out 5.4s infinite;"></circle><circle cx="153" cy="54" r="1.6" fill="#e0954f" style="animation: svgpulse 5.7s ease-in-out 0.3s infinite;"></circle><circle cx="125" cy="101" r="2.8" fill="#d67f4f" style="animation: svgpulse 8.0s ease-in-out 3.8s infinite;"></circle><circle cx="113" cy="45" r="1.0" fill="#bf6a41" style="animation: svgpulse 5.8s ease-in-out 4.0s infinite;"></circle></svg>`;

const ANALYTICAL_SVG = `<svg viewBox="0 0 480 600" style="height: 100%; width: auto; overflow: visible; animation: driftR 16s ease-in-out infinite alternate;"><g style="animation: svgbreathe 14s ease-in-out infinite;"><line x1="40" y1="30" x2="40" y2="570" stroke="#9aa39a" stroke-width="0.7"></line><line x1="90" y1="30" x2="90" y2="570" stroke="#9aa39a" stroke-width="0.7"></line><line x1="140" y1="30" x2="140" y2="570" stroke="#9aa39a" stroke-width="0.7"></line><line x1="190" y1="30" x2="190" y2="570" stroke="#9aa39a" stroke-width="0.7"></line><line x1="240" y1="30" x2="240" y2="570" stroke="#9aa39a" stroke-width="0.7"></line><line x1="290" y1="30" x2="290" y2="570" stroke="#9aa39a" stroke-width="0.7"></line><line x1="340" y1="30" x2="340" y2="570" stroke="#9aa39a" stroke-width="0.7"></line><line x1="390" y1="30" x2="390" y2="570" stroke="#9aa39a" stroke-width="0.7"></line><line x1="440" y1="30" x2="440" y2="570" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="60" x2="450" y2="60" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="110" x2="450" y2="110" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="160" x2="450" y2="160" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="210" x2="450" y2="210" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="260" x2="450" y2="260" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="310" x2="450" y2="310" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="360" x2="450" y2="360" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="410" x2="450" y2="410" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="460" x2="450" y2="460" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="510" x2="450" y2="510" stroke="#9aa39a" stroke-width="0.7"></line><line x1="30" y1="560" x2="450" y2="560" stroke="#9aa39a" stroke-width="0.7"></line></g><g style="transform-origin: 430px 110px; animation: svgsweep 26s ease-in-out infinite alternate;"><circle cx="430" cy="110" r="150" fill="none" stroke="#9aa39a" stroke-width="1.2" opacity="0.5"></circle><line x1="405.3" y1="249.8" x2="404.0" y2="257.7" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="381.4" y1="243.4" x2="378.7" y2="251.0" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="363.0" y1="226.0" x2="355.0" y2="239.9" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="338.7" y1="218.8" x2="333.6" y2="224.9" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="321.2" y1="201.3" x2="315.1" y2="206.4" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="314.0" y1="177.0" x2="300.1" y2="185.0" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="296.6" y1="158.6" x2="289.0" y2="161.3" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="290.2" y1="134.7" x2="282.3" y2="136.0" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="296.0" y1="110.0" x2="280.0" y2="110.0" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="290.2" y1="85.3" x2="282.3" y2="84.0" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="296.6" y1="61.4" x2="289.0" y2="58.7" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="314.0" y1="43.0" x2="300.1" y2="35.0" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="321.2" y1="18.7" x2="315.1" y2="13.6" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="338.7" y1="1.2" x2="333.6" y2="-4.9" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="363.0" y1="-6.0" x2="355.0" y2="-19.9" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line><line x1="381.4" y1="-23.4" x2="378.7" y2="-31.0" stroke="#9aa39a" stroke-width="1.1" opacity="0.6"></line></g><polyline points="90,510 140,460 190,470 240,380 290,310 340,330 390,210 430,120" fill="none" stroke="#9aa39a" stroke-width="0.85" opacity="0.7"></polyline><polyline points="90,510 140,460 190,470 240,380 290,310 340,330 390,210 430,120" pathLength="1" fill="none" stroke="#d6ded6" stroke-width="1" style="stroke-dasharray: 0.08 0.92; animation: svgsignal 9s linear infinite;"></polyline><rect x="88" y="508" width="4" height="4" fill="none" stroke="#c3cbc3" stroke-width="0.7" style="animation: svgpulse 6s ease-in-out 0.0s infinite;"></rect><rect x="138" y="458" width="4" height="4" fill="none" stroke="#c3cbc3" stroke-width="0.7" style="animation: svgpulse 6s ease-in-out 0.7s infinite;"></rect><rect x="188" y="468" width="4" height="4" fill="none" stroke="#c3cbc3" stroke-width="0.7" style="animation: svgpulse 6s ease-in-out 1.4s infinite;"></rect><rect x="238" y="378" width="4" height="4" fill="none" stroke="#c3cbc3" stroke-width="0.7" style="animation: svgpulse 6s ease-in-out 2.1s infinite;"></rect><rect x="288" y="308" width="4" height="4" fill="none" stroke="#c3cbc3" stroke-width="0.7" style="animation: svgpulse 6s ease-in-out 2.8s infinite;"></rect><rect x="338" y="328" width="4" height="4" fill="none" stroke="#c3cbc3" stroke-width="0.7" style="animation: svgpulse 6s ease-in-out 3.5s infinite;"></rect><rect x="388" y="208" width="4" height="4" fill="none" stroke="#c3cbc3" stroke-width="0.7" style="animation: svgpulse 6s ease-in-out 4.2s infinite;"></rect><rect x="428" y="118" width="4" height="4" fill="none" stroke="#c3cbc3" stroke-width="0.7" style="animation: svgpulse 6s ease-in-out 4.9s infinite;"></rect><g style="transform-origin: 140px 150px; animation: svgspin 40s linear infinite;"><line x1="135" y1="150" x2="145" y2="150" stroke="#9aa39a" stroke-width="0.6" opacity="0.7"></line><line x1="140" y1="145" x2="140" y2="155" stroke="#9aa39a" stroke-width="0.6" opacity="0.7"></line></g><g style="transform-origin: 330px 480px; animation: svgspin 54s linear infinite;"><line x1="325" y1="480" x2="335" y2="480" stroke="#9aa39a" stroke-width="0.6" opacity="0.7"></line><line x1="330" y1="475" x2="330" y2="485" stroke="#9aa39a" stroke-width="0.6" opacity="0.7"></line></g><g style="transform-origin: 80px 300px; animation: svgspin 68s linear infinite;"><line x1="75" y1="300" x2="85" y2="300" stroke="#9aa39a" stroke-width="0.6" opacity="0.7"></line><line x1="80" y1="295" x2="80" y2="305" stroke="#9aa39a" stroke-width="0.6" opacity="0.7"></line></g></svg>`;

function BrainBackground({
  designW,
  devW,
}: {
  designW: number;
  devW: number;
}) {
  const creativeRef = useRef<HTMLDivElement | null>(null);
  const analyticalRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ designW, devW });
  const currentRef = useRef({ designW, devW });

  targetRef.current = { designW, devW };

  useEffect(() => {
    if (creativeRef.current && !creativeRef.current.firstChild) {
      creativeRef.current.innerHTML = CREATIVE_SVG;
    }
    if (analyticalRef.current && !analyticalRef.current.firstChild) {
      analyticalRef.current.innerHTML = ANALYTICAL_SVG;
    }

    // Seed the first paint so we don't flash at an empty transform.
    applyWeight(creativeRef.current, currentRef.current.designW);
    applyWeight(analyticalRef.current, currentRef.current.devW);

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Exponential ease toward the latest target so rapid role changes never jump.
      const alpha = 1 - Math.exp(-dt / WEIGHT_SMOOTHING);
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.designW += (tgt.designW - cur.designW) * alpha;
      cur.devW += (tgt.devW - cur.devW) * alpha;
      applyWeight(creativeRef.current, cur.designW);
      applyWeight(analyticalRef.current, cur.devW);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <div
        ref={creativeRef}
        style={{
          ...brainBase,
          left: 'clamp(-90px, -3vw, -20px)',
          transformOrigin: 'left center',
        }}
      />
      <div
        ref={analyticalRef}
        style={{
          ...brainBase,
          right: 'clamp(-90px, -3vw, -20px)',
          transformOrigin: 'right center',
        }}
      />
    </div>
  );
}

export default memo(BrainBackground);
