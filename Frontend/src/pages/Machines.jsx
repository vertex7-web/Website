import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import Image from '../components/ui/Image';
import { fetchMachines, fetchMachineCategories, getMachines, getMachineCategories } from '../data/machines';
import heroMachinesImg from '../assets/hero-machines.jpg';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Machines.css';

export default function Machines() {
  const [machines, setMachines] = useState(getMachines());
  const [categories, setCategories] = useState(getMachineCategories());
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useDocumentMeta({
    title: 'Machineries | Vertex 7',
    description: 'Browse Vertex 7\'s fleet of heavy equipment available for rent — excavators, backhoes, dump trucks, and more in Bulacan, Philippines.',
  });

  useEffect(() => {
    Promise.all([fetchMachines(), fetchMachineCategories()]).then(
      ([machinesData, categoriesData]) => {
        setMachines(machinesData);
        setCategories(categoriesData);
        setLoading(false);
      }
    );
  }, []);

  const filtered =
    activeCategory === 'All'
      ? machines
      : machines.filter((m) => m.category === activeCategory);

  return (
    <>
      <PageHero
        eyebrow="Our Fleet"
        title="Heavy Equipment"
        subtitle="Browse our equipment catalog. Every machinery is serviced, inspected, and ready for your project."
        backgroundImage={heroMachinesImg}
      />

      <section className="machines-page" id="machines-catalog">
        <Container>
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="machines-page__filters reveal-slide-up" role="group" aria-label="Filter by category">
              <button
                className={`machines-page__filter-btn ${activeCategory === 'All' ? 'machines-page__filter-btn--active' : ''}`}
                onClick={() => setActiveCategory('All')}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`machines-page__filter-btn ${activeCategory === cat ? 'machines-page__filter-btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Machine Grid */}
          <div className="machines-page__grid">
            {filtered.map((machine, index) => (
              <Link
                to={`/machineries/${machine.slug}`}
                className={`machines-page__card reveal-slide-up delay-${Math.min((index % 3) + 1, 5)}`}
                key={machine.id}
              >
                <div className="machines-page__card-image-wrap">
                  <Image
                    src={machine.image}
                    alt={`${machine.type} — ${machine.brand} ${machine.model}`}
                    className="machines-page__card-image"
                    fallbackText={`${machine.brand} ${machine.model}`}
                    loading="lazy"
                  />
                  <span className="machines-page__card-badge">{machine.type}</span>
                </div>
                <div className="machines-page__card-body">
                  <span className="machines-page__card-brand">
                    {machine.brand} {machine.model}
                  </span>
                  <h2 className="machines-page__card-title">{machine.name}</h2>
                  <p className="machines-page__card-desc">{machine.description}</p>
                  <span className="machines-page__card-link">View Details →</span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="machines-page__empty">
              {loading ? 'Loading equipment...' : 'No equipment found in this category.'}
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
