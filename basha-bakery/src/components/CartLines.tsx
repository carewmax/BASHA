import { Link } from '../router';
import { Icon } from './Icons';
import { FoodImage } from './FoodImage';
import { useStore } from '../store';
import { fmt } from '../lib/util';

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { cart, getProduct, unitPrice, setQty, removeLine } = useStore();
  return (
    <ul className={`cart-lines ${compact ? 'is-compact' : ''}`}>
      {cart.map((l) => {
        const p = getProduct(l.productId); if (!p) return null;
        const u = unitPrice(p, l.size);
        return (
          <li key={l.id} className="cart-line">
            <Link to={`/product/${p.id}`} className="cart-thumb" aria-label={`View ${p.name}`}><FoodImage product={p} /></Link>
            <div className="cart-info">
              <Link to={`/product/${p.id}`} className="cart-name">{p.name}</Link>
              {l.size && <span className="cart-size">{l.size}</span>}
              <span className="cart-unit">{u == null ? 'Price to be confirmed' : fmt(u)}</span>
            </div>
            <div className="qty" role="group" aria-label={`Quantity for ${p.name}`}>
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty(l.id, l.qty - 1)}><Icon name="minus" size={16} /></button>
              <output aria-live="polite">{l.qty}</output>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty(l.id, l.qty + 1)}><Icon name="plus" size={16} /></button>
            </div>
            <button type="button" className="cart-del" aria-label={`Remove ${p.name}`} onClick={() => removeLine(l.id)}><Icon name="trash" size={18} /></button>
          </li>
        );
      })}
    </ul>
  );
}

export function TotalsBox() {
  const { totals } = useStore();
  return (
    <dl className="totals">
      <div><dt>Subtotal</dt><dd>{fmt(totals.subtotal) || '0'}</dd></div>
      {totals.deliveryFee != null && <div><dt>Delivery fee</dt><dd>{fmt(totals.deliveryFee)}</dd></div>}
      <div className="grand"><dt>Total</dt><dd>{fmt(totals.total) || '0'}</dd></div>
      {totals.hasUnpriced && <p className="note">Some items have no price set yet and are not included in the total.</p>}
    </dl>
  );
}
