'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import PhotoPlate from '@/components/ui/PhotoPlate';
import RevealText from '@/components/ui/RevealText';

const SIDEBAR_BLOCKS = [
  { label: 'The Sourcing', text: 'Every protein carries full provenance. We know the farm, the age, the feed.' },
  { label: 'The Method', text: 'Wood fire, live coals, and aging chambers. No shortcuts. No freezer.' },
  { label: 'The Hour', text: 'A single sitting. No rush, no tables waiting — only the meal in front of you.' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.14 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <section
      ref={ref}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--surface)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        alignItems: 'center',
        gap: 'clamp(3rem, 7vw, 7rem)',
        padding: 'clamp(5rem, 12vh, 9rem) clamp(1.5rem, 6vw, 6rem)',
      }}
    >
      {/* Left — narrative */}
      <motion.div variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ minWidth: 0 }}>
        <motion.span
          variants={fadeUp}
          className="display"
          style={{
            fontSize: 'clamp(7rem, 16vw, 13rem)',
            color: 'rgba(196,98,45,0.14)',
            lineHeight: 0.8,
            display: 'block',
            marginBottom: '-1.5rem',
            userSelect: 'none',
          }}
        >
          01
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="display"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', color: 'var(--ink)', marginBottom: '1.6rem' }}
        >
          The Kitchen
        </motion.h2>

        <RevealText
          as="p"
          text="ÒJÈLÉ was built around a single conviction — that Lagos deserved a kitchen as serious as any in the world. Not a pastiche. Not fusion for its own sake. A true expression of what Nigerian ingredients become in the hands of chefs who refuse to compromise on fire, time, and intention."
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
            color: 'rgba(20,12,7,0.68)',
            lineHeight: 1.85,
            maxWidth: '46ch',
          }}
          stagger={0.015}
        />
      </motion.div>

      {/* Right — image + stacked blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <PhotoPlate
          name="kitchen"
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=80"
          variant="truffle"
          label="The Pass — Service, 8 PM"
          parallax={12}
          rounded={6}
          style={{ width: '100%', height: 'min(42vh, 360px)' }}
        />
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'show' : 'hidden'} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {SIDEBAR_BLOCKS.map(({ label, text }) => (
            <motion.div key={label} variants={fadeUp}>
              <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '0.6rem' }}>
                {label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: 'clamp(0.88rem, 1.3vw, 1rem)',
                  color: 'rgba(20,12,7,0.7)',
                  lineHeight: 1.7,
                  maxWidth: '40ch',
                }}
              >
                {text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
