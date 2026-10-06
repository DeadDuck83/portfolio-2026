import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-webgl2';
import { track } from '../../lib/analytics';
import { AvatarController } from './controller';
import { AVATAR_BASE, CHIPS, makeBag, wordEnds, type Chip, type Destination, type LineId } from './lines';
import styles from './avatarGuide.module.css';

type Msg = { id: number; text: string; me?: boolean; live?: boolean; offer?: Destination; choices?: Destination[] };

type Props = { open: boolean; onReady: () => void; onClose: () => void };

/** The call card: avatar tile + compact chat. Stays mounted while minimized. */
export default function AvatarCall({ open, onReady, onClose }: Props) {
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
    if (!chip.line && !chip.pick) return;
    if (busy && (!camera || typing)) return; // typed answers aren't interruptible
    const token = ++askToken.current;
    track('Avatar chip asked', { chip: chip.label, camera });
    ctl.current?.stop();
    post({ text: chip.label, me: true });
    setBusy(chip.label);
    if (chip.go) navigate(chip.go);
    const extra: Partial<Msg> = { offer: chip.offer, choices: chip.choices };
    if (chip.pick) {
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
    <section className={styles.card} hidden={!open} aria-label="Chat with Derek's avatar">
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
            <div className={styles.log} ref={logRef} aria-live="polite">
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
            <div className={styles.chips} role="group" aria-label="Suggested questions">
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
