import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import './ServicesPreview.css';

/* ── Placeholder service data ────────────────────────────────
   Replace with actual services once client confirms the list.
   ─────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M12 6V2" />
        <path d="M6 6V4" />
        <path d="M18 6V4" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: 'Heavy Equipment Rental',
    description: 'Excavators, loaders, bulldozers, cranes, and more — all maintained to the highest standards and ready for deployment.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Equipment Transport',
    description: 'Safe and timely transport of heavy machinery to and from your project site, with professional handling every step of the way.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Construction Supplies',
    description: 'Quality construction materials and supplies to keep your project moving. Aggregates, concrete, and essential building materials.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: 'Machinery Support',
    description: 'On-site technical support and maintenance services to minimize downtime and keep your equipment running at peak performance.',
  },
];

export default function ServicesPreview() {
  return (
    <section className="services-preview" id="services-preview">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Services Built for the Field"
          subtitle="From equipment rental to on-site support, we deliver the services that keep your projects moving forward."
          align="center"
        />

        <div className="services-preview__grid">
          {SERVICES.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-card__icon" aria-hidden="true">
                {service.icon}
              </div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__description">{service.description}</p>
              <span className="service-card__link">
                Learn More →
              </span>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
