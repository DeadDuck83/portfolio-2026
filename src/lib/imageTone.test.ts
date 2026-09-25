import { describe, expect, it, vi } from 'vitest';
import { sampleLowerBandTone } from './imageTone';

describe('sampleLowerBandTone', () => {
  it('returns light for a bright lower band', async () => {
    vi.stubGlobal(
      'Image',
      class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        decoding = 'async';
        naturalWidth = 10;
        naturalHeight = 10;
        width = 10;
        height = 10;
        set src(_v: string) {
          queueMicrotask(() => this.onload?.());
        }
      },
    );

    const getImageData = vi.fn(() => {
      const data = new Uint8ClampedArray(48 * 32 * 4);
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 240;
        data[i + 1] = 240;
        data[i + 2] = 235;
        data[i + 3] = 255;
      }
      return { data, width: 48, height: 32 } as ImageData;
    });

    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage,
      getImageData,
    } as unknown as CanvasRenderingContext2D);

    await expect(sampleLowerBandTone('/fake.jpg')).resolves.toBe('light');
  });
});
