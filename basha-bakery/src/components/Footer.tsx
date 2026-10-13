import { Link } from '../router';
import { Logo } from './Logo';
import { Icon, Social } from './Icons';
import { config } from '../config';
import { useStore } from '../store';

export function Footer() {
  const { products, categories } = useStore();
  const cats = categories.filter((c) => products.some((p) => p.category === c.id));
  const c = config.contact;
  const socials = (['instagram', 'facebook', 'tiktok'] as const).filter((k) => config.social[k]);
  const hasContact = c.phone || c.email || c.address || c.hours;
  return (
    <footer className="footer">
      <div className="footer-in">
        <div className="footer-brand">
          <Logo height={96} />
          <p className="script footer-msg">Good Food.<br />Great Vibes.</p>
        </div>
        <nav aria-label="Explore" className="footer-col">
          <h2>Explore</h2>
          <Link to="/">Home</Link><Link to="/menu">Menu</Link><Link to="/about">About Basha</Link><Link to="/gallery">Gallery</Link><Link to="/contact">Contact</Link>
        </nav>
        <nav aria-label="Menu categories" className="footer-col">
          <h2>Menu</h2>
          {cats.map((k) => <Link key={k.id} to={`/menu?cat=${k.id}`}>{k.label}</Link>)}
        </nav>
        <div className="footer-col">
          <h2>Contact</h2>
          {hasContact ? (
            <>
              {c.address && <span className="f-row"><Icon name="pin" size={16} />{c.address}</span>}
              {c.phone && <a className="f-row" href={`tel:${c.phone.replace(/\s/g, '')}`}><Icon name="phone" size={16} />{c.phone}</a>}
              {c.email && <a className="f-row" href={`mailto:${c.email}`}><Icon name="mail" size={16} />{c.email}</a>}
              {c.hours && <span className="f-row"><Icon name="clock" size={16} />{c.hours}</span>}
            </>
          ) : <Link to="/contact">Send us a message</Link>}
          {(socials.length > 0 || c.whatsapp) && (
            <div className="f-social">
              {socials.map((k) => <a key={k} href={config.social[k]} target="_blank" rel="noopener noreferrer" aria-label={`Basha on ${k}`}><Social name={k} /></a>)}
              {c.whatsapp && <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat with Basha on WhatsApp"><Social name="whatsapp" /></a>}
            </div>
          )}
        </div>
      </div>
      <div className="footer-bar">
        <span>© {new Date().getFullYear()} {config.name}</span>
        <Link to="/manage" className="f-manage">Manage menu photos</Link>
      </div>
    </footer>
  );
}
