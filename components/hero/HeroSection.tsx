'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import dynamic from 'next/dynamic';
import MagneticButton from '@/components/ui/MagneticButton';

const TableScene = dynamic(() => import('@/components/canvas/TableScene'), { ssr: false });

const HEADLINE = ['Where Lagos', 'Eats Like', 'Kings'];

// Cinematic captions that swap as the camera dollies around the dish
const PHASES = [
  { at: [0.3, 0.42, 0.56], eyebrow: 'The Pour', title: 'Fire, decanted.', body: 'A cellar built for Lagos nights — natural, rare, alive.' },
  { at: [0.58, 0.7, 0.84], eyebrow: 'The Table', title: 'Set for fourteen.', body: 'One room. Three sittings. Nothing between you and the kitchen.' },
];

function useEntered() {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const done = () => setEntered(true);
    window.addEventListener('preloader:done', done);
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
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v;
  });

  // headline block: pinned for the opening shot, then drifts away
  const textY = useTransform(scrollYProgress, [0, 0.3], ['0%', '-60%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // caption opacities
  const cap0 = useTransform(scrollYProgress, [PHASES[0].at[0], PHASES[0].at[1], PHASES[0].at[2]], [0, 1, 0]);
  const cap1 = useTransform(scrollYProgress, [PHASES[1].at[0], PHASES[1].at[1], PHASES[1].at[2]], [0, 1, 0]);
  const capOpacities = [cap0, cap1];

  return (
    <section ref={sectionRef} id="hero" style={{ position: 'relative', height: '340vh', background: '#0d0703' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Cinematic 3D tablescape — camera follows scroll */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <TableScene progressRef={progressRef} />
        </div>

        {/* edge scrims for legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(10,6,3,0.66) 0%, rgba(10,6,3,0.2) 38%, transparent 60%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,6,3,0.55) 0%, transparent 24%, transparent 72%, rgba(10,6,3,0.65) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
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
            pointerEvents: 'none',
          }}
        >
          <span className="eyebrow">Est. 2019</span>
          <span className="eyebrow" style={{ textAlign: 'right' }}>6.4281° N — 3.4219° E</span>
        </div>

        {/* Opening headline — over the close-up steak shot */}
        <motion.div
          style={{
            position: 'absolute',
            left: 'clamp(1.5rem, 5vw, 5rem)',
            right: 'clamp(1.5rem, 5vw, 5rem)',
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 3,
            y: textY,
            opacity: textOpacity,
            pointerEvents: 'none',
            maxWidth: '860px',
          }}
        >
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
              fontSize: 'clamp(2.9rem, 8vw, 8.2rem)',
              fontVariationSettings: '"opsz" 144',
              marginBottom: '2rem',
              textShadow: '0 4px 60px rgba(0,0,0,0.55)',
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
              color: 'rgba(247,241,232,0.72)',
              lineHeight: 1.7,
              maxWidth: '34ch',
              marginBottom: '2.4rem',
            }}
          >
            Scroll — and take your seat at the chef&apos;s table.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.05 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', pointerEvents: 'auto' }}
          >
            <MagneticButton href="#reserve" variant="solid">Reserve a Table</MagneticButton>
            <MagneticButton href="#menu" variant="ghost">View the Menu</MagneticButton>
          </motion.div>
        </motion.div>

        {/* Phase captions — cinematic lower-third, like product scroll films */}
        {PHASES.map((ph, i) => (
          <motion.div
            key={ph.title}
            style={{
              position: 'absolute',
              left: i === 0 ? 'auto' : 'clamp(1.5rem, 6vw, 6rem)',
              right: i === 0 ? 'clamp(1.5rem, 6vw, 6rem)' : 'auto',
              bottom: 'clamp(5rem, 14vh, 9rem)',
              zIndex: 3,
              opacity: capOpacities[i],
              maxWidth: '420px',
              textAlign: i === 0 ? 'right' : 'left',
              pointerEvents: 'none',
            }}
          >
            <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: '0.9rem' }}>{ph.eyebrow}</p>
            <p
              className="display"
              style={{ color: 'var(--cream)', fontSize: 'clamp(2rem, 4.6vw, 3.8rem)', marginBottom: '0.9rem' }}
            >
              {ph.title}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '0.98rem',
                color: 'rgba(247,241,232,0.65)',
                lineHeight: 1.65,
              }}
            >
              {ph.body}
            </p>
          </motion.div>
        ))}

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
          <span className="eyebrow" style={{ color: 'rgba(247,241,232,0.55)' }}>Scroll</span>
          <div style={{ width: '1px', height: '48px', background: 'rgba(247,241,232,0.25)', position: 'relative', overflow: 'hidden' }}>
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
