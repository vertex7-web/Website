import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import Image from '../ui/Image';
import { fetchMachines, getMachines } from '../../data/machines';
import './MachinesPreview.css';

// 7 seconds: comfortable reading interval for equipment cards
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

export default function MachinesPreview() {
  const [allMachines, setAllMachines] = useState(getMachines());
  const [displayed, setDisplayed] = useState(() => getMachines().slice(0, 3));
  const [fadingSlots, setFadingSlots] = useState({});
  const [isPaused, setIsPaused] = useState(false);

  const displayedRef = useRef(displayed);
  displayedRef.current = displayed;
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    fetchMachines().then((data) => {
      setAllMachines(data);
      setDisplayed(data.slice(0, 3));
    });
  }, []);

  const rotateItems = useCallback(() => {
    if (allMachines.length <= 3) return;
    const nextBatch = getRandomSubset(allMachines, 3, displayedRef.current);

    [0, 1, 2].forEach((slotIndex) => {
      const t1 = setTimeout(() => {
        // 1. Fade out slot
        setFadingSlots((prev) => ({ ...prev, [slotIndex]: true }));

        // 2. Swap data & fade back in
        const t2 = setTimeout(() => {
          setDisplayed((prev) => {
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
  }, [allMachines]);

  useEffect(() => {
    if (isPaused || allMachines.length <= 3) return;
    const interval = setInterval(rotateItems, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, allMachines.length, rotateItems]);

  return (
    <section
      className="machines-preview"
      id="machines-preview"
      onMouseEnter={() => setIsPaused(false)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <Container>
        <SectionHeading
          eyebrow="Our Fleet"
          title="Heavy Equipment Ready to Deploy"
          subtitle="Well-maintained machinery, serviced and inspected. Ready for your next project."
        />

        <div className="machines-preview__grid">
          {displayed.map((machine, index) => {
            const isSlotFading = Boolean(fadingSlots[index]);

            return (
              <Link
                to={`/machineries/${machine.slug}`}
                className={`machine-card reveal-slide-up delay-${Math.min(index + 1, 5)} ${isSlotFading ? 'machine-card--fading' : ''}`}
                key={machine.id || machine.slug}
              >
                <div className="machine-card__image-wrap">
                  <Image
                    src={machine.image}
                    alt={`${machine.category || machine.name} — ${machine.brand} ${machine.model}`}
                    className="machine-card__image"
                    fallbackText={`${machine.brand} ${machine.model}`}
                    loading="lazy"
                  />
                  <span className="machine-card__badge">{machine.category}</span>
                </div>
                <div className="machine-card__body">
                  <span className="machine-card__brand">
                    {machine.brand} {machine.model}
                  </span>
                  <h3 className="machine-card__title">{machine.name || machine.category}</h3>
                  <p className="machine-card__description">{machine.description}</p>
                  <span className="machine-card__link">View Machinery →</span>
                </div>
              </Link>
            );
          })}
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
