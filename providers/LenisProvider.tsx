'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, useState, type ReactNode } from 'react';
import { scrollState, pointerState } from '@/lib/scroll';

function ScrollBridge() {
  useLenis((lenis) => {
    scrollState.y = lenis.scroll;
    scrollState.velocity = lenis.velocity;
    scrollState.progress = lenis.progress;
    scrollState.direction = lenis.direction;
  });
  return null;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  // Track a normalised pointer globally for shader / cursor parallax.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerState.nx = e.clientX / window.innerWidth;
      pointerState.ny = e.clientY / window.innerHeight;
      pointerState.x = pointerState.nx * 2 - 1;
      pointerState.y = -(pointerState.ny * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: reduced ? 1 : 0.085,
        duration: 1.2,
        smoothWheel: !reduced,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      }}
    >
      <ScrollBridge />
      {children}
    </ReactLenis>
  );
}
