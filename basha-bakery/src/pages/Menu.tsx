import { useMemo } from 'react';
import { Link, navigate } from '../router';
import { Icon } from '../components/Icons';
import { MenuCard } from '../components/ProductCard';
import { Reveal } from '../components/Reveal';
import { useStore } from '../store';

export function MenuPage({ cat }: { cat: string }) {
  const { products, categories, setSearchOpen } = useStore();
  const present = useMemo(() => categories.filter((c) => products.some((p) => p.category === c.id)), [products, categories]);
  const active = present.some((c) => c.id === cat) ? cat : 'all';
  const sections = present.filter((c) => active === 'all' || c.id === active);
  const setCat = (id: string) => navigate(id === 'all' ? '/menu' : `/menu?cat=${id}`);
  return (
    <>
      <section className="page-hero menu-hero">
        <div className="page-hero-bg" aria-hidden="true" />
        <div className="wrap">
          <h1 className="script">Our Menu</h1>
          <p>Fresh ingredients, great taste, all day.</p>
        </div>
      </section>
      <div className="cream paper menu-wrap">
        <div className="menu-bar">
          <div className="chips menu-chips" role="group" aria-label="Menu categories">
            <button type="button" className={`chip ${active === 'all' ? 'is-on' : ''}`} aria-pressed={active === 'all'} onClick={() => setCat('all')}>All</button>
            {present.map((c) => <button key={c.id} type="button" className={`chip ${active === c.id ? 'is-on' : ''}`} aria-pressed={active === c.id} onClick={() => setCat(c.id)}>{c.label}</button>)}
          </div>
          <button type="button" className="icon-btn menu-search" aria-label="Search the menu" onClick={() => setSearchOpen(true)}><Icon name="search" /></button>
        </div>
        <div className="wrap menu-body">
          {sections.map((c) => {
            const items = products.filter((p) => p.category === c.id);
            return (
              <section key={c.id} className="menu-sec" aria-labelledby={`cat-${c.id}`}>
                <Reveal className="menu-sec-head">
                  <Icon name={c.id} size={34} />
                  <h2 id={`cat-${c.id}`} className="script">{c.label}</h2>
                  <span className="rule" aria-hidden="true" />
                </Reveal>
                <ul className="menu-grid">{items.map((p) => <MenuCard key={p.id} product={p} />)}</ul>
              </section>
            );
          })}
          <p className="menu-end script">Brings People Together</p>
          <p className="menu-foot"><Link to="/manage">Add photos &amp; prices</Link></p>
        </div>
      </div>
    </>
  );
}
