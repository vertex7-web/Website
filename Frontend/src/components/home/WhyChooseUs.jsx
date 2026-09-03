import Container from '../ui/Container';
import whyImg from '../../assets/why-choose-us.jpg';
import useParallax from '../../hooks/useParallax';
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
  const { containerRef, targetRef, textRef } = useParallax({
    speed: 0.22,
    textSpeed: -0.05,
  });

  return (
    <section className="why-choose" id="why-choose-us" ref={containerRef}>
      <div className="why-choose__bg-wrap" aria-hidden="true">
        <div
          ref={targetRef}
          className="why-choose__bg-img"
          style={{ backgroundImage: `url(${whyImg})` }}
        />
        <div className="why-choose__overlay" />
      </div>
      <Container className="why-choose__grid" ref={textRef}>
        {/* Content Column */}
        <div className="why-choose__content">
          <span className="why-choose__eyebrow reveal-slide-up">Why Vertex 7</span>
          <h2 className="why-choose__title reveal-slide-up delay-1">
            Built on Reliability.<br />
            Driven by Results.
          </h2>

          <ul className="why-choose__list">
            {POINTS.map((point, index) => (
              <li
                className={`why-choose__item reveal-slide-up delay-${Math.min(index + 1, 5)}`}
                key={point.title}
              >
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
