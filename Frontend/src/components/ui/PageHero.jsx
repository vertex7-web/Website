import Container from './Container';
import './PageHero.css';

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
  children,
}) {
  return (
    <section
      className="page-hero"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {backgroundImage && <div className="page-hero__overlay" aria-hidden="true" />}
      <Container className="page-hero__content">
        {eyebrow && <span className="page-hero__eyebrow">{eyebrow}</span>}
        <h1 className="page-hero__title">{title}</h1>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
        {children}
      </Container>
    </section>
  );
}
