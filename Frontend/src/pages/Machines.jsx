import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import Image from '../components/ui/Image';
import {
  fetchMachines,
  fetchMachineCategories,
  getMachines,
  normalizeCategoryName,
  matchesCategory,
} from '../data/machines';
import heroMachinesImg from '../assets/hero-machines.jpg';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Machines.css';

export default function Machines() {
  const [machines, setMachines] = useState(getMachines());
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const [showFilters, setShowFilters] = useState(false);

  useDocumentMeta({
    title: 'Machineries | Vertex 7',
    description:
      'Browse Vertex 7\'s fleet of heavy equipment available for rent — excavators, backhoes, dump trucks, and more in Bulacan, Philippines.',
  });

  useEffect(() => {
    Promise.all([fetchMachines(), fetchMachineCategories()]).then(
      ([machinesData]) => {
        setMachines(machinesData);
        setLoading(false);
      }
    );
  }, []);

  // Compute live category inventory counts
  const categoryCounts = useMemo(() => {
    const counts = { All: machines.length };
    machines.forEach((m) => {
      const canonical = normalizeCategoryName(m.category) || 'General';
      counts[canonical] = (counts[canonical] || 0) + 1;
    });
    return counts;
  }, [machines]);

  // Unique list of categories present in actual inventory (sorted alphabetically)
  const availableCategories = useMemo(() => {
    const nonAll = Object.keys(categoryCounts).filter(
      (c) => c !== 'All' && categoryCounts[c] > 0
    );
    return ['All', ...nonAll.sort((a, b) => a.localeCompare(b))];
  }, [categoryCounts]);

  // Filtered machines based on category + keyword search
  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return machines.filter((machine) => {
      // 1. Category filter
      const matchCat = matchesCategory(machine.category, activeCategory);
      if (!matchCat) return false;

      // 2. Keyword search filter
      if (!query) return true;

      const name = (machine.name || '').toLowerCase();
      const brand = (machine.brand || '').toLowerCase();
      const model = (machine.model || '').toLowerCase();
      const category = (machine.category || '').toLowerCase();
      const desc = (machine.description || '').toLowerCase();

      return (
        name.includes(query) ||
        brand.includes(query) ||
        model.includes(query) ||
        category.includes(query) ||
        desc.includes(query)
      );
    });
  }, [machines, activeCategory, searchQuery]);

  function handleCategoryChange(cat) {
    const nextParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', cat);
    }
    setSearchParams(nextParams, { replace: true });
  }

  function handleSearchChange(e) {
    const val = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (!val.trim()) {
      nextParams.delete('q');
    } else {
      nextParams.set('q', val);
    }
    setSearchParams(nextParams, { replace: true });
  }

  function handleClearFilters() {
    setSearchParams({}, { replace: true });
  }

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
          {/* Subtle Fleet Search & Toggleable Filter Bar */}
          <div className="machines-toolbar reveal-slide-up" role="region" aria-label="Machinery search and filters">
            <div className="machines-toolbar__main">
              {/* Search Field */}
              <div className="machines-toolbar__search">
                <svg
                  className="machines-toolbar__search-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="machines-toolbar__search-input"
                  placeholder="Search equipment, brand, model..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search equipment by keyword, brand, or model"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="machines-toolbar__search-clear"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('q');
                      setSearchParams(next, { replace: true });
                    }}
                    aria-label="Clear search input"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Controls: Filter Toggle, Clear, and Unit Count */}
              <div className="machines-toolbar__controls">
                {availableCategories.length > 1 && (
                  <button
                    type="button"
                    className={`machines-toolbar__toggle-btn ${showFilters ? 'is-open' : ''} ${activeCategory !== 'All' ? 'is-filtered' : ''}`}
                    onClick={() => setShowFilters((prev) => !prev)}
                    aria-expanded={showFilters}
                    aria-label="Toggle category filters"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="4" y1="21" x2="4" y2="14" />
                      <line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" />
                      <line x1="20" y1="12" x2="20" y2="3" />
                      <line x1="1" y1="14" x2="7" y2="14" />
                      <line x1="9" y1="8" x2="15" y2="8" />
                      <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                    <span>Categories</span>
                    {activeCategory !== 'All' && (
                      <span className="machines-toolbar__tag">{activeCategory}</span>
                    )}
                    <svg
                      className={`machines-toolbar__chevron ${showFilters ? 'is-rotated' : ''}`}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                )}

                {(activeCategory !== 'All' || searchQuery) && (
                  <button
                    type="button"
                    className="machines-toolbar__reset-btn"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </button>
                )}

                <span className="machines-toolbar__count">
                  {filtered.length} {filtered.length === 1 ? 'unit' : 'units'}
                </span>
              </div>
            </div>

            {/* Collapsible Category Drawer */}
            {showFilters && availableCategories.length > 1 && (
              <div className="machines-toolbar__drawer">
                <div
                  className="machines-toolbar__pills"
                  role="group"
                  aria-label="Filter by category"
                >
                  {availableCategories.map((cat) => {
                    const isActive =
                      matchesCategory(cat, activeCategory) ||
                      (cat === 'All' && activeCategory === 'All');
                    const count = categoryCounts[cat] ?? 0;

                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`machines-toolbar__pill ${isActive ? 'is-active' : ''}`}
                        onClick={() => handleCategoryChange(cat)}
                        aria-pressed={isActive}
                      >
                        <span>{cat}</span>
                        <span className="machines-toolbar__pill-count">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Machine Grid */}
          <div className="machines-page__grid">
            {filtered.map((machine, index) => (
              <Link
                to={`/machineries/${machine.slug}`}
                className={`machines-page__card reveal-slide-up delay-${Math.min((index % 3) + 1, 5)}`}
                key={machine.id || machine.slug}
              >
                <div className="machines-page__card-image-wrap">
                  <Image
                    src={machine.image}
                    alt={`${machine.category || machine.name} — ${machine.brand} ${machine.model}`}
                    className="machines-page__card-image"
                    fallbackText={`${machine.brand} ${machine.model}`}
                    loading="lazy"
                  />
                  <span className="machines-page__card-badge">{machine.category}</span>
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

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="machines-page__empty-card reveal-slide-up">
              <div className="machines-page__empty-icon" aria-hidden="true">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h3 className="machines-page__empty-title">
                {loading ? 'Loading Equipment Fleet...' : 'No Matching Equipment Found'}
              </h3>
              <p className="machines-page__empty-desc">
                {loading
                  ? 'Fetching the latest heavy equipment availability...'
                  : searchQuery
                    ? `No machinery found matching "${searchQuery}" in ${activeCategory === 'All' ? 'our fleet catalog' : activeCategory}.`
                    : `There are currently no machines listed under "${activeCategory}".`}
              </p>
              {!loading && (
                <button
                  type="button"
                  className="machines-page__empty-btn"
                  onClick={handleClearFilters}
                >
                  View All Equipment ({machines.length})
                </button>
              )}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
