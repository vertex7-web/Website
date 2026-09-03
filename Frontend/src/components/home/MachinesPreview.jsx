import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import Image from '../ui/Image';
import { fetchMachines, getMachines } from '../../data/machines';
import './MachinesPreview.css';

export default function MachinesPreview() {
  const [machines, setMachines] = useState(getMachines().slice(0, 3));

  useEffect(() => {
    fetchMachines().then((data) => setMachines(data.slice(0, 3)));
  }, []);

  return (
    <section className="machines-preview" id="machines-preview">
      <Container>
        <SectionHeading
          eyebrow="Our Fleet"
          title="Heavy Equipment Ready to Deploy"
          subtitle="Well-maintained machinery, serviced and inspected — ready for your next project."
        />

        <div className="machines-preview__grid">
          {machines.map((machine, index) => (
            <Link
              to={`/machineries/${machine.slug}`}
              className={`machine-card reveal-slide-up delay-${Math.min(index + 1, 5)}`}
              key={machine.id || machine.slug}
            >
              <div className="machine-card__image-wrap">
                <Image
                  src={machine.image}
                  alt={`${machine.type} — ${machine.brand} ${machine.model}`}
                  className="machine-card__image"
                  fallbackText={`${machine.brand} ${machine.model}`}
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
                <span className="machine-card__link">View Machinery →</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="machines-preview__footer reveal-slide-up delay-4">
          <Button to="/machineries" variant="outline-lime" size="md">
            View All Equipment
          </Button>
        </div>
      </Container>
    </section>
  );
}
