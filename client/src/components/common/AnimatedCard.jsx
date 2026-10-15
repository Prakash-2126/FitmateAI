import React, { useEffect, useRef } from 'react';

/**
 * AnimatedCard
 * Wraps any content with a scroll-triggered reveal animation.
 *
 * Props:
 *   delay    – ms delay before animation starts (0, 80, 160, 240…)
 *   type     – 'up' | 'left' | 'right' | 'scale'  (default: 'up')
 *   hover    – boolean, adds card-hover-lift class
 *   shine    – boolean, adds card-shine class
 *   className – extra classes
 */
export const AnimatedCard = ({
  children,
  delay = 0,
  type = 'up',
  hover = false,
  shine = false,
  className = '',
  ...props
}) => {
  const ref = useRef(null);

  const revealClass = {
    up: 'reveal',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  }[type] || 'reveal';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${revealClass} ${hover ? 'card-hover-lift' : ''} ${shine ? 'card-shine' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * StaggerContainer
 * Wraps a list of AnimatedCards and staggers their delay automatically.
 */
export const StaggerContainer = ({ children, baseDelay = 0, step = 80, className = '' }) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { delay: baseDelay + i * step })
          : child
      )}
    </div>
  );
};
