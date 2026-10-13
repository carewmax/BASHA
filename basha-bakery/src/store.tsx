import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { seedProducts, type Product, type Size, type CatId, categories } from './data/menu';
import { config } from './config';
import { load, save, loadSession, saveSession } from './lib/storage';
import { uid, slug } from './lib/util';

export type CartLine = { id: string; productId: string; size?: string; qty: number };
export type Review = { id: string; productId: string; rating: number; title: string; text: string; date: string; name: string };
export type Order = {
  ref: string; demo: boolean; createdAt: string;
  lines: { name: string; size?: string; qty: number; unit: number | null; total: number }[];
  subtotal: number; deliveryFee: number | null; total: number; hasUnpriced: boolean;
  customer: { name: string; phone: string; notes: string; fulfilment?: string; address?: string };
};
type Overrides = {
  photos: Record<string, string[]>;
  price: Record<string, number | null>;
  sizes: Record<string, Size[] | null>;
  name: Record<string, string>;
  available: Record<string, boolean>;
  confirmed: Record<string, boolean>;
  custom: Product[];
};
const emptyOverrides: Overrides = { photos: {}, price: {}, sizes: {}, name: {}, available: {}, confirmed: {}, custom: [] };
type Toast = { id: string; msg: string; kind: 'ok' | 'err' | 'info' };
type User = { name: string; email: string } | null;

