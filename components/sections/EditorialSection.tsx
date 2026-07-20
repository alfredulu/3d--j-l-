'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ArtFrame from '@/components/ui/ArtFrame';
import RevealText from '@/components/ui/RevealText';

const WORDS = [
  { t: 'Fire.', i: false },
  { t: 'Time.', i: true },
  { t: 'Intention.', i: false },
];

export default function EditorialSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <section
      ref={ref}
      id="craft"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--cream)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        gap: 'clamp(2rem, 6vw, 6rem)',
        padding: 'clamp(5rem, 12vh, 9rem) clamp(1.5rem, 5vw, 5rem)',
        overflow: 'hidden',
      }}
    >
      {/* Left — tall image plate */}
      <ArtFrame
        variant="ember"
        label="The Hearth — Live Coals"
        parallax={14}
        rounded={6}
        style={{ width: '100%', height: 'min(78vh, 680px)' }}
      />

      {/* Right — editorial */}
      <div>
        <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '2rem' }}>
          The Philosophy
        </p>

        <div style={{ marginBottom: '2.5rem' }}>
          {WORDS.map((word, i) => (
            <motion.div
              key={word.t}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.16, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="display"
                style={{
                  display: 'block',
                  fontSize: 'clamp(3rem, 7vw, 6rem)',
                  color: 'var(--ink)',
                  fontStyle: word.i ? 'italic' : 'normal',
                  fontVariationSettings: '"opsz" 144',
                }}
              >
                {word.t}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
          style={{ height: '2px', width: '4rem', background: 'var(--terracotta)', transformOrigin: 'left', marginBottom: '2.2rem' }}
        />

        <RevealText
          as="p"
          text="Every dish at ÒJÈLÉ begins with a single question — what does this ingredient want to become? Our kitchen is obsessive, methodical, and rooted in the bold flavours of Lagos, translated through French technique and honest fire."
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
            lineHeight: 1.85,
            color: 'rgba(20,12,7,0.72)',
            maxWidth: '42ch',
            marginBottom: '2.5rem',
          }}
          stagger={0.02}
        />

        <p className="eyebrow" style={{ color: 'var(--sienna)' }}>
          Victoria Island, Lagos
        </p>
      </div>
    </section>
  );
}
