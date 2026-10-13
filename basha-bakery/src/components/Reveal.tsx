import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react';

/** Scroll-in reveal (CSS transition). Disabled automatically for reduced-motion users. */
export function Reveal({ children, as: Tag = 'div', delay = 0, className = '' }: { children: ReactNode; as?: ElementType; delay?: number; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</Tag>;
}
