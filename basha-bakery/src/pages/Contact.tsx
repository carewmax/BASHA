import { useState, type FormEvent } from 'react';
import { Icon, Social } from '../components/Icons';
import { config } from '../config';

const TBC = <span className="tbc-dim">To be confirmed</span>;

export function Contact() {
  const c = config.contact;
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const [result, setResult] = useState<null | { kind: 'mail' | 'demo'; href?: string }>(null);
  const socials = (['instagram', 'facebook', 'tiktok'] as const).filter((k) => config.social[k]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = 'Please enter a valid email address.';
    if (f.message.trim().length < 10) er.message = 'Your message should be at least 10 characters.';
    setErr(er); if (Object.keys(er).length) { setResult(null); return; }
    if (c.email) {
      const body = `${f.message}\n\n— ${f.name} (${f.email})`;
      const href = `mailto:${c.email}?subject=${encodeURIComponent(f.subject || 'Message from the Basha website')}&body=${encodeURIComponent(body)}`;
      setResult({ kind: 'mail', href }); window.location.href = href;
    } else setResult({ kind: 'demo' });
  };

  return (
    <section className="dark contact">
      <div className="contact-bg" aria-hidden="true" />
      <div className="wrap contact-grid">
        <div className="contact-info">
          <h1 className="script">Get In Touch</h1>
          <p className="lead">We'd love to hear from you!</p>
          <ul className="c-list">
            <li><span className="c-ico"><Icon name="pin" size={22} /></span><div><strong>Location</strong>{c.address ? <span>{c.address}</span> : TBC}</div></li>
            <li><span className="c-ico"><Icon name="phone" size={22} /></span><div><strong>Phone</strong>{c.phone ? <a href={`tel:${c.phone.replace(/\s/g, '')}`}>{c.phone}</a> : TBC}</div></li>
            <li><span className="c-ico"><Icon name="mail" size={22} /></span><div><strong>Email</strong>{c.email ? <a href={`mailto:${c.email}`}>{c.email}</a> : TBC}</div></li>
            <li><span className="c-ico"><Icon name="clock" size={22} /></span><div><strong>Working Hours</strong>{c.hours ? <span>{c.hours}</span> : TBC}</div></li>
          </ul>
          {(c.phone || c.whatsapp) && (
            <div className="row-btns">
              {c.phone && <a className="btn btn-ghost" href={`tel:${c.phone.replace(/\s/g, '')}`}><Icon name="phone" size={18} /> Call us</a>}
              {c.whatsapp && <a className="btn btn-gold" href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer"><Social name="whatsapp" size={18} /> WhatsApp</a>}
            </div>
          )}
        </div>

        <form className="contact-form" onSubmit={submit} noValidate aria-label="Contact form">
          <label className="field"><span>Name*</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" aria-invalid={!!err.name} />{err.name && <small className="err">{err.name}</small>}</label>
          <label className="field"><span>Email*</span><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" aria-invalid={!!err.email} />{err.email && <small className="err">{err.email}</small>}</label>
          <label className="field"><span>Subject</span><input value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} /></label>
          <label className="field"><span>Message*</span><textarea rows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} aria-invalid={!!err.message} />{err.message && <small className="err">{err.message}</small>}</label>
          <button type="submit" className="btn btn-gold btn-block">Send Message</button>
          <div aria-live="polite">
            {result?.kind === 'mail' && <p className="form-note ok">Your email app should open with the message ready to send. If it didn't, <a href={result.href}>tap here</a>.</p>}
            {result?.kind === 'demo' && <p className="form-note demo">Demo mode: no email address is configured yet, so nothing was sent. Add Basha's email in <code>src/config.ts</code> to enable this form.</p>}
          </div>
        </form>

        <div className="map-card">
          {c.mapEmbedUrl ? <iframe title="Basha location map" src={c.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            : <div className="map-empty"><Icon name="pin" size={36} /><strong>Map coming soon</strong><span>{c.address || 'Location to be confirmed'}</span>{c.mapLink && <a className="btn btn-ghost" href={c.mapLink} target="_blank" rel="noopener noreferrer">Open in Maps</a>}</div>}
        </div>

        <div className="follow">
          <h2>Follow Us</h2>
          {socials.length || c.whatsapp ? (
            <div className="f-social">
              {socials.map((k) => <a key={k} href={config.social[k]} target="_blank" rel="noopener noreferrer" aria-label={`Basha on ${k}`}><Social name={k} /></a>)}
              {c.whatsapp && <a href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Social name="whatsapp" /></a>}
            </div>
          ) : <p className="muted-d">Social links will appear here once added.</p>}
          <p className="script sign">Good Food Brings People Together <Icon name="heart" size={20} /></p>
        </div>
      </div>
    </section>
  );
}
