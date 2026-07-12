'use client';

import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[], threshold = 0.3) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null, // Viewport
      rootMargin: '-20% 0px -40% 0px', // Shrink vertical search box to avoid double activation
      threshold,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [sectionIds, threshold]);

  return activeSection;
}
