'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import RevealText from '@/components/ui/RevealText';

function mapRange(v: number, i0: number, i1: number, o0: number, o1: number) {
  const t = Math.max(0, Math.min(1, (v - i0) / (i1 - i0)));
  return o0 + t * (o1 - o0);
}

// ── Individual ingredients (self-contained primitive meshes) ───────────────

function LemonWedge() {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.14, 8, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#f5d430" roughness={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.16, 8]} />
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
            <cylinderGeometry args={[0.015, 0.015, 0.14, 5]} />
            <meshStandardMaterial color="#3a7d44" roughness={0.8} />
          </mesh>
          {[-0.055, 0.055].map((x, j) => (
            <mesh key={j} position={[x, 0, 0]} rotation={[0, 0, x > 0 ? 0.5 : -0.5]} scale={[1, 0.4, 0.2]}>
              <sphereGeometry args={[0.06, 10, 8]} />
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
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#2a1a12" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Chili() {
  return (
    <group rotation={[0.3, 0, 0.4]}>
      <mesh>
        <coneGeometry args={[0.06, 0.55, 10]} />
        <meshStandardMaterial color="#b01207" roughness={0.35} />
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
        <sphereGeometry args={[0.18, 14, 12]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.04, 0.1, 8]} />
        <meshStandardMaterial color="#d4c8a0" roughness={0.6} />
      </mesh>
    </group>
  );
}

function StarAnise() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.13, Math.sin(a) * 0.13, 0]} rotation={[0, 0, a]}>
            <coneGeometry args={[0.05, 0.16, 4]} />
            <meshStandardMaterial color="#5a3210" roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

const INGREDIENTS = [
  { component: LemonWedge, entryX: 8, entryY: -2, orbitR: 1.7, orbitOffset: 0, inStart: 0.05, inEnd: 0.25 },
  { component: HerbSprig, entryX: -8, entryY: 2, orbitR: 1.35, orbitOffset: Math.PI * 0.35, inStart: 0.13, inEnd: 0.33 },
  { component: PeppercornCluster, entryX: 6, entryY: 3, orbitR: 1.9, orbitOffset: Math.PI * 0.7, inStart: 0.21, inEnd: 0.41 },
  { component: Chili, entryX: -6, entryY: -3, orbitR: 1.55, orbitOffset: Math.PI * 1.05, inStart: 0.29, inEnd: 0.49 },
  { component: GarlicClove, entryX: 3, entryY: -5, orbitR: 1.25, orbitOffset: Math.PI * 1.4, inStart: 0.37, inEnd: 0.57 },
  { component: StarAnise, entryX: -3, entryY: 5, orbitR: 2.05, orbitOffset: Math.PI * 1.75, inStart: 0.45, inEnd: 0.65 },
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
  sectionRef: React.RefObject<HTMLElement | null>;
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
    const y = entryY * (1 - arrived) + Math.sin(timeRef.current * 0.2 + orbitOffset) * 0.45 * arrived;
    const z = Math.sin(timeRef.current * 0.25 + orbitOffset) * 0.4 * arrived;

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

interface SceneProps {
  scrollYRef: React.MutableRefObject<number>;
  sectionRef: React.RefObject<HTMLElement | null>;
}

function IngredientsScene({ scrollYRef, sectionRef }: SceneProps) {
  return (
    <>
      {/* Dramatic self-contained lighting — no external HDR */}
      <ambientLight intensity={0.5} color="#ffe6cf" />
      <directionalLight position={[4, 6, 4]} intensity={2.4} color="#ffd9a0" />
      <pointLight position={[-4, -1, 3]} intensity={30} color="#e07b3c" distance={14} />
      <pointLight position={[3, 4, -2]} intensity={16} color="#8ab4ff" distance={12} />
      <group>
        {INGREDIENTS.map((ing, i) => (
          <IngredientMesh key={i} {...ing} scrollYRef={scrollYRef} sectionRef={sectionRef} />
        ))}
      </group>
    </>
  );
}

export default function IngredientsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ position: 'relative', width: '100%', height: '360vh', backgroundColor: 'var(--ink)' }}
    >
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        {/* Warm radial glow behind the 3D */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 55% 55% at 50% 55%, rgba(224,123,60,0.14) 0%, transparent 70%)',
          }}
        />

        {/* 3D canvas */}
        <Canvas
          gl={{ antialias: true }}
          dpr={[1, 1.6]}
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        >
          <IngredientsScene scrollYRef={scrollYRef} sectionRef={sectionRef} />
        </Canvas>

        {/* Foreground copy */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 2,
            padding: '0 1.5rem',
          }}
        >
          <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: '1.6rem' }}>
            Provenance
          </p>
          <RevealText
            as="h2"
            text="Every ingredient, chosen deliberately"
            className="display"
            style={{
              fontSize: 'clamp(2.2rem, 6vw, 5rem)',
              color: 'var(--cream)',
              maxWidth: '16ch',
              lineHeight: 1.02,
            }}
          />
          <p
            style={{
              marginTop: '1.8rem',
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
              color: 'rgba(247,241,232,0.55)',
              maxWidth: '44ch',
              lineHeight: 1.7,
            }}
          >
            Citrus from Ijebu. Peppercorns and star anise, hand-toasted. Chillies with
            provenance. Nothing is here by accident.
          </p>
        </div>
      </div>
    </section>
  );
}
