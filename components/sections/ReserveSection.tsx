'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

// ── Ambient rotating plate ────────────────────────────────────────────────
function AmbientPlate() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.18;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group ref={ref} scale={0.32}>
      {/* Plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.2, 0.1, 64]} />
        <meshStandardMaterial color="#f5f0ea" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[2.48, 0.1, 12, 64]} />
        <meshStandardMaterial color="#ede5d8" roughness={0.4} />
      </mesh>
      {/* Small food remnant suggestion */}
      <mesh position={[-0.2, 0.08, 0.1]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.22]} />
        <meshStandardMaterial color="#3d1a08" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 0.09, -0.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#8b4513" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ── CTA Button ─────────────────────────────────────────────────────────────
function ReserveButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#reserve"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-block',
        padding: '1rem 3rem',
        border: '1.5px solid #c4622d',
        backgroundColor: hovered ? '#c4622d' : 'transparent',
        color: hovered ? '#ffffff' : '#c4622d',
        fontFamily: 'var(--font-dm-sans), sans-serif',
        fontSize: '0.82rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase' as const,
        textDecoration: 'none',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        cursor: 'pointer',
      }}
    >
      Reserve Your Table
    </a>
  );
}

export default function ReserveSection() {
  return (
    <section
      id="reserve"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #faf6f0 0%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) 2rem',
        overflow: 'hidden',
      }}
    >
      {/* Background 3D canvas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.45,
        }}
      >
        <Canvas
          camera={{ position: [0, 1.5, 4], fov: 40 }}
          style={{ background: 'transparent' }}
        >
          <Environment preset="studio" />
          <AmbientPlate />
        </Canvas>
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '600px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#c4622d',
            marginBottom: '1.5rem',
          }}
        >
          Reservations
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            fontWeight: 700,
            color: '#1a0f0a',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            marginBottom: '1.2rem',
            fontVariationSettings: '"opsz" 144',
          }}
        >
          Reserve Your Table
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 'clamp(0.82rem, 1.3vw, 0.95rem)',
            color: 'rgba(26,15,10,0.5)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '3rem',
          }}
        >
          Victoria Island, Lagos &mdash; Tuesday to Sunday
        </p>

        <ReserveButton />

        <p
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '0.78rem',
            color: 'rgba(26,15,10,0.4)',
            marginTop: '1.8rem',
            lineHeight: 1.6,
          }}
        >
          Private dining available for groups of 8 and above.
        </p>
      </div>
    </section>
  );
}
