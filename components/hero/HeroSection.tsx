'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Particle debris ────────────────────────────────────────────────────────

const PARTICLE_COUNT = 40;
// World-space spawn origin: center-right where the bowl sits
const SPAWN_X = 1.6;
const SPAWN_Y = 0.0;

const PALETTE = [
  new THREE.Color('#c4622d'), // terracotta
  new THREE.Color('#8b1a0a'), // dark red
  new THREE.Color('#c8a96e'), // pasta gold
];

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface PData {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; maxLife: number;
  radius: number;
  colorIdx: number;
}

function spawnParticle(): PData {
  const angle = rnd(0, Math.PI * 2);
  const speed = rnd(0.4, 2.2);
  const life  = rnd(0.4, 1.5);
  return {
    x: SPAWN_X + rnd(-0.15, 0.15),
    y: SPAWN_Y + rnd(-0.1, 0.1),
    z: rnd(-0.3, 0.3),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed * 0.6 + rnd(0.2, 0.8),
    vz: rnd(-0.4, 0.4),
    life,
    maxLife: life,
    radius: rnd(0.02, 0.08),
    colorIdx: Math.floor(rnd(0, 3)),
  };
}

function DebrisSystem({ active }: { active: boolean }) {
  const meshRef  = useRef<THREE.InstancedMesh>(null);
  const particles = useRef<PData[]>(
    Array.from({ length: PARTICLE_COUNT }, spawnParticle),
  );
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const fadeRef = useRef(0);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Smooth global fade in/out
    fadeRef.current = THREE.MathUtils.lerp(fadeRef.current, active ? 1 : 0, delta * 4);

    const ps = particles.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = ps[i];
      p.life -= delta;
      if (p.life <= 0) { ps[i] = spawnParticle(); continue; }

      p.vy -= 3.0 * delta; // gravity
      p.x  += p.vx * delta;
      p.y  += p.vy * delta;
      p.z  += p.vz * delta;

      const lifeRatio = p.life / p.maxLife;
      const scale = Math.sin(lifeRatio * Math.PI) * p.radius * fadeRef.current;

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(Math.max(0, scale));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, PALETTE[p.colorIdx]);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  );
}

// ── Main section ───────────────────────────────────────────────────────────

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [particlesActive, setParticlesActive] = useState(false);
  const [splineOnTop, setSplineOnTop]         = useState(false);

  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const flip = v > 0.25;
    setSplineOnTop(flip);
    setParticlesActive(v > 0.3);
  });

  const leftWidth  = useTransform(scrollYProgress, [0, 0.8], ['42%', '100%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
  const blurPx     = useTransform(scrollYProgress, [0, 0.8], [0, 6]);
  const textFilter  = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{ position: 'relative', width: '100%', height: '500vh' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          background: '#faf6f0',
          overflow: 'hidden',
        }}
      >
        {/* Right column — Spline scene, stays fixed in right 60% */}
        <div
          style={{
            position: 'absolute',
            top: 0, right: 0, bottom: 0,
            width: '60%',
            zIndex: splineOnTop ? 10 : 5,
          }}
        >
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <iframe
              src="https://my.spline.design/untitled-QANwVu40EZ0oWQSyYbSepwQf/"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'transparent',
              }}
              allow="autoplay"
              loading="lazy"
            />
          </div>
        </div>

        {/* Left text column — expands 42% → 100% on scroll */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: leftWidth,
            zIndex: splineOnTop ? 3 : 20,
            opacity: textOpacity,
            filter: textFilter,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: 'clamp(2rem, 5vw, 5rem)',
            paddingRight: '2rem',
            gap: '1.5rem',
            pointerEvents: 'none',
          }}
        >
          {/* Location label */}
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '0.72rem',
              color: '#c4622d',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Fine Dining · Victoria Island
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 'clamp(48px, 6vw, 80px)',
              fontWeight: 700,
              color: '#1a0f0a',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              margin: 0,
              fontVariationSettings: '"opsz" 144',
            }}
          >
            Where Lagos
            <br />
            Eats Like Kings
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '18px',
              color: 'rgba(26,15,10,0.55)',
              margin: 0,
              lineHeight: 1.65,
            }}
          >
            A feast for the eyes. A revelation for the palate.
          </p>

          {/* Terracotta rule */}
          <div
            style={{
              width: '60px',
              height: '2px',
              backgroundColor: '#c4622d',
              flexShrink: 0,
            }}
          />

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              pointerEvents: 'auto',
            }}
          >
            <a
              href="#reserve"
              style={{
                display: 'inline-block',
                padding: '0.85rem 1.8rem',
                backgroundColor: '#c4622d',
                color: '#ffffff',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Reserve a Table
            </a>
            <a
              href="#menu"
              style={{
                display: 'inline-block',
                padding: '0.85rem 1.8rem',
                border: '1.5px solid #c4622d',
                backgroundColor: 'transparent',
                color: '#c4622d',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              View Menu
            </a>
          </div>

          {/* Hours */}
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '0.72rem',
              color: 'rgba(26,15,10,0.38)',
              letterSpacing: '0.1em',
              margin: 0,
            }}
          >
            Tuesday to Sunday · From 7PM
          </p>
        </motion.div>

        {/* Particle debris overlay — R3F canvas, pointer-events none */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            pointerEvents: 'none',
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
          >
            <DebrisSystem active={particlesActive} />
          </Canvas>
        </div>
      </div>
    </section>
  );
}
