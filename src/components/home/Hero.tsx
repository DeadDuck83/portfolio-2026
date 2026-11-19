/*
 * THESIS: The work is the hero. Name and title own a fixed column; the four
 * case studies fill the rest of the first viewport. Refuses the statement
 * headline + paragraph + CTA pair with the work two sections down.
 * OWN-WORLD: Warm near-black, bone text, one olive dot. A big two-line name in
 * Big Shoulders 800, Host Grotesk for everything else, no tracked caps, no
 * mono costume. The four images form one block with 8px seams and 8px
 * corners; labels sit on the images.
 * STORY: In three seconds a recruiter knows who (Derek Moore), what (Product &
 * Systems Designer) and sees the proof (four products). One click opens a
 * case study.
 * FIRST VIEWPORT: Left ~22rem column: name, title, one short line, Get in touch
 * / About me; avatar invite and links at its foot. Right: 2×2 flush grid that
 * fills the viewport height; the seams are offset so it still reads staggered.
 * Phone: name block, then the tiles.
 * FORM: Mayank Kinger's work-first split (Derek pinned it). Signature motion:
 * a rack focus. Tiles pull into focus as they arrive, and hovering one throws
 * the others out of focus.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router';
import { work, type WorkItem } from '../../data/work';
import { RESUME_URL } from '../../data/site';
import { noteCaseStudySource, projectIdFromPath, track } from '../../lib/analytics';
import { motionOff, useMotionOff } from '../../lib/motion';
import EmailLink from '../EmailLink';
import MotionToggle from '../MotionToggle';
import HeroAvatar from '../avatar/HeroAvatar';
// PixelCameo (the camera that brings out pixel Derek) is off for this
// iteration; the component and its test stay for a later one.
import '../../styles/hero.css';

const LINKEDIN_URL = 'https://linkedin.com/in/derekjmoore1';
/** Delay between tiles that arrive in the same batch (ms). */
const RACK_STAGGER_MS = 110;
/** First tiles wait for the name to settle a little. */
const RACK_START_MS = 260;

