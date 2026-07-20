'use client';

import { useEffect, useRef } from 'react';

// A trailing custom cursor: an instant dot + a lerp-following ring that grows
// over interactive elements ([data-cursor], a, button). Precise pointers only.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine) return;

    document.body.classList.add('custom-cursor');
    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (reduced) ring.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    if (!reduced) raf = requestAnimationFrame(loop);

    const interactiveSel = 'a, button, [data-cursor], input, textarea, [role="button"]';
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest?.(interactiveSel)) ring.classList.add('hovering');
    };
    const onOut = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest?.(interactiveSel)) ring.classList.remove('hovering');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, true);
    document.addEventListener('pointerout', onOut, true);

    return () => {
      document.body.classList.remove('custom-cursor');
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver, true);
      document.removeEventListener('pointerout', onOut, true);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