type Store = {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  categories: typeof categories;
  cart: CartLine[];
  cartCount: number;
  addToCart: (productId: string, opts?: { size?: string; qty?: number }) => void;
  setQty: (lineId: string, qty: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  unitPrice: (p: Product, size?: string) => number | null;
  totals: { subtotal: number; deliveryFee: number | null; total: number; hasUnpriced: boolean };
  ui: { cartOpen: boolean; searchOpen: boolean; accountOpen: boolean };
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setAccountOpen: (v: boolean) => void;
  toasts: Toast[];
  toast: (msg: string, kind?: Toast['kind']) => void;
  user: User;
  signIn: (u: NonNullable<User>) => void;
  signOut: () => void;
  lastOrder: Order | null;
  setLastOrder: (o: Order | null) => void;
  reviews: Record<string, Review[]>;
  addReview: (r: Omit<Review, 'id' | 'date'>) => void;
  overrides: Overrides;
  mgr: {
    addPhoto: (id: string, dataUrl: string) => void;
    removePhoto: (id: string, index: number) => void;
    setPrice: (id: string, price: number | null) => void;
    setSizes: (id: string, sizes: Size[] | null) => void;
    setName: (id: string, name: string) => void;
    setAvailable: (id: string, v: boolean) => void;
    setConfirmed: (id: string, v: boolean) => void;
    addCustom: (name: string, category: CatId) => void;
    removeCustom: (id: string) => void;
    exportJson: () => string;
    importJson: (json: string) => boolean;
    reset: () => void;
  };
};

const Ctx = createContext<Store>(null as unknown as Store);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>(() => ({ ...emptyOverrides, ...load<Partial<Overrides>>('basha.overrides', {}) }));
  const [cart, setCart] = useState<CartLine[]>(() => load<CartLine[]>('basha.cart', []));
  const [user, setUser] = useState<User>(() => load<User>('basha.user', null));
  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => load('basha.reviews', {}));
  const [lastOrder, setLastOrderState] = useState<Order | null>(() => loadSession<Order | null>('basha.lastOrder', null));
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const quotaWarned = useRef(false);

  const persistOverrides = useCallback((next: Overrides) => {
    if (!save('basha.overrides', next) && !quotaWarned.current) {
      quotaWarned.current = true;
      pushToast('Browser storage is full — this change may not be kept after you close the page.', 'err');
    }
  }, []);
  const updateOverrides = useCallback((fn: (o: Overrides) => Overrides) => {
    setOverrides((prev) => { const next = fn(prev); persistOverrides(next); return next; });
  }, [persistOverrides]);

  useEffect(() => { save('basha.cart', cart); }, [cart]);

  const products = useMemo<Product[]>(() => {
    const all = [...seedProducts, ...overrides.custom];
    return all.map((p) => {
      const photos = overrides.photos[p.id];
      return {
        ...p,
        name: overrides.name[p.id] ?? p.name,
        price: p.id in overrides.price ? overrides.price[p.id] : p.price,
        sizes: p.id in overrides.sizes ? overrides.sizes[p.id] || undefined : p.sizes,
        images: photos && photos.length ? photos : p.images,
        available: p.id in overrides.available ? overrides.available[p.id] : p.available,
        verify: overrides.confirmed[p.id] ? false : p.verify,
      };
    });
  }, [overrides]);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const getProduct = useCallback((id: string) => byId.get(id), [byId]);

  const pushToast = (msg: string, kind: Toast['kind'] = 'ok') => {
    const id = uid();
    setToasts((t) => [...t.slice(-2), { id, msg, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const unitPrice = useCallback((p: Product, size?: string) => {
    if (size && p.sizes) { const s = p.sizes.find((x) => x.label === size); if (s) return s.price; }
    return p.price;
  }, []);

  const addToCart: Store['addToCart'] = (productId, opts = {}) => {
    const p = byId.get(productId);
    if (!p || !p.available) { pushToast('That item is unavailable right now.', 'err'); return; }
    const qty = Math.max(1, Math.min(99, opts.qty ?? 1));
    const id = `${productId}|${opts.size ?? ''}`;
    setCart((c) => {
      const found = c.find((l) => l.id === id);
      if (found) return c.map((l) => (l.id === id ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...c, { id, productId, size: opts.size, qty }];
    });
    pushToast(`Added to cart: ${p.name}${opts.size ? ` (${opts.size})` : ''}`);
  };
  const setQty = (lineId: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== lineId) : c.map((l) => (l.id === lineId ? { ...l, qty: Math.min(99, qty) } : l))));
  const removeLine = (lineId: string) => { setCart((c) => c.filter((l) => l.id !== lineId)); pushToast('Item removed', 'info'); };
  const clearCart = () => setCart([]);

  const totals = useMemo(() => {
    let subtotal = 0; let hasUnpriced = false;
    for (const l of cart) {
      const p = byId.get(l.productId); if (!p) continue;
      const u = unitPrice(p, l.size);
      if (u == null) hasUnpriced = true; else subtotal += u * l.qty;
    }
    const deliveryFee = config.deliveryFee;
    return { subtotal, deliveryFee, total: subtotal + (deliveryFee ?? 0), hasUnpriced };
  }, [cart, byId, unitPrice]);

  const store: Store = {
    products, getProduct, categories, cart, cartCount: cart.reduce((n, l) => n + l.qty, 0),
    addToCart, setQty, removeLine, clearCart, unitPrice, totals,
    ui: { cartOpen, searchOpen, accountOpen }, setCartOpen, setSearchOpen, setAccountOpen,
    toasts, toast: pushToast,
    user, signIn: (u) => { setUser(u); save('basha.user', u); pushToast(`Signed in as ${u.name} (prototype)`); },
    signOut: () => { setUser(null); save('basha.user', null); pushToast('Signed out', 'info'); },
    lastOrder, setLastOrder: (o) => { setLastOrderState(o); saveSession('basha.lastOrder', o); },
    reviews,
    addReview: (r) => {
      const review: Review = { ...r, id: uid(), date: new Date().toISOString() };
      setReviews((prev) => { const next = { ...prev, [r.productId]: [review, ...(prev[r.productId] || [])] }; save('basha.reviews', next); return next; });
    },
    overrides,
    mgr: {
      addPhoto: (id, dataUrl) => updateOverrides((o) => {
        const base = o.photos[id] ?? [];
        return { ...o, photos: { ...o.photos, [id]: [...base, dataUrl].slice(0, 6) } };
      }),
      removePhoto: (id, index) => updateOverrides((o) => {
        const current = byId.get(id)?.images ?? [];
        const list = (o.photos[id] && o.photos[id].length ? o.photos[id] : current).filter((_, i) => i !== index);
        return { ...o, photos: { ...o.photos, [id]: list } };
      }),
      setPrice: (id, price) => updateOverrides((o) => ({ ...o, price: { ...o.price, [id]: price } })),
      setSizes: (id, sizes) => updateOverrides((o) => ({ ...o, sizes: { ...o.sizes, [id]: sizes } })),
      setName: (id, name) => updateOverrides((o) => ({ ...o, name: { ...o.name, [id]: name } })),
      setAvailable: (id, v) => updateOverrides((o) => ({ ...o, available: { ...o.available, [id]: v } })),
      setConfirmed: (id, v) => updateOverrides((o) => ({ ...o, confirmed: { ...o.confirmed, [id]: v } })),
      addCustom: (name, category) => {
        let id = slug(name) || uid();
        if (byId.has(id)) id = `${id}-${uid().slice(0, 3)}`;
        updateOverrides((o) => ({ ...o, custom: [...o.custom, { id, name, category, price: null, images: [], available: true, custom: true }] }));
        pushToast(`Added "${name}" — now give it a photo and price`);
      },
      removeCustom: (id) => { updateOverrides((o) => ({ ...o, custom: o.custom.filter((p) => p.id !== id) })); setCart((c) => c.filter((l) => l.productId !== id)); },
      exportJson: () => JSON.stringify(overrides),
      importJson: (json) => {
        try { const parsed = JSON.parse(json); const next = { ...emptyOverrides, ...parsed }; setOverrides(next); persistOverrides(next); return true; } catch { return false; }
      },
      reset: () => { setOverrides(emptyOverrides); persistOverrides(emptyOverrides); pushToast('Menu edits reset', 'info'); },
    },
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
