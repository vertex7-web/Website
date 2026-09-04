import Container from './Container';
import useParallax from '../../hooks/useParallax';
import './PageHero.css';

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  children,
}) {
  const { containerRef, targetRef, textRef } = useParallax({
    speed: 0.22,
    textSpeed: -0.05,
    disabled: !backgroundImage,
  });

  return (
    <section
      ref={containerRef}
      className={`page-hero ${backgroundImage ? 'page-hero--has-bg' : ''}`}
    >
      {backgroundImage && (
        <div className="page-hero__bg-wrap" aria-hidden="true">
          <div
            ref={targetRef}
            className="page-hero__bg-img"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="page-hero__overlay" />
        </div>
      )}
      <Container className="page-hero__content" ref={textRef}>
        {eyebrow && <span className="page-hero__eyebrow animate-slide-up">{eyebrow}</span>}
        <h1 className="page-hero__title animate-slide-up delay-1">{title}</h1>
        {subtitle && <p className="page-hero__subtitle animate-slide-up delay-2">{subtitle}</p>}
        {children && <div className="animate-slide-up delay-3">{children}</div>}
      </Container>
    </section>
  );
}

