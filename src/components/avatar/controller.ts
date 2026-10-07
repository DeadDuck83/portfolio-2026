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

export class AvatarController {
  private vm: ViewModelInstance;
  private audio: HTMLAudioElement | null = null;
  private raf = 0;
  private startTimer = 0;
  private pending: ((done: boolean) => void) | null = null;
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
    if (this.audio) this.audio.muted = m;
  }

  stop() {
    this.pending?.(false);
    this.pending = null;
    window.clearTimeout(this.startTimer);
    cancelAnimationFrame(this.raf);
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  /** Speak a pre-rendered line. Resolves true when it ends, false if cut off. */
  async speak(id: LineId, onTime?: (t: number) => void): Promise<boolean> {
    this.stop();
    const track = await this.track(id);
    const audio = new Audio(lineAudio(id));
    audio.muted = this.muted;
    audio.preload = 'auto';
    this.audio = audio;
    this.setState(State.Speaking);
    this.set('viseme', 0);

    return new Promise<boolean>((resolve) => {
      this.pending = resolve;
      let k = 0;
      let c = 0;
      const cues = track.cues ?? [];
      const tick = () => {
        if (this.audio !== audio) return;
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
      audio.addEventListener('ended', () => {
        if (this.audio !== audio) return;
        cancelAnimationFrame(this.raf);
        this.audio = null;
        this.pending = null;
        this.setState(State.WarmAck); // nod, settle the mouth, back to idle
        resolve(true);
      });
      this.startTimer = window.setTimeout(() => {
        audio
          .play()
          .then(() => {
            this.raf = requestAnimationFrame(tick);
          })
          .catch(() => {
            this.audio = null;
            this.pending = null;
            this.setState(State.Idle);
            resolve(false);
          });
      }, ANTICIPATION_MS);
    });
  }

  dispose() {
    this.stop();
  }
}
