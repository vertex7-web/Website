import Container from '../ui/Container';
import './StatsStrip.css';

/* ── Placeholder Statistics ──────────────────────────────────
   These values are PLACEHOLDERS ONLY and must be replaced
   with client-verified statistics before launch.
   ─────────────────────────────────────────────────────────── */
const STATS = [
  {/*{ value: '8+', label: 'Years in Construction & Rentals' },
  { value: '15+', label: 'Modern Equipment Fleet' },
  { value: '10+', label: 'Provinces Covered' },
  { value: '100%', label: 'Service Reliability' },
   */}
];

export default function StatsStrip() {
  return (
    <section className="stats-strip" id="stats-strip" aria-label="Company statistics">
      <Container className="stats-strip__inner">
        {STATS.map((stat, index) => (
          <div
            className={`stats-strip__item reveal-slide-up delay-${Math.min(index + 1, 5)}`}
            key={stat.label}
          >
            <span className="stats-strip__value">{stat.value}</span>
            <span className="stats-strip__label">{stat.label}</span>
          </div>
        ))}
      </Container>
    </section>
  );
}
