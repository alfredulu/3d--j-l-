'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function mapRange(v: number, i0: number, i1: number, o0: number, o1: number) {
  const t = Math.max(0, Math.min(1, (v - i0) / (i1 - i0)));
  return o0 + t * (o1 - o0);
}

// ── Individual ingredients ────────────────────────────────────────────────

function LemonWedge() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.14, 6, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#f5d430" roughness={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.16, 6]} />
        <meshStandardMaterial color="#e8b820" roughness={0.6} />
      </mesh>
    </group>
  );
}

function HerbSprig() {
  return (
    <group>
      {[0, 0.12, 0.24, 0.36].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.015, 0.015, 0.14, 4]} />
            <meshStandardMaterial color="#3a7d44" roughness={0.8} />
          </mesh>
          {[-0.055, 0.055].map((x, j) => (
            <mesh key={j} position={[x, 0, 0]} rotation={[0, 0, x > 0 ? 0.5 : -0.5]} scale={[1, 0.4, 0.2]}>
              <sphereGeometry args={[0.06, 8, 6]} />
              <meshStandardMaterial color="#4a9e58" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function PeppercornCluster() {
  const positions: [number, number, number][] = [
    [0, 0, 0], [0.07, 0.04, 0.03], [-0.06, 0.05, -0.02],
    [0.03, 0.09, 0.05], [-0.04, 0.08, 0.06], [0.06, 0.12, -0.03],
  ];
  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#1a0f0a" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Chili() {
  return (
    <group rotation={[0.3, 0, 0.4]}>
      <mesh>
        <coneGeometry args={[0.06, 0.55, 8]} />
        <meshStandardMaterial color="#8b0000" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.1, 8]} />
        <meshStandardMaterial color="#3d1a08" roughness={0.6} />
      </mesh>
    </group>
  );
}

function GarlicClove() {
  return (
    <group>
      <mesh scale={[0.9, 1.2, 0.8]}>
        <sphereGeometry args={[0.18, 12, 10]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.04, 0.1, 6]} />
        <meshStandardMaterial color="#d4c8a0" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ── Entry configs ─────────────────────────────────────────────────────────
const INGREDIENTS = [
  { component: LemonWedge,        entryX:  8, entryY: -2, orbitR: 1.6, orbitOffset: 0,              inStart: 0.05, inEnd: 0.25 },
  { component: HerbSprig,         entryX: -8, entryY:  2, orbitR: 1.3, orbitOffset: Math.PI * 0.4,  inStart: 0.15, inEnd: 0.35 },
  { component: PeppercornCluster, entryX:  6, entryY:  3, orbitR: 1.8, orbitOffset: Math.PI * 0.8,  inStart: 0.25, inEnd: 0.45 },
  { component: Chili,             entryX: -6, entryY: -3, orbitR: 1.5, orbitOffset: Math.PI * 1.2,  inStart: 0.35, inEnd: 0.55 },
  { component: GarlicClove,       entryX:  3, entryY: -5, orbitR: 1.2, orbitOffset: Math.PI * 1.6,  inStart: 0.45, inEnd: 0.65 },
];

interface IngredientMeshProps {
  component: React.ComponentType;
  entryX: number;
  entryY: number;
  orbitR: number;
  orbitOffset: number;
  inStart: number;
  inEnd: number;
  scrollYRef: React.MutableRefObject<number>;
  sectionRef: React.RefObject<HTMLElement>;
}

function IngredientMesh({
  component: Component,
  entryX, entryY, orbitR, orbitOffset, inStart, inEnd,
  scrollYRef, sectionRef,
}: IngredientMeshProps) {
  const ref = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const el = sectionRef.current;
    if (!el) return;
    const p = Math.max(0, Math.min(1, (scrollYRef.current - el.offsetTop) / el.offsetHeight));
    timeRef.current += delta;

    const arrived = mapRange(p, inStart, inEnd, 0, 1);
    const x = entryX * (1 - arrived) + Math.cos(timeRef.current * 0.3 + orbitOffset) * orbitR * arrived;
    const y = entryY * (1 - arrived) + Math.sin(timeRef.current * 0.2 + orbitOffset) * 0.4 * arrived;
    const z = Math.sin(timeRef.current * 0.25 + orbitOffset) * 0.3 * arrived;

    ref.current.position.set(x, y, z);
    ref.current.rotation.y = timeRef.current * 0.4 * arrived;
    ref.current.rotation.x = timeRef.current * 0.2 * arrived;
  });

  return (
    <group ref={ref} position={[entryX, entryY, 0]}>
      <Component />
    </group>
  );
}

interface IngredientsSceneProps {
  scrollYRef: React.MutableRefObject<number>;
  sectionRef: React.RefObject<HTMLElement>;
}

function IngredientsScene({ scrollYRef, sectionRef }: IngredientsSceneProps) {
  return (
    <>
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[4, 6, 3]} intensity={1.4} color="#fff4ec" />
      <directionalLight position={[-3, -2, 4]} intensity={0.5} color="#e8f4ff" />

      <group>
        {INGREDIENTS.map((ing, i) => (
          <IngredientMesh
            key={i}
            {...ing}
            scrollYRef={scrollYRef}
            sectionRef={sectionRef}
          />
        ))}
      </group>
    </>
  );
}

export default function IngredientsSection() {
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
      id="about"
      style={{
        position: 'relative',
        width: '100%',
        height: '400vh',
        backgroundColor: '#ffffff',
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
        {/* Watermark text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              fontWeight: 700,
              color: 'rgba(26,15,10,0.045)',
              textAlign: 'center',
              lineHeight: 1.2,
              userSelect: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            Every ingredient.<br />Chosen deliberately.
          </p>
        </div>

        {/* 3D canvas */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent', position: 'absolute', inset: 0, zIndex: 0 }}
        >
          <IngredientsScene scrollYRef={scrollYRef} sectionRef={sectionRef} />
        </Canvas>
      </div>
    </section>
  );
}
