import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Image from '../components/ui/Image';
import { fetchMachineBySlug } from '../data/machines';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './MachineDetails.css';

export default function MachineDetails() {
  const { slug } = useParams();
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);

  useDocumentMeta({
    title: machine ? `${machine.name} | Vertex 7` : 'Loading... | Vertex 7',
    description: machine
      ? `Rent the ${machine.name} from Vertex 7. ${machine.description || 'Heavy equipment rental in Bulacan, Philippines.'}`
      : 'Heavy equipment details — Vertex 7',
  });

  useEffect(() => {
    setLoading(true);
    fetchMachineBySlug(slug).then((data) => {
      setMachine(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <>
        <PageHero eyebrow="Equipment" title="Loading..." />
        <section className="machine-detail__not-found">
          <Container><p>Loading equipment details...</p></Container>
        </section>
      </>
    );
  }

  if (!machine) {
    return (
      <>
        <PageHero eyebrow="Equipment" title="Machine Not Found" />
        <section className="machine-detail__not-found">
          <Container>
            <p>The equipment you're looking for may no longer be available.</p>
            <Button to="/machineries" variant="outline-lime" size="md">
              View All Machineries
            </Button>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={machine.category}
        title={machine.name}
        backgroundImage={machine.image}
      />

      <section className="machine-detail" id="machine-detail">
        <Container>
          {/* Navigation Bar: Back Button & Breadcrumbs */}
          <div className="machine-detail__nav-bar">
            <Link to="/machineries" className="machine-detail__back-btn" aria-label="Back to Machineries">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back</span>
            </Link>

            <nav className="machine-detail__breadcrumb" aria-label="Breadcrumb">
              <Link to="/machineries" className="machine-detail__breadcrumb-link">Equipment</Link>
              <span className="machine-detail__breadcrumb-sep" aria-hidden="true">/</span>
              <span className="machine-detail__breadcrumb-current">{machine.name}</span>
            </nav>
          </div>

          <div className="machine-detail__grid">
            {/* Image */}
            <div className="machine-detail__image-wrap">
              <Image
                src={machine.image}
                alt={`${machine.type} — ${machine.brand} ${machine.model}`}
                className="machine-detail__image"
                fallbackText={`${machine.brand} ${machine.model}`}
              />
            </div>

            {/* Info */}
            <div className="machine-detail__info">
              <span className="machine-detail__type-badge">{machine.type}</span>

              <div className="machine-detail__meta">
                <div className="machine-detail__meta-item">
                  <span className="machine-detail__meta-label">Brand</span>
                  <span className="machine-detail__meta-value">{machine.brand}</span>
                </div>
                <div className="machine-detail__meta-item">
                  <span className="machine-detail__meta-label">Model</span>
                  <span className="machine-detail__meta-value">{machine.model}</span>
                </div>
              </div>

              <h2 className="machine-detail__section-title">Description</h2>
              <p className="machine-detail__description">{machine.description}</p>

              <div className="machine-detail__cta">
                <Button to="/quote" variant="primary" size="lg">
                  Inquire About This Machine
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
