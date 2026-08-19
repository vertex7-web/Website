import { Link } from 'react-router';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import projectHighway from '../../assets/project-highway.jpg';
import projectBuilding from '../../assets/project-building.jpg';
import projectBridge from '../../assets/project-bridge.jpg';
import './FeaturedProjects.css';

/* ── Placeholder project data ────────────────────────────────
   These are development-only placeholders.
   Replace with actual project data from the client.
   Do NOT present these as real projects.
   ─────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    slug: 'project-placeholder-1',
    image: projectHighway,
    name: '[Project Name — CLIENT TO PROVIDE]',
    location: '[Location]',
    category: 'Infrastructure',
  },
  {
    slug: 'project-placeholder-2',
    image: projectBuilding,
    name: '[Project Name — CLIENT TO PROVIDE]',
    location: '[Location]',
    category: 'Commercial',
  },
  {
    slug: 'project-placeholder-3',
    image: projectBridge,
    name: '[Project Name — CLIENT TO PROVIDE]',
    location: '[Location]',
    category: 'Infrastructure',
  },
];

export default function FeaturedProjects() {
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
          {PROJECTS.map((project, index) => (
            <Link
              to={`/projects/${project.slug}`}
              className={`project-card ${index === 0 ? 'project-card--featured' : ''}`}
              key={project.slug}
            >
              <img
                src={project.image}
                alt={project.name}
                className="project-card__image"
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
