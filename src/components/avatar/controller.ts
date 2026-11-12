/**
 * The avatar's control surface: its view model numbers. The Rive file's
 * director script owns all motion; the page sets the state, and while a line
 * plays it drives the mouth (`speechHost` = 1) from the audio clock, and
 * sends the line's speech cues (head angle per phrase, brow beats, smiles...)
 * so the whole face punctuates the words, not just the mouth.
 */
import type { Rive, ViewModelInstance } from '@rive-app/react-webgl2';
import { lineAudio, lineTrack, type LineId, type Track } from './lines';

export const State = { Idle: 0, Listening: 1, Thinking: 2, Confused: 3, WarmAck: 4, Shocked: 5, Speaking: 6 } as const;

const ANTICIPATION_MS = 220; // re-centre gaze, settle the mouth, then speak
/** A silent clip to start the shared element with from a tap. */
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

/** How a line ended: played out, cut off (stopped or interrupted), or the browser wouldn't (or couldn't) play it. */
export type Spoken = 'done' | 'cut' | 'blocked';

export class AvatarController {
  private vm: ViewModelInstance;
  /** One element for every line: see unlock(). */
  private el: HTMLAudioElement | null = null;
  /** Bumped per line, so a cut-off line's late events are ignored. */
  private line = 0;
  private detach: (() => void) | null = null;
  private raf = 0;
  private startTimer = 0;
  private pending: ((r: Spoken) => void) | null = null;
  private tracks = new Map<LineId, Track>();
  private cueSeq = 0;
  muted = false;

  constructor(rive: Rive) {
    const vm = rive.viewModelInstance;
    if (!vm) throw new Error('avatar.riv has no bound view model instance');
    this.vm = vm;
    this.set('speechHost', 1);
    this.set('grain', 0); // the site has its own grain
  }

  set(path: string, value: number) {
    const p = this.vm.number(path);
    if (p) p.value = value;
  }

  setState(s: number) {
    this.set('state', s);
  }

  async track(id: LineId): Promise<Track> {
    let t = this.tracks.get(id);
    if (!t) {
      t = (await (await fetch(lineTrack(id))).json()) as Track;
      this.tracks.set(id, t);
    }
    return t;
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.el) this.el.muted = m;
  }

  private player() {
    if (!this.el) {
      this.el = new Audio();
      this.el.preload = 'auto';
    }
    return this.el;
  }

  /**
   * Call straight from a tap or click. Phones (iOS Safari especially) only let
   * an audio element make sound once a tap has started it, and a line starts
   * later, after a fetch and a timer. With a new element per line, lines in a
   * walk got blocked and the walk raced ahead in silence. Starting the one
   * shared element here unlocks it for every line after.
   */
  unlock() {
    const el = this.player();
    if (!el.paused) return; // already playing, so already allowed
    // a line about to start: start it now, inside the tap; otherwise a silent clip
    if (!this.pending) el.src = SILENCE;
    el.play().catch(() => {});
  }

  stop() {
    this.line++;
    this.pending?.('cut');
    this.pending = null;
    this.detach?.();
    this.detach = null;
    window.clearTimeout(this.startTimer);
    cancelAnimationFrame(this.raf);
    this.el?.pause();
  }

  /** Speak a pre-rendered line. Resolves when it ends, is cut off, or can't play. */
  async speak(id: LineId, onTime?: (t: number) => void): Promise<Spoken> {
    this.stop();
    const track = await this.track(id);
    this.stop(); // another line may have started while this one loaded
    const line = this.line;
    const audio = this.player();
    audio.src = lineAudio(id);
    audio.muted = this.muted;
    this.setState(State.Speaking);
    this.set('viseme', 0);

    return new Promise<Spoken>((resolve) => {
      this.pending = resolve;
      let k = 0;
      let c = 0;
      const cues = track.cues ?? [];
      const tick = () => {
        if (this.line !== line) return;
        const t = audio.currentTime;
        while (k + 1 < track.keys.length && track.keys[k + 1][0] <= t) k++;
        if (track.keys[k][0] <= t) this.set('viseme', track.keys[k][1]);
        // cues fire once each, in order, one per frame (the director reads one per frame)
        if (c < cues.length && cues[c][0] <= t) {
          this.set('hostCue', cues[c][1]);
          this.set('hostCueSeq', ++this.cueSeq);
          c++;
        }
        onTime?.(t);
        this.raf = requestAnimationFrame(tick);
      };
      const onEnded = () => {
        if (this.line !== line) return;
        cancelAnimationFrame(this.raf);
        this.detach?.();
        this.detach = null;
        this.pending = null;
        this.setState(State.WarmAck); // nod, settle the mouth, back to idle
        resolve('done');
      };
      audio.addEventListener('ended', onEnded);
      this.detach = () => audio.removeEventListener('ended', onEnded);
      this.startTimer = window.setTimeout(() => {
        audio
          .play()
          .then(() => {
            if (this.line === line) this.raf = requestAnimationFrame(tick);
          })
          .catch(() => {
            if (this.line !== line) return; // cut off before it started: stop() already resolved it
            this.detach?.();
            this.detach = null;
            this.pending = null;
            this.setState(State.Idle);
            resolve('blocked');
          });
      }, ANTICIPATION_MS);
    });
  }

  dispose() {
    this.stop();
    // let the browser free the media player
    this.el?.removeAttribute('src');
    this.el?.load();
    this.el = null;
  }
}
