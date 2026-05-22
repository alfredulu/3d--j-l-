'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const WORDS = ['Fire.', 'Time.', 'Intention.'];

export default function EditorialSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <section
      ref={ref}
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#faf6f0',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      {/* Left — image block */}
      <div
        style={{
          flex: '0 0 50%',
          minHeight: '100vh',
          background: 'linear-gradient(145deg, #6b3a1f 0%, #a0522d 20%, #c4622d 42%, #d4956a 60%, #e8c49a 78%, #f0dcc0 92%, #f5e8d0 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Abstract food-photo-like texture layers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 60% 40% at 35% 55%, rgba(180,90,20,0.5) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 40% 60% at 65% 40%, rgba(212,149,106,0.4) 0%, transparent 60%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35%',
            background: 'linear-gradient(to top, rgba(107,58,31,0.6), transparent)',
          }}
        />
        {/* Victoria Island watermark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: '2.5rem',
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(250,246,240,0.75)',
          }}
        >
          Victoria Island, Lagos
        </motion.div>
      </div>

      {/* Right — editorial text */}
      <div
        style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(3rem, 6vw, 6rem) clamp(2.5rem, 5vw, 5rem)',
        }}
      >
        {/* Large staggered headline */}
        <div style={{ marginBottom: '2.5rem' }}>
          {WORDS.map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.7, ease: [0.25, 0, 0.35, 1] }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                  fontWeight: 700,
                  color: '#1a0f0a',
                  lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                }}
              >
                {word}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Terracotta rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
          style={{
            height: '2px',
            width: '4rem',
            backgroundColor: '#c4622d',
            transformOrigin: 'left',
            marginBottom: '2rem',
          }}
        />

        {/* Body copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
            lineHeight: 1.8,
            color: 'rgba(26,15,10,0.7)',
            maxWidth: '38ch',
            marginBottom: '2.5rem',
          }}
        >
          Every dish at ÒJÈLÉ begins with a single question: what does this ingredient want to become?
          Our kitchen is obsessive, methodical, and deeply rooted in the bold flavours of Lagos —
          translated through French technique and honest fire.
        </motion.p>

        {/* Location label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#c4622d',
          }}
        >
          Victoria Island, Lagos
        </motion.p>
      </div>
    </section>
  );
}
