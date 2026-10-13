import { Link } from '../router';
import { Icon } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { about, images } from '../data/content';

export function About() {
  return (
    <>
      <section className="page-hero about-hero" style={{ ['--bg' as string]: `url(${images.g9})` }}>
        <div className="page-hero-bg photo" aria-hidden="true" />
        <div className="wrap">
          <h1 className="script">About Basha</h1>
          <p>{about.tagline}</p>
        </div>
      </section>
      <div className="cream paper about-body">
        <div className="wrap narrow">
          <Reveal><p className="about-intro">{about.intro}</p></Reveal>
          <ul className="values">
            {about.values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 90}>
                <span className="v-ico"><Icon name={v.icon} size={40} /></span>
                <strong>{v.title}</strong><small>{v.text}</small>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="wrap">
          <Reveal className="mosaic">
            <figure><img src={images.aboutPizza} alt="Pizza fresh from the oven" loading="lazy" /></figure>
            <figure><img src={images.aboutBurger} alt="Burger with a side of fries" loading="lazy" /></figure>
            <div className="mosaic-card dark"><p className="script">Good Food<br />Great Vibes</p><Icon name="heart" size={26} /></div>
          </Reveal>
          <Reveal className="banner" delay={100}>
            <img src={images.g8} alt="Warm bakery display counter" loading="lazy" />
            <div className="banner-txt"><p className="script">Basha Bakery &amp; Restaurant</p><p className="banner-sub">Fresh Food <i>·</i> Family <i>·</i> Community</p></div>
          </Reveal>
          <div className="cta-row"><Link to="/menu" className="btn btn-gold">Explore our menu <Icon name="arrowR" size={18} /></Link></div>
        </div>
      </div>
    </>
  );
}
