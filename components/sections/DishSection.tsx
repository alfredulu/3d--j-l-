'use client';

import { useRef, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArtFrame from '@/components/ui/ArtFrame';

type Variant = 'sear' | 'gold' | 'truffle' | 'herb' | 'wine';

const DISHES: { n: string; name: string; desc: string; variant: Variant }[] = [
  { n: '01', name: 'Ember Wagyu', desc: 'A5 tenderloin, dry-aged 45 days, bone-marrow jus.', variant: 'sear' },
  { n: '02', name: 'Black Truffle Tagliatelle', desc: 'Fresh pasta, 24-hour stock, shaved Périgord truffle.', variant: 'truffle' },
  { n: '03', name: 'Seared Foie Gras', desc: 'Fig reduction, brioche crumble, smoked Lagos salt.', variant: 'gold' },
  { n: '04', name: 'Coal-roast Heirloom', desc: 'Garden vegetables, herb oil, charred allium ash.', variant: 'herb' },
  { n: '05', name: 'Palm-wine Poached Pear', desc: 'Spiced caramel, brown butter, cocoa nib.', variant: 'wine' },
];

export default function DishSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setMaxX(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 400); // after fonts/layout settle
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -maxX]);
  const progressScale = useTransform(scrollYProgress, [0.05, 0.95], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="menu"
      style={{ position: 'relative', height: '460vh', background: 'var(--charcoal)', color: 'var(--cream)' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'clamp(9rem, 22vh, 13rem)',
        }}
      >
        {/* Header */}
        <div
          style={{
            position: 'absolute',
            top: 'clamp(5rem, 12vh, 8rem)',
            left: 'clamp(1.5rem, 5vw, 5rem)',
            right: 'clamp(1.5rem, 5vw, 5rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            zIndex: 5,
          }}
        >
          <div>
            <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: '0.8rem' }}>
              The Tasting Menu
            </p>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--cream)' }}>
              Five Movements
            </h2>
          </div>
        </div>

        {/* Horizontal track */}
        <motion.div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: 'clamp(1.5rem, 3vw, 3rem)',
            paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
            paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
            x,
            willChange: 'transform',
          }}
        >
          {DISHES.map((d) => (
            <div
              key={d.n}
              style={{
                flex: '0 0 auto',
                width: 'min(74vw, 460px)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ArtFrame
                variant={d.variant}
                reveal={false}
                parallax={6}
                rounded={6}
                style={{ width: '100%', height: 'min(56vh, 500px)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}
              >
                <span
                  className="display"
                  style={{
                    position: 'absolute',
                    top: '1.2rem',
                    right: '1.4rem',
                    fontSize: '2.4rem',
                    color: 'rgba(247,241,232,0.5)',
                    zIndex: 3,
                  }}
                >
                  {d.n}
                </span>
              </ArtFrame>
              <div style={{ paddingTop: '1.6rem' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
                    color: 'var(--cream)',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {d.name}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans), sans-serif',
                    fontSize: '0.92rem',
                    color: 'rgba(247,241,232,0.55)',
                    lineHeight: 1.6,
                    maxWidth: '36ch',
                  }}
                >
                  {d.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Progress line */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(3rem, 8vh, 5rem)',
            left: 'clamp(1.5rem, 5vw, 5rem)',
            right: 'clamp(1.5rem, 5vw, 5rem)',
            height: '1px',
            background: 'rgba(247,241,232,0.14)',
          }}
        >
          <motion.div
            style={{ height: '100%', background: 'var(--ember)', transformOrigin: 'left', scaleX: progressScale }}
          />
        </div>
      </div>
    </section>
  );
}
