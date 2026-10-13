import { useRef } from 'react';
import { Link, navigate } from '../router';
import { Icon } from './Icons';
import { useStore } from '../store';
import { useModal } from '../lib/useModal';
import { CartLines, TotalsBox } from './CartLines';

export function CartDrawer() {
  const { ui, setCartOpen, cart, cartCount } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setCartOpen(false);
  useModal(ui.cartOpen, close, ref);
  if (!ui.cartOpen) return null;
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" ref={ref} tabIndex={-1}>
        <header className="drawer-head">
          <h2 className="script">Your Cart {cartCount > 0 && <small>({cartCount})</small>}</h2>
          <button type="button" className="icon-btn" aria-label="Close cart" onClick={close}><Icon name="x" /></button>
        </header>
        {cart.length === 0 ? (
          <div className="empty">
            <Icon name="cart" size={44} />
            <p>Your cart is empty.</p>
            <button type="button" className="btn btn-gold" onClick={() => { close(); navigate('/menu'); }}>Browse the menu</button>
          </div>
        ) : (
          <>
            <div className="drawer-body"><CartLines compact /></div>
            <footer className="drawer-foot">
              <TotalsBox />
              <button type="button" className="btn btn-gold btn-block" data-autofocus onClick={() => { close(); navigate('/checkout'); }}>Proceed to checkout</button>
              <div className="drawer-links">
                <button type="button" className="link-btn" onClick={close}>← Continue shopping</button>
                <Link to="/cart" onClick={close}>View full cart</Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
