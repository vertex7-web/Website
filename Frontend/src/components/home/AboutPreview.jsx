import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import aboutImg from '../../assets/about-preview.jpg';
import './AboutPreview.css';

export default function AboutPreview() {
  return (
    <section className="about-preview" 
             id="about-preview"
             style={{ backgroundImage: `url(${aboutImg})` }} >
      <div className="about-preview__overlay" aria-hidden="true" />
      <Container className="about-preview__grid">
        {/* Text Column */}
        <div className="about-preview__text">
          <SectionHeading
            eyebrow="Who We Are"
            title="Engineered to Support Uncompromising Demands"
            
          />
          <p className="about-preview__body">
            {/* CLIENT TO PROVIDE — company overview copy */}
            Vertex 7 delivers dependable heavy equipment and construction supplies
            to contractors, developers, and project managers across the region.
            Our commitment to quality and reliability drives every rental, every
            delivery, and every project we support.
          </p>
          <p className="about-preview__body">
            With a fleet of well-maintained machinery and a team of experienced
            professionals, we ensure your projects stay on schedule and within
            budget.
          </p>
          <Button to="/about" variant="ghost" size="md" className="about-preview__cta">
            Learn More About Us →
          </Button>
        </div>
      </Container>
    </section>
  );
}
