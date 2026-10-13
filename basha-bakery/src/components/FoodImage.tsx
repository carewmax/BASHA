import { useState } from 'react';
import { Icon } from './Icons';
import type { Product } from '../data/menu';

/** Product photo. With no photo yet it shows a neat icon-only slot (no text) ready for the real picture. */
export function FoodImage({ product, index = 0, className = '', eager = false, sizes }: { product: Pick<Product, 'name' | 'category' | 'images'>; index?: number; className?: string; eager?: boolean; sizes?: string }) {
  const src = product.images[index];
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={`food-slot ${className}`} role="img" aria-label={`${product.name} — photo coming soon`}>
        <Icon name={product.category} size={64} className="food-slot-icon" />
        <Icon name="camera" size={18} className="food-slot-cam" />
      </div>
    );
  }
  return <img className={`food-img ${className}`} src={src} alt={product.name} loading={eager ? 'eager' : 'lazy'} decoding="async" sizes={sizes} draggable={false} onError={() => setBroken(true)} />;
}
