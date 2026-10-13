import { useEffect, useState, type FormEvent } from 'react';
import { Link, navigate } from '../router';
import { Icon, StarFill } from '../components/Icons';
import { FoodImage } from '../components/FoodImage';
import { Lightbox } from '../components/Lightbox';
import { MenuCard } from '../components/ProductCard';
import { useStore } from '../store';
import { fmt } from '../lib/util';
import { NotFound } from './NotFound';

function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return <span className="stars" role="img" aria-label={`${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= Math.round(value) ? 'on' : ''}><StarFill size={size} /></span>)}</span>;
}

function Reviews({ productId }: { productId: string }) {
  const { reviews, addReview, toast, user } = useStore();
  const list = reviews[productId] || [];
  const [f, setF] = useState({ rating: 0, title: '', text: '', name: user?.name || '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const [formOpen, setFormOpen] = useState(false);
  const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.rating) er.rating = 'Please choose a star rating.';
    if (f.text.trim().length < 5) er.text = 'Tell us a little about the dish (5+ characters).';
    if (!f.name.trim()) er.name = 'Please add your name.';
    setErr(er); if (Object.keys(er).length) return;
    addReview({ productId, rating: f.rating, title: f.title.trim(), text: f.text.trim(), name: f.name.trim() });
    setF({ rating: 0, title: '', text: '', name: f.name }); setFormOpen(false);
    toast('Review saved on this device (demo — not published online)', 'info');
  };
  return (
    <section className="reviews" aria-labelledby="rev-h">
      <div className="reviews-head">
        <h2 id="rev-h" className="script">Customer Reviews</h2>
        {!formOpen && <button type="button" className="btn btn-dark" onClick={() => setFormOpen(true)}>Write a Review</button>}
      </div>
      {list.length > 0 ? (
        <>
          <p className="rev-sum"><strong>{avg.toFixed(1)}</strong><Stars value={avg} /><span>{list.length} review{list.length > 1 ? 's' : ''} · saved on this device</span></p>
          <ul className="rev-list">
            {list.map((r) => (
              <li key={r.id}><div className="rev-top"><Stars value={r.rating} size={15} /><time dateTime={r.date}>{new Date(r.date).toLocaleDateString()}</time></div>
                {r.title && <h3>{r.title}</h3>}<p>{r.text}</p><small>— {r.name} <span className="badge-demo">demo</span></small></li>
            ))}
          </ul>
        </>
      ) : !formOpen && <div className="empty rev-empty"><Icon name="star" size={36} /><h3>BE THE FIRST TO REVIEW THIS DISH</h3></div>}
      {formOpen && (
        <form className="rev-form" onSubmit={submit} noValidate>
          <p className="proto">Demo form — reviews are kept in this browser only and are not published.</p>
          <fieldset className="rate"><legend>Your rating</legend>
            {[1, 2, 3, 4, 5].map((i) => (
              <label key={i} className={f.rating >= i ? 'on' : ''}><input type="radio" name="rating" value={i} checked={f.rating === i} onChange={() => setF({ ...f, rating: i })} /><StarFill size={28} /><span className="sr">{i} star{i > 1 ? 's' : ''}</span></label>
            ))}
            {err.rating && <small className="err">{err.rating}</small>}
          </fieldset>
          <label className="field"><span>Your name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!err.name} />{err.name && <small className="err">{err.name}</small>}</label>
          <label className="field"><span>Review title (optional)</span><input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
          <label className="field"><span>Your review</span><textarea rows={4} value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} aria-invalid={!!err.text} />{err.text && <small className="err">{err.text}</small>}</label>
          <div className="row-btns"><button type="submit" className="btn btn-gold">Submit review</button><button type="button" className="btn btn-ghost-dark" onClick={() => setFormOpen(false)}>Cancel</button></div>
        </form>
      )}
    </section>
  );
}

export function ProductPage({ id }: { id?: string }) {
  const { getProduct, products, categories, addToCart, unitPrice, ui } = useStore();
  const p = id ? getProduct(id) : undefined;
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [lb, setLb] = useState<number | null>(null);
  useEffect(() => { setSize(p?.sizes?.[0]?.label); setQty(1); setImg(0); }, [id]);
  if (!p) return <NotFound what="dish" />;
  const cat = categories.find((c) => c.id === p.category);
  const unit = unitPrice(p, size);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const photos = p.images.map((src) => ({ src, alt: p.name }));
  const add = () => addToCart(p.id, { size, qty });
  return (
    <div className="cream paper product-wrap">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/menu"><Icon name="arrowL" size={16} /> Back to Menu</Link>
          {cat && <><span aria-hidden="true">/</span><Link to={`/menu?cat=${cat.id}`}>{cat.label}</Link></>}
        </nav>
        <div className="product">
          <div className="product-media">
            <button type="button" className="product-main" aria-label={photos.length ? 'View photo full screen' : undefined} disabled={!photos.length} onClick={() => setLb(img)}>
              <FoodImage product={p} index={img} eager className="fill" />
              {photos.length > 0 && <span className="zoom" aria-hidden="true"><Icon name="expand" size={18} /></span>}
            </button>
            {photos.length > 1 && (
              <ul className="thumbs" aria-label="Photos">
                {photos.map((ph, i) => <li key={i}><button type="button" className={i === img ? 'is-on' : ''} aria-label={`Show photo ${i + 1}`} aria-pressed={i === img} onClick={() => setImg(i)}><img src={ph.src} alt="" loading="lazy" /></button></li>)}
              </ul>
            )}
          </div>
          <div className="product-info">
            {cat && <p className="eyebrow">{cat.label}</p>}
            <h1>{p.name}</h1>
            {p.description && <p className="product-desc">{p.description}</p>}
            <p className="product-price" aria-live="polite">{unit == null ? <span className="tbc">Price to be confirmed</span> : <>{fmt(unit)}</>}</p>
            {p.sizes && p.sizes.length > 0 && (
              <fieldset className="sizes"><legend>Choose a size</legend>
                <div>{p.sizes.map((s) => (
                  <label key={s.label} className={size === s.label ? 'on' : ''}><input type="radio" name="size" checked={size === s.label} onChange={() => setSize(s.label)} /><span>{s.label}</span><b>{s.price == null ? '—' : fmt(s.price)}</b></label>
                ))}</div>
              </fieldset>
            )}
            {p.available ? (
              <div className="buy">
                <div className="qty qty-lg" role="group" aria-label="Quantity">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}><Icon name="minus" size={18} /></button>
                  <output aria-live="polite">{qty}</output>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))}><Icon name="plus" size={18} /></button>
                </div>
                <button type="button" className="btn btn-gold btn-lg" onClick={add}><Icon name="cart" size={20} /> Add to Cart</button>
              </div>
            ) : <p className="unavail"><Icon name="alert" size={18} /> Currently unavailable</p>}
            <p className="to-menu"><button type="button" className="link-btn" onClick={() => navigate('/menu')}>← Keep browsing the menu</button></p>
          </div>
        </div>
        <Reviews productId={p.id} />
        {related.length > 0 && (
          <section className="related" aria-labelledby="rel-h">
            <h2 id="rel-h" className="script">You may also like</h2>
            <ul className="menu-grid">{related.map((r) => <MenuCard key={r.id} product={r} />)}</ul>
          </section>
        )}
      </div>
      <Lightbox items={photos} index={lb} onClose={() => setLb(null)} onIndex={(i) => { setLb(i); setImg(i); }} />
    </div>
  );
}
