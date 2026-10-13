import { Link } from '../router';
import { Icon } from '../components/Icons';
import { useStore } from '../store';
import { fmt } from '../lib/util';

export function Confirmation() {
  const { lastOrder: o } = useStore();
  if (!o) {
    return (
      <div className="cream paper cart-page"><div className="wrap narrow">
        <div className="empty"><Icon name="cart" size={48} /><h1>No recent order</h1><Link to="/menu" className="btn btn-gold">Browse the menu</Link></div>
      </div></div>
    );
  }
  return (
    <div className="cream paper confirm">
      <div className="wrap narrow">
        <div className="confirm-head">
          <span className="tick"><Icon name="check" size={40} /></span>
          <h1 className="script">{o.demo ? 'Demo Order Complete' : 'Order Received'}</h1>
          <p className="ref">{o.demo ? 'Demo reference' : 'Order reference'}: <strong>{o.ref}</strong></p>
        </div>
        {o.demo && <p className="proto big"><Icon name="alert" size={18} /> This was a demonstration. Nothing was sent to Basha and no payment was taken. Please contact the restaurant directly to place a real order.</p>}
        <div className="panel">
          <ul className="sum-lines">{o.lines.map((l, i) => <li key={i}><span>{l.qty} × {l.name}{l.size ? <em> ({l.size})</em> : null}</span><b>{l.unit == null ? 'TBC' : fmt(l.total)}</b></li>)}</ul>
          <dl className="totals">
            <div><dt>Subtotal</dt><dd>{fmt(o.subtotal) || '0'}</dd></div>
            {o.deliveryFee != null && <div><dt>Delivery fee</dt><dd>{fmt(o.deliveryFee)}</dd></div>}
            <div className="grand"><dt>Total</dt><dd>{fmt(o.total) || '0'}</dd></div>
            {o.hasUnpriced && <p className="note">Items marked TBC had no price set and are not included.</p>}
          </dl>
          <p className="who"><b>{o.customer.name}</b> · {o.customer.phone}{o.customer.fulfilment ? ` · ${o.customer.fulfilment}` : ''}{o.customer.address ? ` · ${o.customer.address}` : ''}</p>
          {o.customer.notes && <p className="who">Notes: {o.customer.notes}</p>}
        </div>
        <div className="row-btns center"><Link to="/menu" className="btn btn-gold">Back to the Menu</Link><Link to="/" className="btn btn-dark">Home</Link></div>
      </div>
    </div>
  );
}
