'use client';

import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import HeroScene from './HeroScene';

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '500vh',
      }}
    >
      {/* Full-viewport sticky canvas */}
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

        {/* R3F Canvas */}
        <Canvas
          camera={{ position: [0, 1.2, 4.5], fov: 45 }}
          style={{ background: '#faf6f0' }}
          shadows
        >
          <ScrollControls pages={5} damping={0.1}>
            <HeroScene />
          </ScrollControls>
        </Canvas>
      </div>
    </section>
  );
}
