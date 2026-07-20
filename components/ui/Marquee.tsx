'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { scrollState } from '@/lib/scroll';

interface MarqueeProps {
  children: ReactNode;
  speed?: number; // base px/sec
  reverse?: boolean;
  className?: string;
}

// Infinite ribbon that drifts on its own and gets pushed by scroll velocity.
export default function Marquee({ children, speed = 60, reverse = false, className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let half = track.scrollWidth / 2;
    const onResize = () => { half = track.scrollWidth / 2; };
    window.addEventListener('resize', onResize);

    let last = performance.now();
    let raf = 0;
    const dir = reverse ? 1 : -1;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const boost = reduced ? 0 : Math.min(6, Math.abs(scrollState.velocity) * 0.03);
      offset.current += dir * (speed / 1000) * (1 + boost) * dt * 1000;
      if (offset.current <= -half) offset.current += half;
      if (offset.current > 0) offset.current -= half;
      track.style.transform = `translate3d(${offset.current}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [speed, reverse]);

  return (
    <div className={className} style={{ overflow: 'hidden', width: '100%' }}>
      <div ref={trackRef} className="marquee">
        <div style={{ display: 'flex' }}>{children}</div>
        <div style={{ display: 'flex' }} aria-hidden>{children}</div>
      </div>
    </div>
  );
}
