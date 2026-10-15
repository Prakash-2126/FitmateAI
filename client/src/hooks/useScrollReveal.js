import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 * Adds the "revealed" class to all elements matching `selector`
 * inside `containerRef` when they scroll into view.
 *
 * @param {string}  selector  CSS selector for elements to watch (default: '.reveal, .reveal-left, .reveal-right, .reveal-scale')
 * @param {object}  options   IntersectionObserver options
 */
export const useScrollReveal = (
  selector = '.reveal, .reveal-left, .reveal-right, .reveal-scale',
  options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current || document;
    const elements = container.querySelectorAll(selector);

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, stop observing for performance
          observer.unobserve(entry.target);
        }
      });
    }, options);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, options]);

  return containerRef;
};

/**
 * useElementReveal
 * Returns a ref. When that single element scrolls into view,
 * it receives the "revealed" class.
 */
export const useElementReveal = (options = { threshold: 0.12 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('revealed');
        observer.unobserve(el);
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};
