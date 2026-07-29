'use client';

import { useEffect, useRef, useState } from 'react';

/** Tracks whether an element is anywhere near the viewport, so heavy
    render loops (WebGL canvases, video buffering) can be suspended
    the moment their section scrolls away. */
export function useInViewport<T extends HTMLElement>(rootMargin = '25%') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
