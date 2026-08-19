import Container from '../ui/Container';
import whyImg from '../../assets/why-choose-us.jpg';
import './WhyChooseUs.css';

/* ── Placeholder value propositions ──────────────────────────
   Only treat as final claims after client approval.
   ─────────────────────────────────────────────────────────── */
const POINTS = [
  {
    title: 'Proven Experience',
    description: 'Years of successful project support across diverse construction environments.',
  },
  {
    title: 'Reliable Equipment',
    description: 'Every machine is regularly serviced, inspected, and maintained for peak performance.',
  },
  {
    title: 'Professional Service',
    description: 'Responsive coordination, on-time delivery, and dedicated support throughout your rental.',
  },
  {
    title: 'Trusted Partnership',
    description: 'We build long-term relationships with contractors who depend on us project after project.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-choose" id="why-choose-us">
      <Container className="why-choose__grid">
        {/* Image Column */}
        <div className="why-choose__image-wrap">
          <img
            src={whyImg}
            alt="Heavy wheel loader operating on construction site"
            className="why-choose__image"
            loading="lazy"
          />
        </div>

        {/* Content Column */}
        <div className="why-choose__content">
          <span className="why-choose__eyebrow">Why Vertex 7</span>
          <h2 className="why-choose__title">
            Built on Reliability.<br />
            Driven by Results.
          </h2>

          <ul className="why-choose__list">
            {POINTS.map((point) => (
              <li className="why-choose__item" key={point.title}>
                <span className="why-choose__bullet" aria-hidden="true" />
                <div>
                  <h3 className="why-choose__item-title">{point.title}</h3>
                  <p className="why-choose__item-description">{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
