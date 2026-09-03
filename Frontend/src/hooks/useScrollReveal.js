import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * useScrollReveal
 * High-performance, intersection-based scroll reveal system.
 *
 * Automatically detects and animates elements with:
 * - `.reveal-slide-up`
 * - `.reveal-slide-left`
 * - `.reveal-slide-right`
 * - `[data-reveal]`
 *
 * Robust against async data fetching:
 * Uses a lightweight MutationObserver to automatically discover and reveal newly
 * rendered items when Supabase / API data loads into the DOM.
 */
export default function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observedSet = new WeakSet();

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -20px 0px',
        threshold: 0.05,
      }
    );

    const scanAndObserve = () => {
      const targets = document.querySelectorAll(
        '.reveal-slide-up, .reveal-slide-left, .reveal-slide-right, [data-reveal]'
      );

      if (targets.length === 0) return;

      if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-revealed'));
        return;
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      targets.forEach((el) => {
        if (el.classList.contains('is-revealed') || observedSet.has(el)) return;

        const rect = el.getBoundingClientRect();
        // If element is already in the viewport or slightly below, reveal it immediately
        if (rect.top < viewportHeight * 0.95 && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observedSet.add(el);
          observer.observe(el);
        }
      });
    };

    // Initial scan on mount or route navigation
    scanAndObserve();

    // Catch asynchronous DOM updates (e.g. Supabase fetches, state updates)
    let mutationTimer = null;
    const mutationObserver = new MutationObserver(() => {
      if (mutationTimer) cancelAnimationFrame(mutationTimer);
      mutationTimer = requestAnimationFrame(scanAndObserve);
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      if (mutationTimer) cancelAnimationFrame(mutationTimer);
    };
  }, [location.pathname]);
}
