import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Image from '../components/ui/Image';
import { fetchProjectBySlug } from '../data/projects';
import './ProjectDetails.css';

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProjectBySlug(slug).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [slug]);

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
        eyebrow={project.category}
        title={project.name}
        subtitle={project.location}
        backgroundImage={project.coverImage || project.cover_image}
      />

      <section className="project-detail" id="project-detail">
        <Container>
          {/* Navigation Bar: Back Button & Breadcrumbs */}
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

          <div className="project-detail__grid">
            {/* Main Content */}
            <div className="project-detail__main">
              <h2 className="project-detail__section-title">Project Gallery</h2>
              <div className="project-detail__gallery">
                {(project.gallery || []).map((img, i) => (
                  <button
                    key={i}
                    className="project-detail__gallery-item"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${project.name} — image ${i + 1}`}
                      className="project-detail__gallery-image"
                      fallbackText={`${project.name} #${i + 1}`}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>

              <h2 className="project-detail__section-title">Project Overview</h2>
              <p className="project-detail__text">{project.description}</p>
            </div>

            {/* Sidebar */}
            <aside className="project-detail__sidebar">
              <div className="project-detail__info-card">
                <h3 className="project-detail__info-title">Project Information</h3>
                <div className="project-detail__info-row">
                  <span className="project-detail__info-label">Category</span>
                  <span className="project-detail__info-value">{project.category}</span>
                </div>
                <div className="project-detail__info-row">
                  <span className="project-detail__info-label">Location</span>
                  <span className="project-detail__info-value">{project.location}</span>
                </div>
              </div>

              {project.scope && project.scope.length > 0 && (
                <div className="project-detail__info-card">
                  <h3 className="project-detail__info-title">Scope / Services</h3>
                  <ul className="project-detail__scope-list">
                    {project.scope.map((item, i) => (
                      <li className="project-detail__scope-item" key={i}>
                        <span className="project-detail__scope-bullet" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.equipment && project.equipment.length > 0 && (
                <div className="project-detail__info-card">
                  <h3 className="project-detail__info-title">Equipment Used</h3>
                  <div className="project-detail__equipment-tags">
                    {project.equipment.map((eq) => (
                      <span className="project-detail__equipment-tag" key={eq}>{eq}</span>
                    ))}
                  </div>
                </div>
              )}

              <Button to="/quote" variant="primary" size="lg" className="project-detail__sidebar-cta">
                Discuss Your Project
              </Button>
            </aside>
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
