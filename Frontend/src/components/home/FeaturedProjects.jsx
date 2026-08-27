import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Image from '../ui/Image';
import { fetchProjects, getProjects } from '../../data/projects';
import './FeaturedProjects.css';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState(getProjects().slice(0, 3));

  useEffect(() => {
    fetchProjects().then((data) => setProjects(data.slice(0, 3)));
  }, []);

  return (
    <section className="featured-projects" id="featured-projects">
      <Container>
        <SectionHeading
          eyebrow="Our Work"
          title="Featured Projects"
          subtitle="A selection of projects where Vertex 7 provided reliable equipment and professional support."
          light
          align="center"
        />

        <div className="featured-projects__grid">
          {projects.map((project, index) => (
            <Link
              to={`/projects/${project.slug}`}
              className={`project-card ${index === 0 ? 'project-card--featured' : ''}`}
              key={project.id || project.slug}
            >
              <Image
                src={project.coverImage || project.cover_image}
                alt={project.name}
                className="project-card__image"
                fallbackText={project.name}
                loading="lazy"
              />
              <div className="project-card__overlay">
                <span className="project-card__category">{project.category}</span>
                <h3 className="project-card__title">{project.name}</h3>
                <span className="project-card__location">{project.location}</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
