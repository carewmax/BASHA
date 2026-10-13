import { useStore } from '../store';
import { Icon } from './Icons';

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}><Icon name={t.kind === 'err' ? 'alert' : 'check'} size={18} />{t.msg}</div>
      ))}
    </div>
  );
}
