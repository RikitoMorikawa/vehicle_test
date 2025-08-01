"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";

// Intersection Observer Hook for Scroll Animations
const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isIntersecting] as const;
};

// Animated Section Component
export interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = "", id, ...props }) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-1000 ease-out scroll-mt-20 ${
        isIntersecting ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
      } ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

export type AnimatedSectionComponent = React.FC<AnimatedSectionProps>;

export default AnimatedSection;
