import { useEffect, useState } from 'react';
import { Link, useLocation } from '../router';
import { images } from '../data/content';
import { Icon } from './Icons';
import { useStore } from '../store';

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { path } = useLocation();
  const { cartCount, setCartOpen, setSearchOpen, setAccountOpen, user } = useStore();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const active = (to: string) => (to === '/' ? path === '/' : path === to || path.startsWith(`${to}/`));
  return (
    <header className="nav">
      <div className="nav-in">
        <Link to="/" className="brand" aria-label="Basha Bakery & Restaurant — home">
          <img src={images.logo} alt="" className="logo-img" height={50} draggable={false} />
          <span className="wordmark"><span className="script">Basha</span><small>Bakery &amp; Restaurant</small></span>
        </Link>
        <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Primary">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={active(l.to) ? 'is-active' : ''} aria-current={active(l.to) ? 'page' : undefined}>{l.label}</Link>
          ))}
        </nav>
        <div className="nav-icons">
          <button type="button" className="icon-btn" aria-label="Search the menu" onClick={() => setSearchOpen(true)}><Icon name="search" /></button>
          <button type="button" className={`icon-btn ${user ? 'has-user' : ''}`} aria-label={user ? `Account: ${user.name}` : 'Account'} onClick={() => setAccountOpen(true)}><Icon name="user" /></button>
          <button type="button" className="icon-btn cart-btn" aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`} onClick={() => setCartOpen(true)}>
            <Icon name="cart" />
            {cartCount > 0 && <span className="badge" aria-hidden="true">{cartCount}</span>}
          </button>
          <button type="button" className="icon-btn nav-burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  );
}
