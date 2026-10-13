import { useMemo, useRef, useState } from 'react';
import { Link } from '../router';
import { Icon } from '../components/Icons';
import { FoodImage } from '../components/FoodImage';
import { useStore } from '../store';
import { resizeImage } from '../lib/util';
import type { CatId, Product, Size } from '../data/menu';

const sizesToText = (s?: Size[]) => (s || []).map((x) => `${x.label}: ${x.price ?? ''}`).join(', ');
const textToSizes = (t: string): Size[] | null => {
  const out = t.split(',').map((s) => s.trim()).filter(Boolean).map((s) => {
    const [label, price] = s.split(':').map((x) => x.trim());
    const n = parseFloat(price); return { label, price: Number.isFinite(n) ? n : null };
  }).filter((s) => s.label);
  return out.length ? out : null;
};

function Row({ p }: { p: Product }) {
  const { mgr, toast, categories } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [sizes, setSizes] = useState(sizesToText(p.sizes));
  const upload = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      try { mgr.addPhoto(p.id, await resizeImage(f)); } catch (e) { toast((e as Error).message, 'err'); }
    }
    if (fileRef.current) fileRef.current.value = '';
  };
  return (
    <li className={`mg-row ${p.verify ? 'needs' : ''}`}>
      <div className="mg-photos">
        <div className="mg-main"><FoodImage product={p} /></div>
        <div className="mg-thumbs">
          {p.images.map((src, i) => (
            <span key={i} className="mg-th"><img src={src} alt="" /><button type="button" aria-label={`Remove photo ${i + 1} of ${p.name}`} onClick={() => mgr.removePhoto(p.id, i)}><Icon name="x" size={12} /></button></span>
          ))}
          <button type="button" className="mg-add" onClick={() => fileRef.current?.click()} aria-label={`Add photo for ${p.name}`}><Icon name="camera" size={18} /></button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
        </div>
      </div>
      <div className="mg-fields">
        <label className="field"><span>Name</span><input defaultValue={p.name} key={p.name} onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== p.name && mgr.setName(p.id, e.target.value.trim())} /></label>
        <label className="field"><span>Price</span><input inputMode="decimal" defaultValue={p.price ?? ''} key={`${p.id}-${p.price}`} placeholder="not set" onBlur={(e) => { const v = e.target.value.trim(); mgr.setPrice(p.id, v === '' ? null : Number.isFinite(parseFloat(v)) ? parseFloat(v) : null); }} /></label>
        <label className="field wide"><span>Sizes (optional) — e.g. <code>Small: 145, Large: 190</code></span><input value={sizes} onChange={(e) => setSizes(e.target.value)} onBlur={() => mgr.setSizes(p.id, textToSizes(sizes))} placeholder="none" /></label>
        <div className="mg-flags">
          <label className="check"><input type="checkbox" checked={p.available} onChange={(e) => mgr.setAvailable(p.id, e.target.checked)} /> Available</label>
          <label className="check"><input type="checkbox" checked={!p.verify} onChange={(e) => mgr.setConfirmed(p.id, e.target.checked)} /> Name &amp; price confirmed</label>
          {p.custom && <button type="button" className="link-btn danger" onClick={() => mgr.removeCustom(p.id)}>Delete item</button>}
          <Link to={`/product/${p.id}`} className="link-btn">Preview</Link>
        </div>
      </div>
      <span className="sr">{categories.find((c) => c.id === p.category)?.label}</span>
    </li>
  );
}

