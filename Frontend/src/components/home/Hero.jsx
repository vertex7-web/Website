import Container from '../ui/Container';
import Button from '../ui/Button';
import heroBg from '../../assets/hero-bg.jpg';
import './Hero.css';

export default function Hero() {
  return (
    <section
      className="hero"
      id="hero"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="hero__overlay" aria-hidden="true" />
      <Container className="hero__content">
        <span className="hero__eyebrow">
          Heavy Equipment Rentals &amp; Construction Supplies
        </span>
        <h1 className="hero__title">
          We Provide the<br />
          Muscle.<br />
          <span className="hero__title-accent">You Build the Future.</span>
        </h1>
        <p className="hero__description">
          {/* CLIENT TO PROVIDE — short supporting statement about the company's value proposition */}
          Reliable heavy equipment, professional service, and trusted partnerships
          for construction projects of any scale.
        </p>
        <div className="hero__actions">
          <Button to="/machines" variant="primary" size="lg">
            Explore Machines
          </Button>
          <Button to="/contact" variant="outline" size="lg">
            Contact Us
          </Button>
        </div>
      </Container>
    </section>
  );
}
