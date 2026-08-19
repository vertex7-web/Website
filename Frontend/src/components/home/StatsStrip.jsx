import Container from '../ui/Container';
import './StatsStrip.css';

/* ── Placeholder Statistics ──────────────────────────────────
   These values are PLACEHOLDERS ONLY and must be replaced
   with client-verified statistics before launch.
   ─────────────────────────────────────────────────────────── */
const STATS = [
  { value: '00+', label: 'Projects / Rentals' },
  { value: '00%', label: 'Service Reliability' },
  { value: '00+', label: 'Equipment Units' },
  { value: '00+', label: 'Operating Hours' },
];

export default function StatsStrip() {
  return (
    <section className="stats-strip" id="stats-strip" aria-label="Company statistics">
      <Container className="stats-strip__inner">
        {STATS.map((stat) => (
          <div className="stats-strip__item" key={stat.label}>
            <span className="stats-strip__value">{stat.value}</span>
            <span className="stats-strip__label">{stat.label}</span>
          </div>
        ))}
      </Container>
    </section>
  );
}
