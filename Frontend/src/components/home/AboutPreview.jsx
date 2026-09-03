import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import aboutImg from '../../assets/about-preview.jpg';
import useParallax from '../../hooks/useParallax';
import './AboutPreview.css';

export default function AboutPreview() {
  const { containerRef, targetRef, textRef } = useParallax({
    speed: 0.22,
    textSpeed: -0.05,
  });

  return (
    <section className="about-preview" id="about-preview" ref={containerRef}>
      <div className="about-preview__bg-wrap" aria-hidden="true">
        <div
          ref={targetRef}
          className="about-preview__bg-img"
          style={{ backgroundImage: `url(${aboutImg})` }}
        />
        <div className="about-preview__overlay" />
      </div>
      <Container className="about-preview__grid" ref={textRef}>
        {/* Text Column */}
        <div className="about-preview__text">
          <SectionHeading
            eyebrow="Who We Are"
            title="Engineered to Support Uncompromising Demands"
          />
          <p className="about-preview__body reveal-slide-up delay-2">
            {/* CLIENT TO PROVIDE — company overview copy */}
            Vertex 7 delivers dependable heavy equipment and construction supplies
            to contractors, developers, and project managers across the region.
            Our commitment to quality and reliability drives every rental, every
            delivery, and every project we support.
          </p>
          <p className="about-preview__body reveal-slide-up delay-3">
            With a fleet of well-maintained machinery and a team of experienced
            professionals, we ensure your projects stay on schedule and within
            budget.
          </p>
          <div className="reveal-slide-up delay-4">
            <Button to="/about" variant="ghost" size="md" className="about-preview__cta">
              Learn More About Us →
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
