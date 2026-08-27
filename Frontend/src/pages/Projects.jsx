import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import PageHero from '../components/ui/PageHero';
import Container from '../components/ui/Container';
import Image from '../components/ui/Image';
import { fetchProjects, getProjects } from '../data/projects';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState(getProjects());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Projects"
        subtitle="A portfolio of construction projects supported by Vertex 7 equipment and services."
      />

      <section className="projects-page" id="projects-gallery">
        <Container>
          {loading ? (
            <p className="projects-page__empty">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="projects-page__empty">No projects available yet.</p>
          ) : (
            <div className="projects-page__grid">
              {projects.map((project) => (
                <Link
                  to={`/projects/${project.slug}`}
                  className="projects-page__card"
                  key={project.id}
                >
                  <Image
                    src={project.coverImage || project.cover_image}
                    alt={project.name}
                    className="projects-page__card-image"
                    fallbackText={project.name}
                    loading="lazy"
                  />
                  <div className="projects-page__card-overlay">
                    <span className="projects-page__card-category">{project.category}</span>
                    <h2 className="projects-page__card-title">{project.name}</h2>
                    <span className="projects-page__card-location">{project.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
