/**
 * Sample average luminance of an image's lower band (where work-band copy sits).
 * Returns 'light' when the area is bright enough for dark type.
 */
export async function sampleLowerBandTone(
  src: string,
  lowerFraction = 0.45,
): Promise<'light' | 'dark'> {
  const img = await loadImage(src);
  const w = 48;
  const h = 32;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return 'dark';

  const srcH = img.naturalHeight || img.height;
  const srcW = img.naturalWidth || img.width;
  const sy = Math.floor(srcH * (1 - lowerFraction));
  const sh = Math.max(1, srcH - sy);
  ctx.drawImage(img, 0, sy, srcW, sh, 0, 0, w, h);

  let data: ImageData;
  try {
    data = ctx.getImageData(0, 0, w, h);
  } catch {
    return 'dark';
  }

  let sum = 0;
  const pixels = data.data;
  for (let i = 0; i < pixels.length; i += 4) {
    // Rec. 709 luma
    sum += (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]) / 255;
  }
  const avg = sum / (w * h);
  return avg >= 0.52 ? 'light' : 'dark';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}
