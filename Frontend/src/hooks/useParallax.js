import { useEffect, useRef } from 'react';

/**
 * useParallax
 * High-performance, 60/120fps progress-based parallax hook engineered specifically
 * for iOS Safari and modern mobile/desktop browsers.
 *
 * Supports dual-layer parallax:
 * - targetRef: background image / video layer
 * - textRef: optional foreground text content layer for 3D multi-plane depth
 *
 * @param {Object} options
 * @param {number} [options.speed=0.25] - Travel multiplier for background
 * @param {number} [options.direction=1] - 1 for classic background depth, -1 for reverse
 * @param {number} [options.textSpeed=0] - Optional foreground text travel multiplier (e.g. -0.06 for counter-drift)
 * @param {boolean} [options.disabled=false] - Optional kill-switch
 * @returns {{ containerRef: React.RefObject, targetRef: React.RefObject, textRef: React.RefObject }}
 */
export default function useParallax({
  speed = 0.25,
  direction = 1,
  textSpeed = 0,
  disabled = false,
} = {}) {
  const containerRef = useRef(null);
  const targetRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (disabled) return;
    const container = containerRef.current;
    const target = targetRef.current;
    const text = textRef.current;
    if (!container || (!target && !text)) return;

    // A11y: disable motion if user prefers reduced motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let isVisible = false;
    let rafId = null;

    const update = () => {
      if (!isVisible || !container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // Progress from 0 (entering bottom of viewport) to 1 (leaving top of viewport)
      const totalScrollRange = viewportHeight + rect.height;
      if (totalScrollRange <= 0) return;

      const currentScroll = viewportHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollRange));

      // Normalized progress: -1 at entrance, 0 at viewport center, +1 at exit
      const normalized = (progress - 0.5) * 2;

      // 1. Background transform
      if (target) {
        const maxTravel = Math.min(rect.height * speed, 120);
        const offset = normalized * maxTravel * direction;
        const transformValue = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        target.style.transform = transformValue;
        target.style.webkitTransform = transformValue;
      }

      // 2. Foreground text micro-parallax (creates floating 3D multi-plane depth)
      if (text && textSpeed !== 0) {
        const maxTextTravel = Math.min(rect.height * Math.abs(textSpeed), 45);
        const textDir = textSpeed > 0 ? 1 : -1;
        const textOffset = normalized * maxTextTravel * textDir;
        const textTransformValue = `translate3d(0, ${textOffset.toFixed(2)}px, 0)`;
        text.style.transform = textTransformValue;
        text.style.webkitTransform = textTransformValue;
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          update();
          rafId = null;
        });
      }
    };

    // IntersectionObserver ensures 0 CPU/GPU overhead when section is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          update();
        }
      },
      { rootMargin: '120px 0px' }
    );

    observer.observe(container);

    // Passive listeners ensure native iOS Safari momentum scrolling is 100% fluid
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial position calculation on mount
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [speed, direction, textSpeed, disabled]);

  return { containerRef, targetRef, textRef };
}
