import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-webgl2';
import { noteCaseStudySource, track, trackOnce, type AvatarPromptKind } from '../../lib/analytics';
import { guideFocus, setGuideShirt, useGuideNudge } from '../../lib/guide';
import { AvatarController, State } from './controller';
import {
  AVATAR_BASE,
  CASE_WALKS,
  CHIPS,
  KEEP_GOING_FROM,
  SHIRTS,
  makeBag,
  wordEnds,
  type CaseId,
  type Chip,
  type Destination,
  type LineId,
  type Shirt,
} from './lines';
import { cornerStyle, nearestCorner, type Corner } from './corner';
import { primeVoice } from './audioUnlock';
import { dockSlotRect, registerAudioUnlock } from './dock';
import { motionOff } from '../../lib/motion';
import { useEyeFollow } from './eyeFollow';
import SkillsShare from './SkillsShare';
import { SKILLS_LINE, cueMoments, skillCues, type SkillCues } from './skills';
import styles from './avatarGuide.module.css';

const IDLE_MS = 4000; // untouched this long (and not talking) → compact
const SHARE_HOLD_MS = 6000; // the finished skills "screen share" stays up this long

const canHover = () => window.matchMedia('(hover: hover)').matches;
const calm = motionOff;
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** transform that lays a box of `to`'s size over `from` (origin top-left) */
const boxOnto = (from: DOMRect, to: DOMRect) =>
  `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;

type Msg = {
  id: number;
  text: string;
  me?: boolean;
  live?: boolean;
  offer?: Destination;
  choices?: Destination[];
  shirts?: boolean;
  more?: CaseId; // offer "Keep going" into this case study's full story
};

type Props = {
  open: boolean;
  /** Opened by itself, not by a click: greet muted, with captions. */
  auto: boolean;
  corner: Corner;
  onCorner: (c: Corner) => void;
  onReady: () => void;
  onClose: () => void;
};

/**
 * The call card: avatar tile + compact chat. Stays mounted while minimized.
 * There's no Connect step: the first time it opens he's already on the call
 * and says hello.
 */
export default function AvatarCall({ open, auto, corner, onCorner, onReady, onClose }: Props) {
  const navigate = useNavigate();
  const { rive, RiveComponent } = useRive({
    src: `${AVATAR_BASE}/avatar.riv`,
    stateMachines: 'Avatar',
    autoplay: true,
    autoBind: true,
    layout: new Layout({ fit: Fit.Cover, alignment: Alignment.TopCenter }),
  });
  const ctl = useRef<AvatarController | null>(null);
  const [ctlReady, setCtlReady] = useState(false);
  const [live, setLive] = useState(false);
  // muted only because the browser wouldn't allow sound yet (not the visitor's
  // choice): the first thing they ask turns the sound on
  const autoMuted = useRef(false);
  // ...and while that's so, the sound button asks for the tap
  const [soundHint, setSoundHint] = useState(false);
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
  // the skills "screen share": which line owns it (a newer line takes it over) and its fade-out
  const [share, setShare] = useState<{ cues: SkillCues; t: number; leaving?: boolean } | null>(null);
  const shareSeq = useRef(0);
  const shareTimer = useRef<number | undefined>(undefined);
  const [compact, setCompact] = useState(false);
  // the question chips scroll sideways; track which ends have more
  const chipsRef = useRef<HTMLDivElement>(null);
  const [chipEdge, setChipEdge] = useState({ start: true, end: false });
  const [shirt, setShirt] = useState(0);
  const [hover, setHover] = useState(false);
  const [poke, setPoke] = useState(0); // bumps on any interaction → restarts the idle timer
  const dragged = useRef(false);
  const tapped = useRef(0); // a tap that just expanded the compact card; its click is swallowed
  const nudgedAt = useRef(0);
  // touching or scrolling inside the card (swiping the chip row, reading the
  // log) counts as interaction, so the idle timer doesn't shrink it mid-swipe
  const nudge = () => {
    const now = Date.now();
    if (now - nudgedAt.current < 250) return;
    nudgedAt.current = now;
    setPoke((p) => p + 1);
  };

  useEffect(() => {
    if (!rive) return;
    try {
      ctl.current = new AvatarController(rive);
      void ctl.current.track('join');
      setCtlReady(true);
      onReady();
    } catch (err) {
      console.error(err);
      trackOnce('avatar-load', 'AvatarError', { errorCategory: 'avatar-load' });
    }
    return () => ctl.current?.dispose();
    // onReady is stable enough; re-running would rebuild the controller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive]);

  // the tap that opens the card (hero tile, floating button) unlocks his voice,
  // even if the avatar is still loading
  useEffect(() => {
    registerAudioUnlock(() => (ctl.current ? ctl.current.unlock() : primeVoice()));
    return () => registerAudioUnlock(null);
  }, []);

  // AvatarClosed: how long it was open and how many things they asked
  const session = useRef<{ at: number; count: number } | null>(null);
  useEffect(() => {
    if (open) {
      session.current = { at: performance.now(), count: 0 };
      return;
    }
    if (!session.current) return;
    const { at, count } = session.current;
    session.current = null;
    track('AvatarClosed', { durationSeconds: Math.round((performance.now() - at) / 1000), interactionCount: count });
  }, [open]);

  /** The visitor picked something: count it, and return a callback for when the answer plays out. */
  const prompted = (promptId: string, kind: AvatarPromptKind) => {
    if (session.current) session.current.count++;
    track('AvatarPromptSelected', { promptId, kind });
    const at = performance.now();
    return () =>
      track('AvatarInteractionCompleted', { promptId, kind, durationSeconds: Math.round((performance.now() - at) / 1000) });
  };

  // rest the avatar while the card is minimized, and end any walk under way
  // (otherwise it carries on, scrolling the page and talking behind the closed card)
  useEffect(() => {
    if (open) return;
    askToken.current++;
    ctl.current?.stop();
    setBusy(null);
    hideShare(0, ++shareSeq.current);
    // hideShare only touches refs and state setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => () => window.clearTimeout(shareTimer.current), []);
  useEffect(() => {
    if (!rive) return;
    if (open) rive.play();
    else rive.pause();
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

  useEyeFollow(cardRef, ctl, open && camera);

  const readChipEdge = useCallback(() => {
    const el = chipsRef.current;
    if (!el) return;
    const start = el.scrollLeft <= 2;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setChipEdge((p) => (p.start === start && p.end === end ? p : { start, end }));
  }, []);
  useEffect(() => {
    const el = chipsRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    readChipEdge();
    const ro = new ResizeObserver(readChipEdge);
    ro.observe(el);
    return () => ro.disconnect();
  }, [live, open, readChipEdge]);
  // step a whole chip at a time: the next cut-off chip lands just clear of the arrow
  const scrollChips = (dir: 1 | -1) => {
    const el = chipsRef.current;
    if (!el) return;
    const pad = 34;
    const chips = [...el.children] as HTMLElement[];
    const left = el.scrollLeft;
    const right = left + el.clientWidth;
    let target: number;
    if (dir > 0) {
      // the first chip starting past the left arrow that runs under the right one
      const next = chips.find((c) => c.offsetLeft > left + pad && c.offsetLeft + c.offsetWidth > right - pad);
      target = next ? next.offsetLeft - pad : el.scrollWidth;
    } else {
      const prev = [...chips].reverse().find((c) => c.offsetLeft < left + pad - 1);
      target = prev ? prev.offsetLeft + prev.offsetWidth - el.clientWidth + pad : 0;
    }
    el.scrollTo({ left: Math.max(0, target), behavior: calm() ? 'auto' : 'smooth' });
  };

  // Opening while the hero's avatar tile is on screen: the card grows out of
  // that tile (instead of the pop-in), and the chat fades in as it lands.
  const shownOnce = useRef(false);
  const leaving = useRef(false);
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (!open) {
      // hidden now: drop the shrink-back's held last frame and re-arm the pop-in
      card.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      leaving.current = false;
      shownOnce.current = false;
      card.style.animation = '';
      return;
    }
    if (shownOnce.current) return;
    shownOnce.current = true;
    const from = dockSlotRect();
    const to = card.getBoundingClientRect();
    if (!from || !to.width || calm()) return;
    // stays off until the card is hidden again; turning it back on here would restart the pop-in
    card.style.animation = 'none';
    card.animate([{ transformOrigin: 'top left', transform: boxOnto(from, to), borderRadius: '8px' }, { transformOrigin: 'top left', transform: 'none' }], {
      duration: 620,
      easing: EASE_OUT,
    });
    card.querySelector(`.${styles.chat}`)?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 360,
      delay: 260,
      easing: 'ease-out',
      fill: 'backwards',
    });
  }, [open]);

  // Closing while the tile is on screen: shrink back into it first.
  const close = () => {
    const card = cardRef.current;
    const to = dockSlotRect();
    if (!card || !to || calm()) {
      onClose();
      return;
    }
    if (leaving.current) return;
    leaving.current = true;
    ctl.current?.stop();
    const from = card.getBoundingClientRect();
    card.querySelector(`.${styles.chat}`)?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    const anim = card.animate(
      [{ transformOrigin: 'top left', transform: 'none' }, { transformOrigin: 'top left', transform: boxOnto(to, from), borderRadius: '8px' }],
      { duration: 460, easing: 'cubic-bezier(0.5, 0, 0.2, 1)', fill: 'forwards' },
    );
    anim.onfinish = () => onClose();
  };

  // drag the card anywhere; on release it snaps to the nearest corner
  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    nudge();
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

  /** Fade the skills share out after `after` ms, unless a newer line has taken it over since. */
  const hideShare = (after: number, seq = shareSeq.current) => {
    if (seq !== shareSeq.current) return;
    window.clearTimeout(shareTimer.current);
    shareTimer.current = window.setTimeout(() => {
      if (seq !== shareSeq.current) return;
      setShare((s) => (s ? { ...s, leaving: true } : s));
      shareTimer.current = window.setTimeout(() => {
        if (seq === shareSeq.current) setShare(null);
      }, 450);
    }, after);
  };

  /**
   * Derek answers: spoken with the message building in step (camera on), or
   * typed (camera off). `keep`: if the audio never starts, still show the line.
   * The skills answer also "shares his screen": each section and tool appears
   * on the page as he names it.
   */
  const say = async (line: LineId, extra: Partial<Msg> = {}, withCamera = camera, keep = false) => {
    const c = ctl.current;
    if (!c) return;
    const t = await c.track(line);
    const seq = ++shareSeq.current;
    const cues = line === SKILLS_LINE ? skillCues(t.words) : null;
    const showShare = (time: number) => {
      if (cues && seq === shareSeq.current) setShare({ cues, t: time });
    };
    window.clearTimeout(shareTimer.current);
    if (cues) showShare(-1);
    else hideShare(0, seq);
    if (!withCamera) {
      setTyping(true);
      await new Promise((r) => window.setTimeout(r, 600 + Math.min(1600, t.text.length * 10)));
      setTyping(false);
      post({ text: t.text, ...extra });
      if (cues) {
        showShare(Infinity);
        hideShare(SHARE_HOLD_MS * 2, seq);
      }
      return;
    }
    const ends = wordEnds(t);
    const id = post({ text: '', live: true });
    let shown = 0;
    const moments = cues ? cueMoments(cues) : [];
    let passed = 0;
    const onTime = (time: number) => {
      let n = shown;
      while (n < t.words.length && t.words[n][1] <= time) n++;
      if (n !== shown) {
        shown = n;
        patch(id, { text: t.text.slice(0, ends[n - 1]) });
      }
      let p = passed;
      while (p < moments.length && moments[p] <= time) p++;
      if (p !== passed) {
        passed = p;
        showShare(time);
      }
    };
    let result = await c.speak(line, onTime);
    if (result === 'blocked') trackOnce('audio-blocked', 'AvatarError', { errorCategory: 'audio-blocked' });
    if (result === 'blocked' && !c.muted) {
      // The browser wouldn't play sound without a fresh tap: carry on muted,
      // with captions. The next tap (or the sound button) turns it back on.
      autoMuted.current = true;
      setSoundHint(true);
      setMuted(true);
      c.setMuted(true);
      result = await c.speak(line, onTime);
    }
    if (result === 'blocked') {
      // no audio at all: show the line and give it the time it would have
      // taken to say, so a walk never races ahead in silence
      patch(id, { text: t.text, live: false, ...extra });
      showShare(Infinity);
      const last = t.words[t.words.length - 1]?.[1] ?? 0;
      await new Promise((r) => window.setTimeout(r, Math.max(2500, (last + 1) * 1000)));
      if (cues) hideShare(SHARE_HOLD_MS, seq);
      return;
    }
    const finished = result === 'done';
    if (cues) {
      if (finished) showShare(Infinity);
      hideShare(finished ? SHARE_HOLD_MS : 0, seq);
    }
    const said = finished || (keep && shown === 0) ? t.text : shown > 0 ? t.text.slice(0, ends[shown - 1]).trimEnd() + '…' : '';
    patch(id, { text: said, live: false, ...(finished ? extra : {}) });
  };

  // He joins the first time the card opens. Opened by itself (no click yet),
  // the browser won't play sound, so the hello runs muted with captions.
  useEffect(() => {
    if (!open || !ctlReady || live) return;
    if (auto) {
      autoMuted.current = true;
      setSoundHint(true);
      setMuted(true);
      ctl.current?.setMuted(true);
    }
    setLive(true);
    setBusy('join');
    let started = false;
    const t = window.setTimeout(async () => {
      started = true;
      await say('join', {}, true, true);
      setBusy((b) => (b === 'join' ? null : b));
    }, 500);
    return () => {
      // closed before he said hello: skip it rather than talk while hidden
      if (started) return;
      window.clearTimeout(t);
      setBusy(null);
    };
    // say/track are stable for this purpose; `live` gates it to once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ctlReady]);

  /**
   * The visitor asked for something (always from a tap or click): unlock the
   * audio for the lines to come, and if he was only muted for autoplay, turn
   * the sound on.
   */
  const wake = () => {
    ctl.current?.unlock();
    if (!autoMuted.current) return;
    autoMuted.current = false;
    setSoundHint(false);
    setMuted(false);
    ctl.current?.setMuted(false);
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
    wake();
    const token = ++askToken.current;
    const completed = prompted(chip.id, chip.tour ? 'tour' : 'question');
    ctl.current?.stop();
    post({ text: chip.label, me: true });
    setBusy(chip.label);
    if (chip.go) navigate(chip.go);
    const extra: Partial<Msg> = { offer: chip.offer, choices: chip.choices, shirts: chip.shirts };
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
    if (token === askToken.current) {
      setBusy(null);
      completed();
    }
  };

  // a shirt pick: he changes into it, then says something about it (and
  // offers the rest again, so visitors can keep flipping through)
  const wear = async (s: Shirt) => {
    if (busy && (!camera || typing)) return;
    wake();
    const token = ++askToken.current;
    const completed = prompted(`shirt-${s.label.toLowerCase().replace(/\W+/g, '-')}`, 'shirt');
    ctl.current?.stop();
    post({ text: s.label, me: true });
    setBusy('shirt');
    setShirt(s.id);
    setGuideShirt(s.id);
    ctl.current?.set('shirt', s.id);
    await new Promise((r) => window.setTimeout(r, 350)); // let the new print fade in first
    if (token !== askToken.current) return;
    if (s.line) {
      await say(s.line, { shirts: true });
    } else {
      // no words: a delighted grin and a nod
      if (camera) ctl.current?.setState(State.WarmAck);
      post({ text: '😄', shirts: true });
      await new Promise((r) => window.setTimeout(r, 1200));
    }
    if (token === askToken.current) {
      setBusy(null);
      completed();
    }
  };

  // remarks on what the visitor does on the page (only once they've said hi)
  const onNudge = useCallback(
    (n: 'footer') => {
      if (!live || !open || n !== 'footer') return;
      if (busy && (!camera || typing)) return;
      const token = ++askToken.current;
      ctl.current?.stop();
      setBusy('footer');
      void say('footer').then(() => {
        if (token === askToken.current) setBusy(null);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [live, open, busy, camera, typing],
  );
  useGuideNudge(onNudge);

  // A case study he narrates: take them there, give the short version from the
  // top of the page, and offer the rest.
  const walkCase = async (d: Destination & { walk: CaseId }) => {
    if (busy && (!camera || typing)) return;
    wake();
    const token = ++askToken.current;
    const completed = prompted(`walk-${d.walk}`, 'case-walk');
    ctl.current?.stop();
    post({ text: d.label, me: true });
    setBusy('case');
    noteCaseStudySource('avatar');
    navigate(d.to);
    await new Promise((r) => window.setTimeout(r, 700)); // let the page mount
    if (token !== askToken.current) return;
    guideFocus({ section: 'case', step: 'c0' });
    await say(CASE_WALKS[d.walk].short, { more: d.walk });
    if (token === askToken.current) {
      setBusy(null);
      completed();
    }
  };

  // "Keep going": the full story, beat by beat, each anchored on its section
  const keepGoing = async (id: CaseId) => {
    if (busy && (!camera || typing)) return;
    wake();
    const token = ++askToken.current;
    const completed = prompted(`keep-going-${id}`, 'keep-going');
    ctl.current?.stop();
    post({ text: 'Keep going', me: true });
    setBusy('case');
    for (const beat of CASE_WALKS[id].beats.slice(KEEP_GOING_FROM)) {
      if (token !== askToken.current) break;
      guideFocus({ section: 'case', step: beat.anchor });
      await new Promise((r) => window.setTimeout(r, 450)); // let the scroll land first
      if (token !== askToken.current) break;
      await say(beat.line);
      if (!camera && token === askToken.current) await new Promise((r) => window.setTimeout(r, 1800));
    }
    if (token === askToken.current) {
      setBusy(null);
      completed();
    }
  };

  const goTo = (d: Destination, chosen = false) => {
    if (chosen && d.walk) {
      void walkCase(d as Destination & { walk: CaseId });
      return;
    }
    noteCaseStudySource('avatar');
    if (chosen) {
      ctl.current?.stop();
      post({ text: d.label, me: true });
      post({ text: `Here's ${d.label}. A guided walkthrough is on its way — for now, have a look around.` });
    }
    navigate(d.to);
  };

  const toggleCamera = () => {
    const on = !camera;
    track('AvatarSettingChanged', { setting: 'camera', on });
    setCamera(on);
    if (!on) ctl.current?.stop();
  };

  const toggleSound = () => {
    ctl.current?.unlock();
    autoMuted.current = false;
    setSoundHint(false);
    const m = !muted;
    track('AvatarSettingChanged', { setting: 'sound', on: !m });
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
      data-avatar-card=""
      onPointerDown={onPointerDown}
      // real mice only: phones fire a fake mouseenter on tap that never leaves
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(false)}
      onFocus={() => setPoke((p) => p + 1)}
      onScrollCapture={nudge}
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
        {/* blurred only while the avatar is still loading ("connecting") */}
        <div className={`${styles.avatar} ${live || ctlReady ? '' : styles.waiting}`} aria-hidden={!camera}>
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
            {camera &&
              (soundHint && muted ? (
                // muted only because the browser held the sound back: say so, and one tap fixes it
                <button className={styles.soundHint} onClick={toggleSound} aria-pressed={false}>
                  <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
                    <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" />
                    <path d="M11.5 5.5a4 4 0 0 1 0 5M13.5 3.5a7 7 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  Tap for sound
                </button>
              ) : (
                <button onClick={toggleSound} aria-pressed={!muted}>
                  {muted ? 'Unmute' : 'Mute'}
                </button>
              ))}
            <button onClick={toggleCamera}>{camera ? 'Camera off' : 'Camera on'}</button>
          </div>
        )}
      </div>

      <div className={styles.chat}>
        <button className={styles.close} onClick={close} aria-label="Minimize">
          ×
        </button>
        {!live ? (
          <p className={styles.connecting}>Connecting…</p>
        ) : (
          <>
            <div className={styles.log} ref={logRef} aria-live="polite" data-nodrag>
              {msgs.map((m) =>
                m.text || m.offer || m.shirts ? (
                  <div key={m.id} className={`${styles.msg} ${m.me ? styles.me : ''} ${m.live ? styles.liveMsg : ''}`}>
                    {m.text}
                    {m.offer && (
                      <button className={styles.inlineLink} onClick={() => goTo(m.offer!)}>
                        {m.offer.label} →
                      </button>
                    )}
                    {m.more && (
                      <span className={styles.choices}>
                        <button onClick={() => void keepGoing(m.more!)}>Keep going →</button>
                      </span>
                    )}
                    {m.shirts && (
                      <span className={styles.choices}>
                        {SHIRTS.filter((s) => s.id !== shirt).map((s) => (
                          <button key={s.id} onClick={() => void wear(s)}>
                            {s.label}
                          </button>
                        ))}
                      </span>
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
            <div className={styles.chipRail} data-start={chipEdge.start || undefined} data-end={chipEdge.end || undefined}>
              <div
                ref={chipsRef}
                className={styles.chips}
                role="group"
                aria-label="Suggested questions"
                data-nodrag
                onScroll={readChipEdge}
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
              {/* arrows show which way there's more; swipe and wheel still work */}
              {!chipEdge.start && (
                <button
                  className={`${styles.chipArrow} ${styles.chipPrev}`}
                  onClick={() => scrollChips(-1)}
                  aria-label="Previous questions"
                  tabIndex={-1}
                >
                  ‹
                </button>
              )}
              {!chipEdge.end && (
                <button
                  className={`${styles.chipArrow} ${styles.chipNext}`}
                  onClick={() => scrollChips(1)}
                  aria-label="More questions"
                  tabIndex={-1}
                >
                  ›
                </button>
              )}
            </div>
            {/* not a real input yet: tapping it gets a shrug and an honest answer */}
            <button
              className={styles.composer}
              onClick={() => void ask({ id: 'free-typing', label: 'Can I type my own question?', line: 'typing' })}
            >
              Free typing is coming soon
            </button>
          </>
        )}
      </div>
      {share &&
        createPortal(<SkillsShare cues={share.cues} t={share.t} leaving={share.leaving} card={cardRef} />, document.body)}
    </section>
  );
}
