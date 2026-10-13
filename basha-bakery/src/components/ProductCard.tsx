import { Link } from '../router';
import { FoodImage } from './FoodImage';
import { Icon } from './Icons';
import { useStore } from '../store';
import type { Product } from '../data/menu';

/** Menu card — dish photo with its name underneath (prices stay on the dish page, cart and checkout). */
export function MenuCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const quick = product.available && !(product.sizes && product.sizes.length);
  return (
    <li className={`menu-card ${product.available ? '' : 'is-off'}`}>
      <Link to={`/product/${product.id}`} className="menu-card-link">
        <span className="mc-photo"><FoodImage product={product} sizes="(max-width:600px) 46vw, 230px" /></span>
        <span className="mc-name">{product.name}{!product.available && <em> · unavailable</em>}</span>
      </Link>
      {quick && (
        <button type="button" className="menu-card-add" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product.id)}>
          <Icon name="plus" size={20} />
        </button>
      )}
    </li>
  );
}