export function Manage() {
  const { products, categories, mgr, toast } = useStore();
  const [cat, setCat] = useState<'all' | CatId>('all');
  const [q, setQ] = useState('');
  const [nn, setNn] = useState({ name: '', category: 'pizza' as CatId });
  const importRef = useRef<HTMLInputElement>(null);
  const list = useMemo(() => products.filter((p) => (cat === 'all' || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())), [products, cat, q]);
  const todo = products.filter((p) => !p.images.length).length;

  const [backup, setBackup] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const backupRef = useRef<HTMLTextAreaElement>(null);
  const copyBackup = async () => {
    try { await navigator.clipboard.writeText(backup ?? ''); toast('Copied — paste it somewhere safe'); }
    catch { backupRef.current?.select(); toast('Press Ctrl/Cmd+C to copy the selected text', 'info'); }
  };
  const applyBackup = () => { const ok = mgr.importJson(backup ?? ''); toast(ok ? 'Menu edits restored' : 'That text is not a valid backup', ok ? 'ok' : 'err'); };
  const importFile = async (f?: File | null) => {
    if (!f) return; setBackup(await f.text());
    if (importRef.current) importRef.current.value = '';
  };

  return (
    <div className="cream paper manage">
      <div className="wrap">
        <h1 className="script">Menu Photos &amp; Prices</h1>
        <p className="lead-d">Add a photo for each dish and confirm its price. The menu page shows each dish's <b>photo and name</b>; prices appear on the dish page, cart and checkout.</p>
        <div className="proto big"><Icon name="alert" size={18} />
          <span>Edits made here are saved <b>in this browser only</b> (no login, no server). For the live website, put photos in <code>src/assets/menu/&lt;dish-id&gt;.jpg</code> and prices in <code>src/data/menu.ts</code>, then rebuild — or use Backup / restore to keep a copy.</span></div>
        <div className="mg-tools">
          <div className="mg-stat"><strong>{products.length - todo}</strong> / {products.length} dishes have photos</div>
          <div className="row-btns">
            <button type="button" className="btn btn-dark" onClick={() => setBackup(backup === null ? mgr.exportJson() : null)} aria-expanded={backup !== null}><Icon name="download" size={16} /> Backup / restore</button>
            <button type="button" className={`btn ${confirmReset ? 'btn-gold' : 'btn-ghost-dark'}`} onClick={() => { if (confirmReset) { mgr.reset(); setConfirmReset(false); } else { setConfirmReset(true); window.setTimeout(() => setConfirmReset(false), 4000); } }}>{confirmReset ? 'Tap again to reset everything' : 'Reset'}</button>
          </div>
        </div>
        {backup !== null && (
          <section className="panel mg-backup" aria-label="Backup and restore">
            <h2>Backup / restore</h2>
            <p className="muted">This text is everything you changed here (photos, prices, names, new dishes). Copy it somewhere safe. To restore, paste a saved backup into the box and press Restore.</p>
            <textarea ref={backupRef} id="mg-backup-text" rows={5} value={backup} onChange={(e) => setBackup(e.target.value)} aria-label="Backup text" spellCheck={false} />
            <div className="row-btns">
              <button type="button" className="btn btn-gold" onClick={copyBackup}>Copy</button>
              <button type="button" className="btn btn-dark" onClick={applyBackup}><Icon name="upload" size={16} /> Restore from this text</button>
              <button type="button" className="btn btn-ghost-dark" onClick={() => importRef.current?.click()}>Load a file…</button>
              <input ref={importRef} type="file" accept="application/json" hidden onChange={(e) => importFile(e.target.files?.[0])} />
            </div>
          </section>
        )}
        <form className="mg-new panel" onSubmit={(e) => { e.preventDefault(); if (nn.name.trim()) { mgr.addCustom(nn.name.trim(), nn.category); setNn({ ...nn, name: '' }); } }}>
          <h2>Add a new dish</h2>
          <label className="field"><span>Dish name</span><input value={nn.name} onChange={(e) => setNn({ ...nn, name: e.target.value })} /></label>
          <label className="field"><span>Category</span><select value={nn.category} onChange={(e) => setNn({ ...nn, category: e.target.value as CatId })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
          <button type="submit" className="btn btn-gold" disabled={!nn.name.trim()}><Icon name="plus" size={16} /> Add dish</button>
        </form>
        <div className="mg-filter">
          <div className="chips" role="group" aria-label="Category">
            <button type="button" className={`chip ${cat === 'all' ? 'is-on' : ''}`} onClick={() => setCat('all')}>All</button>
            {categories.map((c) => <button key={c.id} type="button" className={`chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => setCat(c.id)}>{c.label}</button>)}
          </div>
          <label className="field mg-q"><span className="sr">Filter dishes</span><input type="search" placeholder="Filter by name…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        </div>
        <ul className="mg-list">{list.map((p) => <Row key={p.id} p={p} />)}</ul>
        {list.length === 0 && <div className="empty"><p>No dishes match.</p></div>}
      </div>
    </div>
  );
}
