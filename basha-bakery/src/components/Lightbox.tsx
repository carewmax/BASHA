import { useEffect, useRef } from 'react';
import { Icon } from './Icons';
import { useModal } from '../lib/useModal';

export type LightboxItem = { src: string; alt: string };

export function Lightbox({ items, index, onClose, onIndex }: { items: LightboxItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const open = index != null;
  const ref = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  useModal(open, onClose, ref);
  const n = items.length;
  const go = (d: number) => onIndex((((index ?? 0) + d) % n + n) % n);
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', on); return () => document.removeEventListener('keydown', on);
  }, [open, index, n]);
  if (!open) return null;
  const item = items[index!];
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" ref={ref} tabIndex={-1}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (touch.current == null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); touch.current = null; }}>
      <button type="button" className="lb-btn lb-close" aria-label="Close image viewer" onClick={onClose} data-autofocus><Icon name="x" size={26} /></button>
      {n > 1 && <button type="button" className="lb-btn lb-prev" aria-label="Previous image" onClick={() => go(-1)}><Icon name="chevL" size={28} /></button>}
      <figure className="lb-fig" key={index}>
        <img src={item.src} alt={item.alt} draggable={false} />
        <figcaption>{item.alt} <span>{(index ?? 0) + 1} / {n}</span></figcaption>
      </figure>
      {n > 1 && <button type="button" className="lb-btn lb-next" aria-label="Next image" onClick={() => go(1)}><Icon name="chevR" size={28} /></button>}
    </div>
  );
}