export default function Hero() {
  const workRef = useRackFocus();

  return (
    <section id="top" className="hx" aria-label="Introduction and selected work">
      <div className="hx__id" data-hero-id>
        <div className="hx__intro">
          <h1 className="hx__name">
            <span className="hx__name-line">Derek</span>{' '}
            <span className="hx__name-line">
              Moore<span className="hx__dot" aria-hidden="true" />
            </span>
          </h1>
          <p className="hx__role">Product &amp; Systems Designer</p>
          <p className="hx__line">
            I design the product and the systems under it. The job finally caught up to my skill
            set.
          </p>
          <div className="hx__actions">
            <a
              className="hx__btn hx__btn--solid"
              href="#contact"
              onClick={() => track('GetInTouchClick', { source: 'hero' })}
            >
              Get in touch
            </a>
            <a className="hx__btn" href="#about">
              About me
            </a>
          </div>
        </div>

        <div className="hx__foot">
          <HeroAvatar />
          <ul className="hx__links">
            <li>
              <a
                className="hx__link"
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener"
                onClick={() => track('ExternalProfileClick', { profile: 'linkedin', source: 'hero' })}
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <EmailLink className="hx__link" source="hero">
                Copy email
              </EmailLink>
            </li>
            {RESUME_URL && (
              <li>
                <a
                  className="hx__link"
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener"
                  onClick={() => track('ResumeClick', { source: 'hero' })}
                >
                  Résumé <span aria-hidden="true">↗</span>
                </a>
              </li>
            )}
            {/* the one link that stays on phones: the tiles play there by themselves */}
            <li className="hx__links-motion">
              <MotionToggle source="hero" className="hx__link" />
            </li>
          </ul>
        </div>
      </div>

      <div id="work" className="hx__work" ref={workRef} aria-label="Selected work">
        <div className="hx__grid">
          {work.map((item, i) => (
            <Tile key={item.n} item={item} position={i + 1} eager={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** A work item was picked: which project, its place in the list, and tell the case study how they came. */
function trackWorkItem(item: WorkItem, position: number) {
  const projectId = projectIdFromPath(item.to);
  if (!projectId) return;
  noteCaseStudySource('work-grid');
  track('WorkItemClick', { projectId, position, source: 'hero-grid' });
}

function Tile({ item, position, eager }: { item: WorkItem; position: number; eager: boolean }) {
  const onClick = () => trackWorkItem(item, position);

  const body: ReactNode = (
    <>
      <span
        className="tile__media"
        style={item.video ? ({ '--tile-ar': `${item.video.width} / ${item.video.height}` } as CSSProperties) : undefined}
      >
        {item.video ? (
          <TileVideo video={item.video} eager={eager} />
        ) : (
          <img
            className="tile__pic"
            src={item.imageSrc}
            alt=""
            width={1199}
            height={731}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            style={item.imageFocus ? { objectPosition: item.imageFocus } : undefined}
          />
        )}
      </span>
      <span className="tile__cap">
        <span className="tile__brand">{item.brand}</span>
        <span className="tile__title">{item.title}</span>
        <span className="tile__go" aria-hidden="true">
          →
        </span>
      </span>
    </>
  );

  if (item.to) {
    return (
      <Link className="tile" to={item.to} onClick={onClick}>
        {body}
      </Link>
    );
  }
  return (
    <a className="tile" href={item.href} target="_blank" rel="noopener" onClick={onClick}>
      {body}
    </a>
  );
}

/**
 * A tile's cover video, muted and looping. With a mouse the tile rests on its
 * poster (the hero image, which needn't be a frame of the video) and the video
 * plays only while the tile is hovered or focused, so the grid stays calm;
 * leaving fades the poster back over it and rewinds. Touch screens can't
 * hover, so there it plays whenever it's on screen. With motion off (paused,
 * or reduced by the system) it's the poster, and pausing mid-play swaps the
 * poster back in.
 */
function TileVideo({ video, eager }: { video: NonNullable<WorkItem['video']>; eager: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const stillRef = useRef<HTMLSpanElement | null>(null);
  const still = useMotionOff();
  const [hoverPlay] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);

  useEffect(() => {
    const el = ref.current;
    if (!el || still) return;
    // React doesn't reflect `muted` to the attribute, and autoplay needs it
    el.muted = true;
    const play = () => void el.play().catch(() => {});

    if (hoverPlay) {
      const tile = el.closest<HTMLElement>('.tile');
      const cover = stillRef.current;
      if (!tile || !cover) return;
      let rewindTimer = 0;
      const start = () => {
        window.clearTimeout(rewindTimer);
        play();
      };
      // the poster lifts once frames are actually moving, so there's no blank beat
      const onPlaying = () => cover.classList.add('is-off');
      const rewind = () => {
        cover.classList.remove('is-off');
        el.pause();
        // rewind under the poster once it has faded back in
        rewindTimer = window.setTimeout(() => {
          el.currentTime = 0;
        }, 400);
      };
      const onFocusOut = (e: FocusEvent) => {
        if (!tile.contains(e.relatedTarget as Node | null)) rewind();
      };
      el.addEventListener('playing', onPlaying);
      tile.addEventListener('pointerenter', start);
      tile.addEventListener('pointerleave', rewind);
      tile.addEventListener('focusin', start);
      tile.addEventListener('focusout', onFocusOut);
      return () => {
        window.clearTimeout(rewindTimer);
        el.removeEventListener('playing', onPlaying);
        tile.removeEventListener('pointerenter', start);
        tile.removeEventListener('pointerleave', rewind);
        tile.removeEventListener('focusin', start);
        tile.removeEventListener('focusout', onFocusOut);
      };
    }

    if (typeof IntersectionObserver === 'undefined') {
      play();
      return;
    }
    const io = new IntersectionObserver(([e]) => (e?.isIntersecting ? play() : el.pause()), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [still, hoverPlay]);

  if (still) {
    return (
      <img
        className="tile__pic"
        src={video.poster}
        alt=""
        width={video.width}
        height={video.height}
        decoding="async"
      />
    );
  }
  return (
    <>
      <video
        ref={ref}
        className="tile__pic"
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        muted
        // touch: the browser's own muted autoplay (it resumes the video after
        // pausing it off screen, e.g. during the page's slide-in)
        autoPlay={!hoverPlay}
        loop
        playsInline
        disablePictureInPicture
        // with a mouse, eager tiles buffer up front so a hover starts at once
        preload={eager ? 'auto' : 'metadata'}
        aria-hidden="true"
        tabIndex={-1}
      />
      {hoverPlay && (
        <span ref={stillRef} className="tile__still" aria-hidden="true">
          <img
            className="tile__pic"
            src={video.poster}
            alt=""
            width={video.width}
            height={video.height}
            decoding="async"
          />
        </span>
      )}
    </>
  );
}

/**
 * Rack focus: tiles start out of focus and pull sharp as they enter the
 * viewport, staggered within each batch. Content stays visible without JS
 * (the grid is only "armed" once this runs) and under reduced motion.
 */
function useRackFocus() {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const grid = ref.current;
    if (!grid || typeof IntersectionObserver === 'undefined') return;
    if (motionOff()) return;
    grid.classList.add('is-armed');
    return () => grid.classList.remove('is-armed');
  }, []);

  useEffect(() => {
    const grid = ref.current;
    if (!grid || !grid.classList.contains('is-armed')) return;
    let first = true;
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const delay = (first ? RACK_START_MS : 0) + n * RACK_STAGGER_MS;
          el.style.setProperty('--rack-delay', `${delay}ms`);
          el.classList.add('is-in');
          io.unobserve(el);
          n++;
        }
        first = false;
      },
      { threshold: 0.18 },
    );
    grid.querySelectorAll('.tile').forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return ref;
}
