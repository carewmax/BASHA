import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';

export type Loc = { path: string; query: URLSearchParams };

const parse = (raw: string): Loc => {
  const [p = '', q = ''] = (raw || '/').split('?');
  const path = (p.startsWith('/') ? p : `/${p}`).replace(/\/+$/, '') || '/';
  return { path, query: new URLSearchParams(q) };
};
const readHash = () => parse(typeof window === 'undefined' ? '/' : window.location.hash.replace(/^#/, ''));

// Route state lives in memory so navigation works even where the browser blocks hash/history changes
// (sandboxed previews). The URL hash is kept in sync when allowed, so back/forward and deep links work.
let current: Loc = readHash();
const subs = new Set<(l: Loc) => void>();
const emit = (l: Loc) => { current = l; subs.forEach((f) => f(l)); };
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => emit(readHash()));
  window.addEventListener('popstate', () => emit(readHash()));
}

export function useLocation(): Loc {
  const [loc, setLoc] = useState<Loc>(current);
  useEffect(() => { subs.add(setLoc); setLoc(current); return () => { subs.delete(setLoc); }; }, []);
  return loc;
}

export function navigate(to: string) {
  emit(parse(to));
  try { window.history.pushState(null, '', `#${to}`); }
  catch { try { window.location.hash = to; } catch { /* in-memory route is enough */ } }
}

export function Link({ to, children, onClick, ...rest }: { to: string; children?: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={`#${to}`}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === '_blank') return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

/** "/product/beef-pizza" -> ['product','beef-pizza'] */
export const segs = (path: string) => path.split('/').filter(Boolean);
