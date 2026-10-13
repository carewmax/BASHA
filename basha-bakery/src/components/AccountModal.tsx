import { useRef, useState, type FormEvent } from 'react';
import { Link } from '../router';
import { Icon } from './Icons';
import { Logo } from './Logo';
import { useStore } from '../store';
import { useModal } from '../lib/useModal';

/** PROTOTYPE sign-in: nothing is sent to a server. Details stay in this browser only. */
export function AccountModal() {
  const { ui, setAccountOpen, user, signIn, signOut } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [f, setF] = useState({ name: '', id: '', pw: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const close = () => setAccountOpen(false);
  useModal(ui.accountOpen, close, ref);
  if (!ui.accountOpen) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (mode === 'up' && f.name.trim().length < 2) er.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.id.trim()) && !/^\+?[\d\s-]{7,}$/.test(f.id.trim())) er.id = 'Enter a valid email or phone number.';
    if (f.pw.length < 6) er.pw = 'Password must be at least 6 characters.';
    setErr(er);
    if (Object.keys(er).length) return;
    signIn({ name: mode === 'up' ? f.name.trim() : f.id.split('@')[0], email: f.id.trim() });
    setF({ name: '', id: '', pw: '' }); close();
  };

  return (
    <div className="overlay overlay-center" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="account" role="dialog" aria-modal="true" aria-label={user ? 'Your account' : 'Sign in'} ref={ref} tabIndex={-1}>
        <button type="button" className="icon-btn account-x" aria-label="Close" onClick={close}><Icon name="x" /></button>
        <div className="account-side">
          <Logo height={110} link={false} />
          <p className="script">Good Food.<br />Great People.</p>
        </div>
        <div className="account-main">
          {user ? (
            <>
              <h2 className="script">Hello, {user.name}</h2>
              <p className="muted">{user.email}</p>
              <p className="proto">Prototype account — saved on this device only. Order history isn't connected to a server yet.</p>
              <Link to="/manage" className="btn btn-dark btn-block" onClick={close}>Manage menu photos &amp; prices</Link>
              <button type="button" className="btn btn-ghost-dark btn-block" onClick={() => { signOut(); close(); }}>Sign out</button>
            </>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 className="script">{mode === 'in' ? 'Welcome Back' : 'Join Basha'}</h2>
              <p className="muted">{mode === 'in' ? 'Log in to your account' : 'Create your account'}</p>
              <p className="proto">Prototype sign-in — no server is connected, so nothing is sent or stored online.</p>
              {mode === 'up' && (
                <label className="field"><span>Your name</span>
                  <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" aria-invalid={!!err.name} />
                  {err.name && <small className="err">{err.name}</small>}
                </label>
              )}
              <label className="field"><span>Email or phone number</span>
                <input value={f.id} onChange={(e) => setF({ ...f, id: e.target.value })} autoComplete="username" data-autofocus aria-invalid={!!err.id} />
                {err.id && <small className="err">{err.id}</small>}
              </label>
              <label className="field"><span>Password</span>
                <span className="pw"><input type={show ? 'text' : 'password'} value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} aria-invalid={!!err.pw} />
                  <button type="button" className="icon-btn" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((v) => !v)}><Icon name="eye" size={18} /></button></span>
                {err.pw && <small className="err">{err.pw}</small>}
              </label>
              <button type="submit" className="btn btn-gold btn-block">{mode === 'in' ? 'Log In' : 'Create Account'}</button>
              <p className="switch">{mode === 'in' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button type="button" className="link-btn" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr({}); }}>{mode === 'in' ? 'Sign Up' : 'Log In'}</button></p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
