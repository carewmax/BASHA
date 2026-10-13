import { images } from '../data/content';
import { Link } from '../router';

/** Original Basha logo (works on dark surfaces). Replace src/assets/logo.png with the full-resolution file. */
export function Logo({ height = 52, link = true, className = '' }: { height?: number; link?: boolean; className?: string }) {
  const img = <img src={images.logo} alt="Basha Bakery & Restaurant" height={height} style={{ height, width: 'auto' }} className={`logo-img ${className}`} draggable={false} />;
  return link ? <Link to="/" aria-label="Basha Bakery & Restaurant — home" className="logo-link">{img}</Link> : img;
}
