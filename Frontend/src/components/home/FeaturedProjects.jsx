import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Image from '../ui/Image';
import { fetchProjects, getProjects } from '../../data/projects';
import './FeaturedProjects.css';

// 7 seconds: comfortable reading interval for project cards
const ROTATION_INTERVAL = 7000;
// Stagger delay between each card transition
const CARD_STAGGER_MS = 140;
const FADE_DURATION_MS = 260;

function getRandomSubset(pool, count, currentItems = []) {
  if (pool.length <= count) return pool;
  const currentIds = new Set(currentItems.map((item) => item.id || item.slug));
  const candidates = pool.filter((item) => !currentIds.has(item.id || item.slug));

  let available = candidates.length >= count ? candidates : [...pool];
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }

  return available.slice(0, count);
}

export default function FeaturedProjects() {
  const [allProjects, setAllProjects] = useState(getProjects());
  const [projects, setProjects] = useState(() => getProjects().slice(0, 3));
  const [fadingSlots, setFadingSlots] = useState({});
  const [isPaused, setIsPaused] = useState(false);

  const projectsRef = useRef(projects);
  projectsRef.current = projects;
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    fetchProjects().then((data) => {
      setAllProjects(data);
      setProjects(data.slice(0, 3));
    });
  }, []);

  const rotateItems = useCallback(() => {
    if (allProjects.length <= 3) return;
    const nextBatch = getRandomSubset(allProjects, 3, projectsRef.current);

    [0, 1, 2].forEach((slotIndex) => {
      const t1 = setTimeout(() => {
        // 1. Fade out slot
        setFadingSlots((prev) => ({ ...prev, [slotIndex]: true }));

        // 2. Swap data & fade back in
        const t2 = setTimeout(() => {
          setProjects((prev) => {
            const copy = [...prev];
            if (nextBatch[slotIndex]) {
              copy[slotIndex] = nextBatch[slotIndex];
            }
            return copy;
          });
          setFadingSlots((prev) => ({ ...prev, [slotIndex]: false }));
        }, FADE_DURATION_MS);

        timersRef.current.push(t2);
      }, slotIndex * CARD_STAGGER_MS);

      timersRef.current.push(t1);
    });
  }, [allProjects]);

  useEffect(() => {
    if (isPaused || allProjects.length <= 3) return;
    const interval = setInterval(rotateItems, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, allProjects.length, rotateItems]);

  return (
    <section
      className="featured-projects"
      id="featured-projects"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <Container>
        <SectionHeading
          eyebrow="Our Work"
          title="Featured Projects"
          subtitle="A selection of projects where Vertex 7 provided reliable equipment and professional support."
          light
          align="center"
        />

        <div className="featured-projects__grid">
          {projects.map((project, index) => {
            const isSlotFading = Boolean(fadingSlots[index]);

            return (
              <Link
                to={`/projects/${project.slug}`}
                className={`project-card reveal-slide-up delay-${Math.min(index + 1, 5)} ${index === 0 ? 'project-card--featured' : ''} ${isSlotFading ? 'project-card--fading' : ''}`}
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
            );
          })}
        </div>
      </Container>
    </section>
  );
}
