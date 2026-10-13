import { useMemo, useState } from 'react';
import { Link } from '../router';
import { Icon } from '../components/Icons';
import { Torn } from '../components/Torn';
import { Lightbox } from '../components/Lightbox';
import { gallery } from '../data/content';

export function GalleryPage() {
  const [filter, setFilter] = useState<'all' | 'food' | 'interior'>('all');
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(() => gallery.filter((g) => filter === 'all' || g.kind === filter), [filter]);
  return (
    <>
      <section className="page-hero gallery-hero">
        <div className="page-hero-bg" aria-hidden="true" />
        <div className="wrap"><h1 className="script">Our Gallery</h1><p>A taste of what we serve.</p></div>
      </section>
      <div className="cream paper gallery-wrap">
        <div className="wrap">
          <div className="chips center" role="group" aria-label="Filter photos">
            {([['all', 'All'], ['food', 'Food'], ['interior', 'The Place']] as const).map(([k, l]) => <button key={k} type="button" className={`chip ${filter === k ? 'is-on' : ''}`} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>)}
          </div>
          <ul className="gallery-grid">
            {items.map((g, i) => (
              <li key={g.src}>
                <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo: ${g.alt}`}>
                  <img src={g.src} alt={g.alt} loading="lazy" decoding="async" />
                  <span className="g-zoom" aria-hidden="true"><Icon name="expand" size={20} /></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <section className="dark gallery-end">
        <Torn fill="var(--cream)" flip seed={5} />
        <div className="wrap center"><p className="script">Good Food<br />Looks Good</p><Icon name="heart" size={26} /><div className="row-btns center"><Link to="/menu" className="btn btn-gold">See the menu</Link></div></div>
      </section>
      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
