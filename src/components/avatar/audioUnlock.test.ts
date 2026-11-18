import { afterEach, describe, expect, it, vi } from 'vitest';
import { SILENCE, voiceElement } from './audioUnlock';
import { registerAudioUnlock, unlockAvatarAudio } from './dock';

describe('unlocking his voice from the opening tap', () => {
  afterEach(() => vi.restoreAllMocks());

  it('starts the shared voice element itself when the card has not loaded yet', () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    registerAudioUnlock(null);
    unlockAvatarAudio();
    expect(play).toHaveBeenCalledTimes(1);
    expect(voiceElement().src).toBe(SILENCE);
  });

  it('hands the tap to the card once it has loaded', () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    const unlock = vi.fn();
    registerAudioUnlock(unlock);
    unlockAvatarAudio();
    expect(unlock).toHaveBeenCalledTimes(1);
    expect(play).not.toHaveBeenCalled();
    registerAudioUnlock(null);
  });
});
