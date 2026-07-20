'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import ArtFrame from '@/components/ui/ArtFrame';
import MagneticButton from '@/components/ui/MagneticButton';

const EmberBackground = dynamic(() => import('@/components/canvas/EmberBackground'), { ssr: false });

const HEADLINE = ['Where Lagos', 'Eats Like', 'Kings'];

function useEntered() {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const done = () => setEntered(true);
    window.addEventListener('preloader:done', done);
    // Fallback in case the preloader was skipped (reduced motion / already gone).
    const t = setTimeout(done, 3000);
    return () => {
      window.removeEventListener('preloader:done', done);
      clearTimeout(t);
    };
  }, []);
  return entered;
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const entered = useEntered();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const frameY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section ref={sectionRef} id="hero" style={{ position: 'relative', height: '200vh', background: 'var(--ink)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Live ember shader */}
        <EmberBackground />

        {/* Legibility scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(10,6,3,0.82) 0%, rgba(10,6,3,0.45) 42%, rgba(10,6,3,0.12) 70%, transparent 100%)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,6,3,0.5) 0%, transparent 22%, transparent 70%, rgba(10,6,3,0.7) 100%)',
            zIndex: 1,
          }}
        />

        {/* Top meta row */}
        <div
          style={{
            position: 'absolute',
            top: '5.5rem',
            left: 'clamp(1.5rem, 5vw, 5rem)',
            right: 'clamp(1.5rem, 5vw, 5rem)',
            display: 'flex',
            justifyContent: 'space-between',
            zIndex: 4,
            color: 'rgba(247,241,232,0.6)',
          }}
        >
          <span className="eyebrow">Est. 2019</span>
          <span className="eyebrow" style={{ textAlign: 'right' }}>
            6.4281° N — 3.4219° E
          </span>
        </div>

        {/* Content grid */}
        <div
          className="hero-grid"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            alignItems: 'center',
            padding: '0 clamp(1.5rem, 5vw, 5rem)',
            gap: 'clamp(1rem, 4vw, 4rem)',
          }}
        >
          {/* Left — kinetic type */}
          <motion.div style={{ y: textY, opacity: textOpacity }}>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{ color: 'var(--ember)', marginBottom: '1.6rem' }}
            >
              Fine Dining · Victoria Island
            </motion.p>

            <h1
              className="display"
              style={{
                color: 'var(--cream)',
                fontSize: 'clamp(3rem, 8.5vw, 9rem)',
                fontVariationSettings: '"opsz" 144',
                marginBottom: '2rem',
              }}
            >
              {HEADLINE.map((line, i) => (
                <span key={line} className="line-mask">
                  <motion.span
                    style={{ display: 'inline-block', willChange: 'transform' }}
                    initial={{ y: '120%' }}
                    animate={entered ? { y: 0 } : { y: '120%' }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.12 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={entered ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.9 }}
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                color: 'rgba(247,241,232,0.66)',
                lineHeight: 1.7,
                maxWidth: '34ch',
                marginBottom: '2.4rem',
              }}
            >
              A feast for the eyes, a revelation for the palate — where fire, time and
              intention meet on a single plate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.05 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            >
              <MagneticButton href="#reserve" variant="solid">
                Reserve a Table
              </MagneticButton>
              <MagneticButton href="#menu" variant="ghost">
                View the Menu
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right — floating dish plate */}
          <motion.div
            className="hero-plate"
            style={{ y: frameY, display: 'flex', justifyContent: 'center' }}
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <ArtFrame
              variant="sear"
              label="Signature — Ember-fired Wagyu"
              parallax={8}
              rounded={6}
              style={{
                width: 'min(38vw, 420px)',
                height: 'min(74vh, 620px)',
                boxShadow: '0 40px 120px rgba(0,0,0,0.55)',
              }}
            />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            opacity: cueOpacity,
          }}
        >
          <span className="eyebrow" style={{ color: 'rgba(247,241,232,0.55)' }}>
            Scroll
          </span>
          <div
            style={{
              width: '1px',
              height: '48px',
              background: 'rgba(247,241,232,0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40%', background: 'var(--ember)' }}
              animate={{ y: ['-100%', '250%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
