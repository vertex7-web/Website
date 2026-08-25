import { Link } from 'react-router';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { getMachines } from '../../data/machines';
import './MachinesPreview.css';

const FEATURED_MACHINES = getMachines().slice(0, 3);

export default function MachinesPreview() {
  return (
    <section className="machines-preview" id="machines-preview">
      <Container>
        <SectionHeading
          eyebrow="Our Fleet"
          title="Heavy Equipment Ready to Deploy"
          subtitle="Well-maintained machinery, serviced and inspected — ready for your next project."
        />

        <div className="machines-preview__grid">
          {FEATURED_MACHINES.map((machine) => (
            <Link
              to={`/machines/${machine.slug}`}
              className="machine-card"
              key={machine.slug}
            >
              <div className="machine-card__image-wrap">
                <img
                  src={machine.image}
                  alt={`${machine.type} — ${machine.brand} ${machine.model}`}
                  className="machine-card__image"
                  loading="lazy"
                />
                <span className="machine-card__badge">{machine.type}</span>
              </div>
              <div className="machine-card__body">
                <span className="machine-card__brand">
                  {machine.brand} {machine.model}
                </span>
                <h3 className="machine-card__title">{machine.type}</h3>
                <p className="machine-card__description">{machine.description}</p>
                <span className="machine-card__link">View Machine →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="machines-preview__footer">
          <Button to="/machines" variant="outline-lime" size="md">
            View All Equipment
          </Button>
        </div>
      </Container>
    </section>
  );
}
