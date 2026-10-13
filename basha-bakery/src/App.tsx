import { useEffect } from 'react';
import { StoreProvider } from './store';
import { useLocation, segs } from './router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';
import { Toasts } from './components/Toasts';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { AccountModal } from './components/AccountModal';
import { Home } from './pages/Home';
import { MenuPage } from './pages/Menu';
import { ProductPage } from './pages/Product';
import { About } from './pages/About';
import { GalleryPage } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { CartPage } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { Manage } from './pages/Manage';
import { NotFound } from './pages/NotFound';

const titles: Record<string, string> = {
  '': 'Basha Bakery & Restaurant — Good Food. Great Vibes.',
  menu: 'Menu — Basha Bakery & Restaurant',
  about: 'About Basha — Basha Bakery & Restaurant',
  gallery: 'Gallery — Basha Bakery & Restaurant',
  contact: 'Contact Us — Basha Bakery & Restaurant',
  cart: 'Your Cart — Basha Bakery & Restaurant',
  checkout: 'Checkout — Basha Bakery & Restaurant',
  confirmation: 'Order Confirmation — Basha Bakery & Restaurant',
  manage: 'Manage Menu — Basha Bakery & Restaurant',
};

function Routes() {
  const loc = useLocation();
  const [a, b] = segs(loc.path);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = a === 'product' ? 'Product — Basha Bakery & Restaurant' : titles[a ?? ''] ?? titles[''];
  }, [loc.path]);
  let page;
  switch (a) {
    case undefined: page = <Home />; break;
    case 'menu': page = <MenuPage cat={loc.query.get('cat') || 'all'} />; break;
    case 'product': page = <ProductPage id={b} />; break;
    case 'about': page = <About />; break;
    case 'gallery': page = <GalleryPage />; break;
    case 'contact': page = <Contact />; break;
    case 'cart': page = <CartPage />; break;
    case 'checkout': page = <Checkout />; break;
    case 'confirmation': page = <Confirmation />; break;
    case 'manage': page = <Manage />; break;
    default: page = <NotFound />;
  }
  return <main id="main" className="page" key={loc.path} tabIndex={-1}>{page}</main>;
}

export default function App() {
  return (
    <StoreProvider>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <Loader />
      <Navbar />
      <Routes />
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <AccountModal />
      <Toasts />
    </StoreProvider>
  );
}
