import Container from '../ui/Container';
import Button from '../ui/Button';
import heroVidWeb from '../../assets/hero-vid.webm';
import heroVid from '../../assets/hero-vid.mp4';
import useParallax from '../../hooks/useParallax';
import './Hero.css';

export default function Hero() {
  const { containerRef, targetRef, textRef } = useParallax({
    speed: 0.26,
    textSpeed: -0.06,
  });

  return (
    <section className="hero" id="hero" ref={containerRef}>
      <div className="hero__media-wrap" aria-hidden="true">
        <video
          key={heroVidWeb}
          ref={targetRef}
          className="hero__video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={heroVidWeb} type="video/webm" />
          <source src={heroVid} type="video/mp4" />
        </video>
        <div className="hero__overlay" />
      </div>
      <Container className="hero__content" ref={textRef}>
        <span className="hero__eyebrow animate-slide-up">
          Heavy Equipment Rentals &amp; Construction Supplies
        </span>
        <h1 className="hero__title animate-slide-up delay-1">
          Empowering<br />
          Builders.<br />
          <span className="hero__title-accent">Elevating Standards.</span>
        </h1>
        <p className="hero__description animate-slide-up delay-2">
          Reliable heavy equipment, professional service, and trusted partnerships
          for construction projects of any scale.
        </p>
        <div className="hero__actions animate-slide-up delay-3">
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
