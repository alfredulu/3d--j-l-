'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Lock scroll while the loader is up.
    document.documentElement.style.overflow = 'hidden';

    const finish = () => {
      document.documentElement.style.overflow = '';
      window.dispatchEvent(new Event('preloader:done'));
      setGone(true);
    };

    // Hard safety: never leave scroll locked, even if the timeline stalls.
    const safety = setTimeout(finish, 6000);

    if (reduced) {
      const t = setTimeout(finish, 300);
      return () => {
        clearTimeout(t);
        clearTimeout(safety);
      };
    }

    const counter = { v: 0 };
    const tl = gsap.timeline();

    tl.to(counter, {
      v: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.v);
        if (countRef.current) countRef.current.textContent = String(v).padStart(3, '0');
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      },
    });

    tl.to(wordRef.current, { y: '-110%', duration: 0.8, ease: 'power4.inOut' }, '+=0.15');
    tl.to([countRef.current?.parentElement ?? null, barRef.current?.parentElement ?? null], {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '<');
    tl.to(rootRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
      onComplete: finish,
    }, '-=0.2');

    return () => {
      tl.kill();
      clearTimeout(safety);
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="preloader">
      {/* Brand reveal */}
      <div style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
        <div
          ref={wordRef}
          className="display"
          style={{
            color: 'var(--cream)',
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            fontVariationSettings: '"opsz" 144',
          }}
        >
          ÒJÈLÉ
        </div>
      </div>

      {/* Progress line */}
      <div
        style={{
          position: 'absolute',
          bottom: '3rem',
          left: '2.5rem',
          right: '2.5rem',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <span
          className="eyebrow"
          style={{ color: 'rgba(247,241,232,0.5)' }}
        >
          Fine Dining — Victoria Island, Lagos
        </span>
        <span
          ref={countRef}
          className="display"
          style={{ color: 'var(--terracotta)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1 }}
        >
          000
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '2.5rem',
          right: '2.5rem',
          height: '1px',
          background: 'rgba(247,241,232,0.12)',
        }}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            background: 'var(--terracotta)',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  );
}
