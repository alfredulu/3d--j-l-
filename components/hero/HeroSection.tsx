'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import HeroScene from './HeroScene';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => { scrollYRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '500vh',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* HTML text overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: '18vh',
            pointerEvents: 'none',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              fontWeight: 700,
              color: '#1a0f0a',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              margin: 0,
              fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0',
            }}
          >
            ÒJÈLÉ
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
              color: '#8b4513',
              marginTop: '1rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 400,
            }}
          >
            Where Lagos Eats Like Kings
          </p>
        </div>

        <Canvas
          camera={{ position: [0, 1.2, 5], fov: 45 }}
          style={{ background: '#faf6f0' }}
          shadows
        >
          <Environment preset="studio" />
          <ContactShadows
            position={[0, -0.15, 0]}
            opacity={0.55}
            scale={12}
            blur={2.5}
            far={5}
          />
          <Suspense fallback={null}>
            <HeroScene scrollYRef={scrollYRef} sectionRef={sectionRef} />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}
