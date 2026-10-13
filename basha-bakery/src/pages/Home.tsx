import { useRef } from 'react';
import { Link } from '../router';
import { Icon } from '../components/Icons';
import { Torn } from '../components/Torn';
import { Reveal } from '../components/Reveal';
import { FoodImage } from '../components/FoodImage';
import { Logo } from '../components/Logo';
import { benefits, hero, images, gallery } from '../data/content';
import { popularIds } from '../data/menu';
import { useStore } from '../store';

function HeroFood() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5;
    if (ref.current) ref.current.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 7}deg) translateZ(0)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <div className="hero-food-wrap" onPointerMove={onMove} onPointerLeave={reset}>
      <div className="hero-food" ref={ref}>
        <img src={images.heroFood} alt="Cheeseburger with a pile of golden fries" decoding="async" fetchPriority="high" draggable={false} />
      </div>
      <span className="steam s1" aria-hidden="true" /><span className="steam s2" aria-hidden="true" /><span className="steam s3" aria-hidden="true" />
    </div>
  );
}

export function Home() {
  const { getProduct } = useStore();
  const popular = popularIds.map((id) => getProduct(id)).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-in">
          <div className="hero-copy">
            <Logo height={190} link={false} className="hero-logo" />
            <h1 className="script hero-title"><span>{hero.line1}</span><span>{hero.line2}</span></h1>
            <p className="hero-sub">{hero.sub}</p>
            <div className="hero-cta">
              <Link to="/menu" className="btn btn-gold">Order Now <Icon name="arrowR" size={18} /></Link>
              <Link to="/about" className="btn btn-ghost">Discover Basha</Link>
            </div>
          </div>
          <HeroFood />
        </div>
        <Torn fill="var(--cream)" />
      </section>

      <section className="cream benefits" aria-label="Why Basha">
        <ul>
          {benefits.map((b) => (
            <li key={b.title}>
              <span className="b-ico"><Icon name={b.icon} size={30} /></span>
              <span><strong>{b.title}</strong><small>{b.text}</small></span>
            </li>
          ))}
        </ul>
      </section>

      <section className="cream popular">
        <div className="wrap">
          <Reveal className="sec-head">
            <h2 className="script">Our Popular Dishes</h2>
            <Link to="/menu" className="more">View Menu <Icon name="arrowR" size={16} /></Link>
          </Reveal>
          <ul className="popular-grid">
            {popular.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 80}>
                <Link to={`/product/${p.id}`} className="pop-card" aria-label={`${p.name} — view details`}>
                  <span className="pop-img"><FoodImage product={p} sizes="(max-width:700px) 46vw, 260px" /></span>
                  <span className="pop-name">{p.name}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="dark vibes">
        <Torn fill="var(--cream)" flip seed={7} />
        <div className="wrap vibes-in">
          <Reveal className="vibes-copy">
            <p className="script vibes-line">Good Food.<br />Great Vibes.</p>
            <p>Burgers, pizza, pasta, salads and more — see the food and the place.</p>
            <Link to="/gallery" className="btn btn-gold">Open the gallery <Icon name="arrowR" size={18} /></Link>
          </Reveal>
          <Reveal className="vibes-strip" delay={120}>
            {[gallery[0], gallery[1], gallery[7]].map((g) => <img key={g.src} src={g.src} alt={g.alt} loading="lazy" decoding="async" />)}
          </Reveal>
        </div>
      </section>
    </>
  );
}
