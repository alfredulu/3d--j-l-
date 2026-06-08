'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

function mapRange(v: number, i0: number, i1: number, o0: number, o1: number) {
  const t = Math.max(0, Math.min(1, (v - i0) / (i1 - i0)));
  return o0 + t * (o1 - o0);
}

const DISHES = [
  { name: 'Wagyu Tenderloin', desc: 'A5 grade, dry-aged 45 days, bone marrow jus.' },
  { name: 'Lagos Black Truffle Pasta', desc: 'Fresh tagliatelle, 24-hour stock reduction, shaved Périgord truffle.' },
  { name: 'Aged Foie Gras', desc: 'Pan-seared, fig reduction, brioche crumble, smoked salt.' },
];

interface DishSceneInnerProps {
  onDishChange: (i: number) => void;
  scrollYRef: React.MutableRefObject<number>;
  sectionRef: React.RefObject<HTMLElement>;
}

function DishSceneInner({ onDishChange, scrollYRef, sectionRef }: DishSceneInnerProps) {
  const forkRef  = useRef<THREE.Group>(null);
  const knifeRef = useRef<THREE.Group>(null);
  const lastDish = useRef(-1);

  useFrame(() => {
    const el = sectionRef.current;
    if (!el) return;
    const p = Math.max(0, Math.min(1, (scrollYRef.current - el.offsetTop) / el.offsetHeight));

    // fork from left
    if (forkRef.current) {
      forkRef.current.position.x = mapRange(p, 0.05, 0.3, -6, -0.9);
      forkRef.current.rotation.z = mapRange(p, 0.05, 0.3, 0.2, 0);
    }

    // knife from right
    if (knifeRef.current) {
      knifeRef.current.position.x = mapRange(p, 0.05, 0.3, 6, 0.9);
      knifeRef.current.rotation.z = mapRange(p, 0.05, 0.3, -0.2, 0);
    }

    // dish index: 3 dishes evenly from 0.3 to 0.95
    const dishProgress = mapRange(p, 0.3, 0.95, 0, 3);
    const dishIndex = Math.min(2, Math.floor(dishProgress));

    if (dishIndex !== lastDish.current) {
      lastDish.current = dishIndex;
      onDishChange(dishIndex);
    }

    // rotate utensils inward slightly per dish
    const inward = (dishProgress % 1) * 0.08;
    if (forkRef.current)  forkRef.current.rotation.z  = -inward;
    if (knifeRef.current) knifeRef.current.rotation.z = inward;
  });

  return (
    <>
      <ambientLight intensity={1.4} color="#fff4ec" />
      <directionalLight position={[2, 4, 3]} intensity={1.6} color="#ffe0b0" />

      {/* Fork */}
      <group ref={forkRef} position={[-6, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 1.2, 8]} />
          <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.03, 0.05, 0.25, 8]} />
          <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} />
        </mesh>
        {[-0.07, -0.023, 0.023, 0.07].map((x, i) => (
          <mesh key={i} position={[x, 0.3, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.5, 6]} />
            <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Knife */}
      <group ref={knifeRef} position={[6, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 1.2, 8]} />
          <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.025, 0.7, 0.004]} />
          <meshStandardMaterial color="#d4956a" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>
    </>
  );
}

export default function DishSection() {
  const [activeDish, setActiveDish] = useState(0);
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
      id="menu"
      style={{
        position: 'relative',
        width: '100%',
        height: '400vh',
        backgroundColor: '#f0e8dc',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* label */}
        <p
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c4622d',
            marginBottom: '1.5rem',
          }}
        >
          The Dish
        </p>

        {/* Dish name + description */}
        <div
          style={{
            position: 'relative',
            height: 'clamp(5rem, 10vh, 8rem)',
            overflow: 'hidden',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDish}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 0, 0.35, 1] }}
              style={{ textAlign: 'center', position: 'absolute' }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  fontWeight: 600,
                  color: '#1a0f0a',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {DISHES[activeDish].name}
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: '0.85rem',
                  color: '#c4622d',
                  marginTop: '0.6rem',
                  letterSpacing: '0.02em',
                }}
              >
                {DISHES[activeDish].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3D canvas */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ background: 'transparent' }}
          >
            <DishSceneInner
              onDishChange={setActiveDish}
              scrollYRef={scrollYRef}
              sectionRef={sectionRef}
            />
          </Canvas>
        </div>

        {/* dots indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 10,
          }}
        >
          {DISHES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeDish ? '1.5rem' : '0.4rem',
                height: '0.4rem',
                borderRadius: '999px',
                backgroundColor: i === activeDish ? '#c4622d' : 'rgba(196,98,45,0.3)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
