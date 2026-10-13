import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { loadSession, saveSession } from '../lib/storage';

/** Short branded intro, shown once per visit; skipped for reduced-motion users. Never blocks longer than ~1s. */
export function Loader() {
  const skip = typeof window !== 'undefined' && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || loadSession('basha.seen', false));
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>(skip ? 'gone' : 'in');
  useEffect(() => {
    if (skip) return;
    saveSession('basha.seen', true);
    const a = window.setTimeout(() => setPhase('out'), 600);
    const b = window.setTimeout(() => setPhase('gone'), 1000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (phase === 'gone') return null;
  return (
    <div className={`loader ${phase === 'out' ? 'is-out' : ''}`} role="status" aria-label="Loading Basha Bakery & Restaurant">
      <div className="loader-in"><Logo height={150} link={false} /><div className="loader-bar" aria-hidden="true"><i /></div></div>
    </div>
  );
}
