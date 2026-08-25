import Container from '../ui/Container';
import Button from '../ui/Button';
import heroVid from '../../assets/hero-vid.mp4';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <video
        className="hero__video"
        src={heroVid}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="hero__overlay" aria-hidden="true" />
      <Container className="hero__content">
        <span className="hero__eyebrow">
          Heavy Equipment Rentals &amp; Construction Supplies
        </span>
        <h1 className="hero__title">
          Empowering<br />
          Builders.<br />
          <span className="hero__title-accent">Elevating Standards.</span>
        </h1>
        <p className="hero__description">
          {/* CLIENT TO PROVIDE — short supporting statement about the company's value proposition */}
          Reliable heavy equipment, professional service, and trusted partnerships
          for construction projects of any scale.
        </p>
        <div className="hero__actions">
          <Button to="/machineries" variant="primary" size="lg">
            Explore Machineries
          </Button>
          <Button to="/contact" variant="outline" size="lg">
            Contact Us
          </Button>
        </div>
      </Container>
    </section>
  );
}
