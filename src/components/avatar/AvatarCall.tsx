import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-webgl2';
import { track } from '../../lib/analytics';
import { guideFocus } from '../../lib/guide';
import { AvatarController } from './controller';
import { AVATAR_BASE, CHIPS, makeBag, wordEnds, type Chip, type Destination, type LineId } from './lines';
import { cornerStyle, nearestCorner, type Corner } from './corner';
import styles from './avatarGuide.module.css';

const ARTBOARD = { w: 1122, h: 1402 };
const IDLE_MS = 4000; // untouched this long (and not talking) → compact

const canHover = () => window.matchMedia('(hover: hover)').matches;

type Msg = { id: number; text: string; me?: boolean; live?: boolean; offer?: Destination; choices?: Destination[] };

type Props = { open: boolean; corner: Corner; onCorner: (c: Corner) => void; onReady: () => void; onClose: () => void };

/** The call card: avatar tile + compact chat. Stays mounted while minimized. */
export default function AvatarCall({ open, corner, onCorner, onReady, onClose }: Props) {
  const navigate = useNavigate();
  const { rive, RiveComponent } = useRive({
    src: `${AVATAR_BASE}/avatar.riv`,
    stateMachines: 'Avatar',
    autoplay: true,
    autoBind: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.TopCenter }),
  });
  const ctl = useRef<AvatarController | null>(null);
  const [live, setLive] = useState(false);
  const [camera, setCamera] = useState(true);
  const [muted, setMuted] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const msgId = useRef(0);
  const askToken = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const bags = useRef(new Map<string, () => LineId>());
  const introDone = useRef(new Set<string>());
  const cardRef = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);
  const [hover, setHover] = useState(false);
  const [poke, setPoke] = useState(0); // bumps on any interaction → restarts the idle timer
  const dragged = useRef(false);
  const tapped = useRef(0); // a tap that just expanded the compact card; its click is swallowed

  useEffect(() => {
    if (!rive) return;
    try {
      ctl.current = new AvatarController(rive);
      void ctl.current.track('join');
      onReady();
    } catch (err) {
      console.error(err);
    }
    return () => ctl.current?.dispose();
    // onReady is stable enough; re-running would rebuild the controller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive]);

  // rest the avatar while the card is minimized
  useEffect(() => {
    if (!rive) return;
    if (open) rive.play();
    else {
      ctl.current?.stop();
      rive.pause();
    }
  }, [open, rive]);

  // Compact: chat tucks away, face shrinks; hover / tap brings it back.
  // When he's speaking out loud the voice carries the answer, so the text
  // goes as soon as the mouse leaves (phones: as soon as he starts talking;
  // a tap brings it back until IDLE_MS of quiet). Muted or camera-off, the
  // text IS the answer, so it stays up until he's done.
  const talking = busy !== null || typing;
  const voiceOn = camera && !muted;
  useEffect(() => {
    if (!open || hover) {
      setCompact(false);
      return;
    }
    if (talking && !voiceOn) {
      setCompact(false);
      return;
    }
    const delay = talking && canHover() ? 0 : IDLE_MS;
    const t = window.setTimeout(() => setCompact(true), delay);
    return () => window.clearTimeout(t);
  }, [open, hover, talking, voiceOn, poke]);

  // phones: he starts talking out loud (or starts a new answer) → tuck the text away right away
  const speakingAloud = talking && voiceOn;
  useEffect(() => {
    if (open && speakingAloud && !canHover()) setCompact(true);
  }, [open, speakingAloud, busy]);

  // the eyes follow the mouse anywhere on the page, not just over the tile
  useEffect(() => {
    if (!open || !camera) return;
    let raf = 0;
    let seq = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const canvas = cardRef.current?.querySelector('canvas');
        const c = ctl.current;
        if (!canvas || !c) return;
        const r = canvas.getBoundingClientRect();
        if (r.width === 0) return;
        // Fit.Cover + TopCenter: artboard scaled to cover, centred horizontally
        const s = Math.max(r.width / ARTBOARD.w, r.height / ARTBOARD.h);
        const ox = (r.width - ARTBOARD.w * s) / 2;
        c.set('hostCursorX', (e.clientX - r.left - ox) / s);
        c.set('hostCursorY', (e.clientY - r.top) / s);
        c.set('hostCursorSeq', ++seq);
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [open, camera]);

  // drag the card anywhere; on release it snaps to the nearest corner
  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button, input, a, [data-nodrag]')) return;
    const card = cardRef.current;
    if (!card) return;
    const start = { x: e.clientX, y: e.clientY };
    const rect = card.getBoundingClientRect();
    dragged.current = false;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x;
      const dy = ev.clientY - start.y;
      if (!dragged.current && Math.hypot(dx, dy) < 6) return;
      if (!dragged.current) {
        dragged.current = true;
        card.classList.add(styles.dragging);
      }
      card.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      card.classList.remove(styles.dragging);
      if (!dragged.current) {
        // a tap on the compact face brings the card back. Done here, not on
        // click: touches on the avatar canvas don't always produce a click.
        if (compact) {
          tapped.current = Date.now();
          setCompact(false);
          setPoke((p) => p + 1);
        }
        return;
      }
      const cx = rect.left + rect.width / 2 + (ev.clientX - start.x);
      const cy = rect.top + rect.height / 2 + (ev.clientY - start.y);
      card.style.transform = '';
      onCorner(nearestCorner(cx, cy, window.innerWidth, window.innerHeight));
      setPoke((p) => p + 1);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  const post = (m: Omit<Msg, 'id'>) => {
    const id = ++msgId.current;
    setMsgs((all) => [...all, { ...m, id }]);
    return id;
  };
  const patch = (id: number, p: Partial<Msg>) => setMsgs((all) => all.map((m) => (m.id === id ? { ...m, ...p } : m)));

  /** Derek answers: spoken with the message building in step (camera on), or typed (camera off). */
  const say = async (line: LineId, extra: Partial<Msg> = {}, withCamera = camera) => {
    const c = ctl.current;
    if (!c) return;
    const t = await c.track(line);
    if (!withCamera) {
      setTyping(true);
      await new Promise((r) => window.setTimeout(r, 600 + Math.min(1600, t.text.length * 10)));
      setTyping(false);
      post({ text: t.text, ...extra });
      return;
    }
    const ends = wordEnds(t);
    const id = post({ text: '', live: true });
    let shown = 0;
    const finished = await c.speak(line, (time) => {
      let n = shown;
      while (n < t.words.length && t.words[n][1] <= time) n++;
      if (n !== shown) {
        shown = n;
        patch(id, { text: t.text.slice(0, ends[n - 1]) });
      }
    });
    const said = finished ? t.text : shown > 0 ? t.text.slice(0, ends[shown - 1]).trimEnd() + '…' : '';
    patch(id, { text: said, live: false, ...(finished ? extra : {}) });
  };

  const connect = (withCamera: boolean) => {
    track('Avatar joined', { mode: withCamera ? 'camera' : 'typing' });
    setCamera(withCamera);
    setLive(true);
    setBusy('join');
    window.setTimeout(async () => {
      await say('join', {}, withCamera);
      setBusy(null);
    }, 500);
  };

  const nextPick = (chip: Chip): LineId => {
    let next = bags.current.get(chip.label);
    if (!next) {
      next = makeBag(chip.pick!);
      bags.current.set(chip.label, next);
    }
    return next();
  };

  const ask = async (chip: Chip) => {
    if (!chip.line && !chip.pick && !chip.tour) return;
    if (busy && (!camera || typing)) return; // typed answers aren't interruptible
    const token = ++askToken.current;
    track('Avatar chip asked', { chip: chip.label, camera });
    ctl.current?.stop();
    post({ text: chip.label, me: true });
    setBusy(chip.label);
    if (chip.go) navigate(chip.go);
    const extra: Partial<Msg> = { offer: chip.offer, choices: chip.choices };
    if (chip.tour) {
      // a guided walk: anchor each stop on the page, then talk about it
      for (const step of chip.tour) {
        if (token !== askToken.current) break;
        if (step.focus) {
          guideFocus(step.focus);
          await new Promise((r) => window.setTimeout(r, 450)); // let the scroll land first
        }
        if (token !== askToken.current) break;
        await say(step.line);
        // typed: give the visitor time to read before moving on
        if (!camera && token === askToken.current) await new Promise((r) => window.setTimeout(r, 1800));
      }
    } else if (chip.pick) {
      if (chip.intro && !introDone.current.has(chip.label)) {
        introDone.current.add(chip.label);
        await say(chip.intro);
      }
      if (token === askToken.current) await say(nextPick(chip), extra);
    } else if (chip.line) {
      await say(chip.line, extra);
    }
    if (token === askToken.current) setBusy(null);
  };

  const goTo = (d: Destination, chosen = false) => {
    track('Avatar navigated', { to: d.to });
    if (chosen) {
      ctl.current?.stop();
      post({ text: d.label, me: true });
      post({ text: `Here's ${d.label}. A guided walkthrough is on its way — for now, have a look around.` });
    }
    navigate(d.to);
  };

  const toggleCamera = () => {
    const on = !camera;
    track(on ? 'Avatar camera on' : 'Avatar camera off');
    setCamera(on);
    if (!on) ctl.current?.stop();
  };

  const toggleSound = () => {
    const m = !muted;
    setMuted(m);
    ctl.current?.setMuted(m);
  };

  return (
    <section
      ref={cardRef}
      className={`${styles.card} ${compact ? styles.compact : ''}`}
      style={cornerStyle(corner)}
      hidden={!open}
      aria-label="Chat with Derek's avatar"
      onPointerDown={onPointerDown}
      // real mice only: phones fire a fake mouseenter on tap that never leaves
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(false)}
      onFocus={() => setPoke((p) => p + 1)}
      onClickCapture={(e) => {
        if (dragged.current) {
          // the release of a drag is not a click
          e.preventDefault();
          e.stopPropagation();
          dragged.current = false;
          return;
        }
        if (compact || Date.now() - tapped.current < 500) {
          // a tap on the compact face (mobile) only brings the card back
          tapped.current = 0;
          e.preventDefault();
          e.stopPropagation();
          setCompact(false);
        }
        setPoke((p) => p + 1);
      }}
    >
      <div className={`${styles.tile} ${camera ? '' : styles.camOff}`}>
        <div className={`${styles.avatar} ${live ? '' : styles.waiting}`} aria-hidden={!camera}>
          <RiveComponent />
        </div>
        {!camera && (
          <div className={styles.off}>
            <div className={styles.initials}>DM</div>
            <p>Camera off</p>
          </div>
        )}
        {live && (
          <div className={styles.tileControls}>
            {camera && (
              <button onClick={toggleSound} aria-pressed={!muted}>
                {muted ? 'Unmute' : 'Mute'}
              </button>
            )}
            <button onClick={toggleCamera}>{camera ? 'Camera off' : 'Camera on'}</button>
          </div>
        )}
      </div>

      <div className={styles.chat}>
        <button className={styles.close} onClick={onClose} aria-label="Minimize">
          ×
        </button>
        {!live ? (
          <div className={styles.invite}>
            <p className={styles.eyebrow}>Interview with an AI</p>
            <p className={styles.inviteTitle}>Derek's here. Want a tour?</p>
            <p className={styles.inviteSub}>Ask about his work, his story, how he builds.</p>
            <button className={styles.connect} onClick={() => connect(true)}>
              Connect
            </button>
            <button className={styles.typeInstead} onClick={() => connect(false)}>
              I'd rather type
            </button>
          </div>
        ) : (
          <>
            <div className={styles.log} ref={logRef} aria-live="polite" data-nodrag>
              {msgs.map((m) =>
                m.text || m.offer ? (
                  <div key={m.id} className={`${styles.msg} ${m.me ? styles.me : ''} ${m.live ? styles.liveMsg : ''}`}>
                    {m.text}
                    {m.offer && (
                      <button className={styles.inlineLink} onClick={() => goTo(m.offer!)}>
                        {m.offer.label} →
                      </button>
                    )}
                    {m.choices && (
                      <span className={styles.choices}>
                        {m.choices.map((d) => (
                          <button key={d.to} onClick={() => goTo(d, true)}>
                            {d.label}
                          </button>
                        ))}
                      </span>
                    )}
                  </div>
                ) : null,
              )}
              {typing && (
                <div className={`${styles.msg} ${styles.typing}`} aria-label="Derek is typing">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>
            <div
              className={styles.chips}
              role="group"
              aria-label="Suggested questions"
              data-nodrag
              onWheel={(e) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.currentTarget.scrollLeft += e.deltaY;
              }}
            >
              {CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  className={busy === chip.label ? styles.chipActive : undefined}
                  onClick={() => void ask(chip)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <input className={styles.composer} disabled placeholder="Free typing is coming soon" />
          </>
        )}
      </div>
    </section>
  );
}
