import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Image from '../components/ui/Image';
import { fetchProjectBySlug } from '../data/projects';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './ProjectDetails.css';

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useDocumentMeta({
    title: project ? `${project.name} | Vertex 7 Projects` : 'Loading... | Vertex 7',
    description: project
      ? `View the ${project.name} project by Vertex 7. ${project.description || 'Construction project in Bulacan, Philippines.'}`
      : 'Project details — Vertex 7',
  });

  useEffect(() => {
    setLoading(true);
    fetchProjectBySlug(slug).then((data) => {
      setProject(data);
      setActiveIndex(0);
      setLoading(false);
    });
  }, [slug]);

  const gallery = project?.gallery || [];
  const hasMultiple = gallery.length > 1;

  function handlePrev() {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
  }

  function handleNext() {
    setActiveIndex((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
  }

  function handleTouchStart(e) {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  }

  function handleTouchMove(e) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipe = 40;
    if (diff > minSwipe) {
      handleNext();
    } else if (diff < -minSwipe) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  if (loading) {
    return (
      <>
        <PageHero eyebrow="Projects" title="Loading..." />
        <section className="project-detail__not-found">
          <Container><p>Loading project details...</p></Container>
        </section>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <PageHero eyebrow="Projects" title="Project Not Found" />
        <section className="project-detail__not-found">
          <Container>
            <p>The project you're looking for doesn't exist or has been removed.</p>
            <Button to="/projects" variant="outline-lime" size="md">
              View All Projects
            </Button>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={project.category || 'Project'}
        title={project.name}
        backgroundImage={project.coverImage || project.cover_image}
      >
        {project.location && (
          <p className="page-hero__location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {project.location}
          </p>
        )}
      </PageHero>

      <section className="project-detail" id="project-detail">
        <Container>
          {/* Navigation Bar */}
          <div className="project-detail__nav-bar">
            <Link to="/projects" className="project-detail__back-btn" aria-label="Back to Projects">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back</span>
            </Link>

            <nav className="project-detail__breadcrumb" aria-label="Breadcrumb">
              <Link to="/projects" className="project-detail__breadcrumb-link">Projects</Link>
              <span className="project-detail__breadcrumb-sep" aria-hidden="true">/</span>
              <span className="project-detail__breadcrumb-current">{project.name}</span>
            </nav>
          </div>

          {/* ── Showcase Gallery (Lamborghini-style center-stage carousel) ── */}
          {gallery.length > 0 && (
            <div className="project-detail__showcase">
              <div className="project-detail__showcase-header">
                <h2 className="project-detail__section-title">Project Gallery</h2>
                {hasMultiple && (
                  <div className="project-detail__showcase-nav">
                    <button
                      type="button"
                      className="project-detail__showcase-arrow"
                      onClick={handlePrev}
                      aria-label="Previous image"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <span className="project-detail__showcase-counter">
                      {activeIndex + 1} / {gallery.length}
                    </span>
                    <button
                      type="button"
                      className="project-detail__showcase-arrow"
                      onClick={handleNext}
                      aria-label="Next image"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Slider Viewport */}
              <div
                className="project-detail__slider"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="project-detail__slider-track"
                  style={
                    hasMultiple
                      ? {
                          transform: `translateX(calc(9% - ${activeIndex} * (82% + var(--space-md))))`,
                        }
                      : undefined
                  }
                >
                  {gallery.map((img, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <div
                        key={i}
                        className={`project-detail__slide ${isActive ? 'project-detail__slide--active' : 'project-detail__slide--preview'}`}
                        onClick={() => {
                          if (isActive) {
                            setLightboxIndex(i);
                          } else {
                            setActiveIndex(i);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={isActive ? `Open image ${i + 1} in viewer` : `View image ${i + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${project.name} — image ${i + 1}`}
                          className="project-detail__slide-image"
                          fallbackText={`${project.name} #${i + 1}`}
                          loading={i === 0 ? 'eager' : 'lazy'}
                        />
                        {isActive && (
                          <div className="project-detail__slide-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="11" cy="11" r="8" />
                              <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              <line x1="11" y1="8" x2="11" y2="14" />
                              <line x1="8" y1="11" x2="14" y2="11" />
                            </svg>
                            <span>Expand</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dots */}
              {hasMultiple && (
                <div className="project-detail__dots">
                  {gallery.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`project-detail__dot ${i === activeIndex ? 'project-detail__dot--active' : ''}`}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Overview ── */}
          {project.description && (
            <div className="project-detail__overview reveal-slide-up">
              <h2 className="project-detail__section-title">Project Overview</h2>
              <p className="project-detail__text">{project.description}</p>
            </div>
          )}

          {/* ── Equipment Tags (inline) ── */}
          {project.equipment && project.equipment.length > 0 && (
            <div className="project-detail__equipment reveal-slide-up delay-1">
              <h2 className="project-detail__section-title">Equipment Deployed</h2>
              <div className="project-detail__equipment-tags">
                {project.equipment.map((eq) => (
                  <span className="project-detail__equipment-tag" key={eq}>{eq}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA Banner ── */}
          <div className="project-detail__cta-banner reveal-slide-up delay-2">
            <div className="project-detail__cta-content">
              <h3 className="project-detail__cta-heading">Need Heavy Equipment for Your Project?</h3>
              <p className="project-detail__cta-sub">
                Vertex 7 supplies reliable machinery, certified operators, and logistical support across Bulacan and Central Luzon.
              </p>
            </div>
            <Button to="/quote" variant="primary" size="lg">
              Request a Quote
            </Button>
          </div>
        </Container>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="project-lightbox"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-label="Image viewer"
        >
          <button
            className="project-lightbox__close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close viewer"
          >
            ✕
          </button>
          <div className="project-lightbox__image-wrap" onClick={(e) => e.stopPropagation()}>
            <Image
              src={(project.gallery || [])[lightboxIndex]}
              alt={`${project.name} — image ${lightboxIndex + 1}`}
              className="project-lightbox__image"
              fit="contain"
              fallbackText={project.name}
            />
          </div>
          {(project.gallery || []).length > 1 && (
            <div className="project-lightbox__nav">
              <button
                className="project-lightbox__btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + project.gallery.length) % project.gallery.length);
                }}
                aria-label="Previous image"
              >
                ←
              </button>
              <span className="project-lightbox__counter">
                {lightboxIndex + 1} / {project.gallery.length}
              </span>
              <button
                className="project-lightbox__btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % project.gallery.length);
                }}
                aria-label="Next image"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
