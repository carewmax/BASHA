import { Link, navigate } from '../router';
import { Icon } from '../components/Icons';
import { CartLines, TotalsBox } from '../components/CartLines';
import { useStore } from '../store';

export function CartPage() {
  const { cart } = useStore();
  return (
    <div className="cream paper cart-page">
      <div className="wrap narrow">
        <h1 className="script">Your Cart</h1>
        <p className="lead-d">Good food is just a click away.</p>
        {cart.length === 0 ? (
          <div className="empty"><Icon name="cart" size={48} /><h2>Your cart is empty</h2><Link to="/menu" className="btn btn-gold">Browse the menu</Link></div>
        ) : (
          <div className="panel">
            <CartLines />
            <TotalsBox />
            <div className="cart-actions">
              <Link to="/menu" className="link-btn"><Icon name="arrowL" size={16} /> Continue Shopping</Link>
              <button type="button" className="btn btn-gold" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
