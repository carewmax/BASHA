import { useState, type FormEvent } from 'react';
import { Link, navigate } from '../router';
import { Icon, Social } from '../components/Icons';
import { TotalsBox } from '../components/CartLines';
import { useStore, type Order } from '../store';
import { config } from '../config';
import { fmt, uid } from '../lib/util';

const opts = [
  { id: 'Delivery', on: config.services.delivery },
  { id: 'Pickup', on: config.services.pickup },
  { id: 'Dine-in', on: config.services.dineIn },
].filter((o) => o.on);

export function Checkout() {
  const { cart, getProduct, unitPrice, totals, clearCart, setLastOrder, toast, user } = useStore();
  const [f, setF] = useState({ name: user?.name || '', phone: '', notes: '', fulfilment: opts[0]?.id || '', address: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="cream paper cart-page"><div className="wrap narrow">
        <h1 className="script">Checkout</h1>
        <div className="empty"><Icon name="cart" size={48} /><h2>Your cart is empty</h2><Link to="/menu" className="btn btn-gold">Browse the menu</Link></div>
      </div></div>
    );
  }

  const lines = cart.map((l) => {
    const p = getProduct(l.productId)!; const unit = unitPrice(p, l.size);
    return { name: p.name, size: l.size, qty: l.qty, unit, total: (unit ?? 0) * l.qty };
  });
  const waText = () =>
    `Hello Basha, I'd like to order:\n${lines.map((l) => `• ${l.qty} × ${l.name}${l.size ? ` (${l.size})` : ''}${l.unit != null ? ` — ${fmt(l.total)}` : ''}`).join('\n')}\n\nTotal: ${fmt(totals.total) || '0'}${totals.hasUnpriced ? ' (+ items without a set price)' : ''}\nName: ${f.name}\nPhone: ${f.phone}${f.fulfilment ? `\n${f.fulfilment}${f.address ? `: ${f.address}` : ''}` : ''}${f.notes ? `\nNotes: ${f.notes}` : ''}`;

  const validate = () => {
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = 'Please enter your name.';
    if (!/^\+?[\d\s()-]{7,}$/.test(f.phone.trim())) er.phone = 'Enter a phone number we can reach you on.';
    if (f.fulfilment === 'Delivery' && f.address.trim().length < 5) er.address = 'Please enter your delivery address.';
    setErr(er); return Object.keys(er).length === 0;
  };

  const place = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast('Please fix the highlighted fields.', 'err'); return; }
    setBusy(true);
    const order: Order = {
      ref: '', demo: !config.orderEndpoint, createdAt: new Date().toISOString(), lines,
      subtotal: totals.subtotal, deliveryFee: totals.deliveryFee, total: totals.total, hasUnpriced: totals.hasUnpriced,
      customer: { name: f.name.trim(), phone: f.phone.trim(), notes: f.notes.trim(), fulfilment: f.fulfilment || undefined, address: f.address.trim() || undefined },
    };
    try {
      if (config.orderEndpoint) {
        const res = await fetch(config.orderEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
        if (!res.ok) throw new Error(`Server answered ${res.status}`);
        const data = await res.json().catch(() => ({}));
        order.ref = String(data.ref || data.id || '');
        if (!order.ref) throw new Error('The server did not return an order reference');
      } else {
        await new Promise((r) => setTimeout(r, 450));
        order.ref = `DEMO-${uid().toUpperCase().slice(0, 6)}`;
      }
      setLastOrder(order); clearCart(); navigate('/confirmation');
    } catch (ex) {
      toast(`We couldn't submit your order: ${(ex as Error).message}. Nothing was sent — please try again.`, 'err');
    } finally { setBusy(false); }
  };

  return (
    <div className="cream paper checkout">
      <div className="wrap">
        <h1 className="script">Checkout</h1>
        <p className="lead-d">Review your order and tell us how to reach you.</p>
        <div className="checkout-grid">
          <form className="panel" onSubmit={place} noValidate aria-label="Order details">
            <h2>Your details</h2>
            <label className="field"><span>Name*</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" aria-invalid={!!err.name} />{err.name && <small className="err">{err.name}</small>}</label>
            <label className="field"><span>Telephone*</span><input type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" aria-invalid={!!err.phone} />{err.phone && <small className="err">{err.phone}</small>}</label>
            {opts.length > 0 && (
              <fieldset className="sizes"><legend>How would you like your order?</legend>
                <div>{opts.map((o) => <label key={o.id} className={f.fulfilment === o.id ? 'on' : ''}><input type="radio" name="ful" checked={f.fulfilment === o.id} onChange={() => setF({ ...f, fulfilment: o.id })} /><span>{o.id}</span></label>)}</div>
              </fieldset>
            )}
            {f.fulfilment === 'Delivery' && <label className="field"><span>Delivery address*</span><textarea rows={2} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} aria-invalid={!!err.address} />{err.address && <small className="err">{err.address}</small>}</label>}
            <label className="field"><span>Order notes (optional)</span><textarea rows={3} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
            {!config.orderEndpoint && <p className="proto">Demonstration checkout — no online ordering system or payment is connected yet, so this will NOT reach the restaurant{config.contact.whatsapp ? '. To really send your order, use the WhatsApp button below.' : '.'}</p>}
            <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={busy}>{busy ? 'Placing order…' : config.orderEndpoint ? 'Place Order' : 'Place Order (demo)'}</button>
            {config.contact.whatsapp && (
              <button type="button" className="btn btn-dark btn-block" onClick={() => { if (validate()) window.open(`https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(waText())}`, '_blank', 'noopener'); }}><Social name="whatsapp" size={18} /> Send this order via WhatsApp</button>
            )}
            <Link to="/menu" className="link-btn back"><Icon name="arrowL" size={16} /> Continue shopping</Link>
          </form>
          <aside className="panel summary" aria-label="Order summary">
            <h2>Order summary</h2>
            <ul>{lines.map((l, i) => (
              <li key={i}><span>{l.qty} × {l.name}{l.size ? <em> ({l.size})</em> : null}</span><b>{l.unit == null ? 'TBC' : fmt(l.total)}</b></li>
            ))}</ul>
            <TotalsBox />
          </aside>
        </div>
      </div>
    </div>
  );
}
