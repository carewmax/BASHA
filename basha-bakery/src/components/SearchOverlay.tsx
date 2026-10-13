import { useMemo, useRef, useState } from 'react';
import { navigate } from '../router';
import { Icon } from './Icons';
import { FoodImage } from './FoodImage';
import { useStore } from '../store';
import { useModal } from '../lib/useModal';
import { fmt } from '../lib/util';

export function SearchOverlay() {
  const { ui, setSearchOpen, products, categories } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setSearchOpen(false);
  useModal(ui.searchOpen, close, ref);
  const labelOf = (id: string) => categories.find((c) => c.id === id)?.label || '';
  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (!terms.length) return true;
      const hay = `${p.name} ${labelOf(p.category)} ${p.description || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }, [q, cat, products]);
  if (!ui.searchOpen) return null;
  const open = (id: string) => { close(); navigate(`/product/${id}`); };
  return (
    <div className="overlay overlay-top" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="search" role="dialog" aria-modal="true" aria-label="Search the menu" ref={ref} tabIndex={-1}>
        <div className="search-bar">
          <Icon name="search" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your favourite food…" aria-label="Search the menu" data-autofocus autoComplete="off" />
          <button type="button" className="icon-btn" aria-label="Close search" onClick={close}><Icon name="x" /></button>
        </div>
        <div className="chips" role="group" aria-label="Filter by category">
          <button type="button" className={`chip ${cat === 'all' ? 'is-on' : ''}`} onClick={() => setCat('all')}>All</button>
          {categories.map((c) => <button key={c.id} type="button" className={`chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => setCat(c.id)}>{c.label}</button>)}
        </div>
        <div className="search-results" aria-live="polite">
          {results.length === 0 ? (
            <div className="empty">
              <Icon name="search" size={40} />
              <h3>NO MATCHING ITEMS FOUND</h3>
              <button type="button" className="btn btn-dark" onClick={() => { setQ(''); setCat('all'); }}>Clear search</button>
            </div>
          ) : (
            <ul className="result-grid">
              {results.slice(0, 60).map((p) => (
                <li key={p.id}>
                  <button type="button" className="result" onClick={() => open(p.id)}>
                    <span className="result-img"><FoodImage product={p} /></span>
                    <span className="result-txt"><strong>{p.name}</strong><em>{labelOf(p.category)}</em><span>{p.price == null ? 'Price to be confirmed' : fmt(p.price)}</span></span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
