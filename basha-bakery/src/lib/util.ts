import { config } from '../config';

export const fmt = (n: number | null | undefined) =>
  n == null ? '' : `${config.currency}${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export const slug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ');

export const uid = () => Math.random().toString(36).slice(2, 9);

/** Resize an uploaded photo in the browser so it fits in localStorage. */
export function resizeImage(file: File, max = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read that image')); };
    img.src = url;
  });
}
