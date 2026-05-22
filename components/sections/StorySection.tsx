'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const SIDEBAR_BLOCKS = [
  {
    label: 'The Sourcing',
    text: 'Every protein is sourced with full provenance. We know the farm, the age, the feed.',
  },
  {
    label: 'The Method',
    text: 'Wood fire, live coals, and aging chambers. No shortcuts. No freezer.',
  },
  {
    label: 'The Hour',
    text: 'A single sitting at 8 PM. No rush. No tables waiting. Only the meal.',
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.7, ease: 'easeOut' as const } },
};

export default function StorySection() {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <section
      ref={ref}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f0e8dc',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(2rem, 6vw, 6rem)',
        gap: 'clamp(3rem, 8vw, 8rem)',
        flexWrap: 'wrap',
      }}
    >
      {/* Left — large decorative number + main text */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        style={{ flex: '1 1 340px', minWidth: 0 }}
      >
        <motion.div variants={fadeUp} style={{ position: 'relative', marginBottom: '1.5rem' }}>
          {/* Large decorative 01 */}
          <span
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 'clamp(8rem, 18vw, 14rem)',
              fontWeight: 700,
              color: 'rgba(196,98,45,0.1)',
              lineHeight: 0.85,
              display: 'block',
              letterSpacing: '-0.04em',
              userSelect: 'none',
            }}
          >
            01
          </span>
        </motion.div>

        <motion.h2
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: 700,
            color: '#1a0f0a',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: '1.5rem',
            marginTop: '-2rem',
          }}
        >
          The Kitchen
        </motion.h2>

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
            color: 'rgba(26,15,10,0.65)',
            lineHeight: 1.8,
            maxWidth: '44ch',
          }}
        >
          ÒJÈLÉ was built around a single conviction: that Lagos deserved a kitchen
          as serious as any in the world. Not a pastiche. Not fusion for the sake of it.
          A true expression of what Nigerian ingredients become in the hands of chefs
          who refuse to compromise on fire, time, and intention.
        </motion.p>
      </motion.div>

      {/* Right — stacked text blocks */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        style={{
          flex: '1 1 280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
        }}
      >
        {SIDEBAR_BLOCKS.map(({ label, text }) => (
          <motion.div key={label} variants={fadeUp}>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#c4622d',
                marginBottom: '0.6rem',
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 'clamp(0.88rem, 1.3vw, 1rem)',
                color: 'rgba(26,15,10,0.7)',
                lineHeight: 1.75,
                maxWidth: '36ch',
              }}
            >
              {text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
