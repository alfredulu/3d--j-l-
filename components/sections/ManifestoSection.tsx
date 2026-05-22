'use client';

import { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import gsap from 'gsap';

const STATS = [
  { number: '14', label: 'Seats only' },
  { number: '3',  label: 'Sittings per night' },
  { number: '1',  label: 'Menu. Always changing.' },
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ruleRef    = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-20% 0px' });
  const animated   = useRef(false);

  useEffect(() => {
    if (!inView || animated.current) return;
    animated.current = true;

    const words = wordRefs.current.filter(Boolean);
    gsap.fromTo(
      words,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out' }
    );
    gsap.fromTo(
      [subRef.current, ruleRef.current, statsRef.current],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'power2.out', delay: 0.55 }
    );
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#faf6f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) 2rem',
        textAlign: 'center',
      }}
    >
      {/* Main headline — words drop in */}
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
            ref={el => { wordRefs.current[i] = el; }}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              fontWeight: 700,
              color: '#1a0f0a',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              opacity: 0,
              fontVariationSettings: '"opsz" 144',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Sub-line */}
      <p
        ref={subRef}
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
          color: 'rgba(26,15,10,0.6)',
          maxWidth: '52ch',
          lineHeight: 1.75,
          marginBottom: '3rem',
          opacity: 0,
        }}
      >
        Every plate at ÒJÈLÉ is a conversation between fire, time, and intention.
      </p>

      {/* Divider */}
      <div
        ref={ruleRef}
        style={{
          width: '5rem',
          height: '2px',
          backgroundColor: '#c4622d',
          marginBottom: '4rem',
          opacity: 0,
        }}
      />

      {/* Stats */}
      <div
        ref={statsRef}
        style={{
          display: 'flex',
          gap: 'clamp(2.5rem, 6vw, 6rem)',
          flexWrap: 'wrap',
          justifyContent: 'center',
          opacity: 0,
        }}
      >
        {STATS.map(({ number, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 700,
                color: '#c4622d',
                lineHeight: 1,
                marginBottom: '0.4rem',
                letterSpacing: '-0.02em',
              }}
            >
              {number}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '0.8rem',
                color: 'rgba(26,15,10,0.55)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
