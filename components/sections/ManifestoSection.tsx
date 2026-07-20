'use client';

import { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import gsap from 'gsap';

const STATS = [
  { number: 14, suffix: '', label: 'Seats only' },
  { number: 3, suffix: '', label: 'Sittings per night' },
  { number: 1, suffix: '', label: 'Menu. Always changing.' },
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const inView = useInView(sectionRef, { once: true, margin: '-20% 0px' });
  const animated = useRef(false);

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const words = wordRefs.current.filter(Boolean);
    if (reduced) {
      gsap.set(words, { y: 0, opacity: 1 });
      gsap.set([subRef.current, ruleRef.current, statsRef.current], { opacity: 1, y: 0 });
      STATS.forEach((s, i) => {
        if (numRefs.current[i]) numRefs.current[i]!.textContent = String(s.number) + s.suffix;
      });
      return;
    }

    gsap.fromTo(words, { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
    gsap.fromTo(
      [subRef.current, ruleRef.current, statsRef.current],
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.85, stagger: 0.18, ease: 'power2.out', delay: 0.55 },
    );

    STATS.forEach((s, i) => {
      const el = numRefs.current[i];
      if (!el) return;
      const counter = { v: 0 };
      gsap.to(counter, {
        v: s.number,
        duration: 1.4,
        delay: 0.9 + i * 0.12,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = String(Math.round(counter.v)) + s.suffix;
        },
      });
    });
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem, 12vh, 9rem) 1.5rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          display: 'flex',
          gap: 'clamp(0.6rem, 2vw, 1.4rem)',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {['Crafted.', 'Not', 'Cooked.'].map((word, i) => (
          <span
            key={word}
            ref={(el) => { wordRefs.current[i] = el; }}
            className="display"
            style={{
              display: 'inline-block',
              fontSize: 'clamp(3.5rem, 10vw, 9rem)',
              color: 'var(--ink)',
              opacity: 0,
              fontStyle: i === 1 ? 'italic' : 'normal',
              fontVariationSettings: '"opsz" 144',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <p
        ref={subRef}
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
          color: 'rgba(20,12,7,0.6)',
          maxWidth: '52ch',
          lineHeight: 1.8,
          marginBottom: '3rem',
          opacity: 0,
        }}
      >
        Every plate at ÒJÈLÉ is a conversation between fire, time, and intention —
        served once, and never quite the same way twice.
      </p>

      <div
        ref={ruleRef}
        style={{ width: '5rem', height: '2px', backgroundColor: 'var(--terracotta)', marginBottom: '4rem', opacity: 0 }}
      />

      <div
        ref={statsRef}
        style={{
          display: 'flex',
          gap: 'clamp(2.5rem, 8vw, 7rem)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          opacity: 0,
        }}
      >
        {STATS.map((s, i) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div
              className="display"
              style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--terracotta)', marginBottom: '0.5rem' }}
            >
              <span ref={(el) => { numRefs.current[i] = el; }}>0</span>
            </div>
            <div className="eyebrow" style={{ color: 'rgba(20,12,7,0.5)', letterSpacing: '0.14em' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
