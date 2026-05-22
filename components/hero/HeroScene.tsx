'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

function mapRange(v: number, i0: number, i1: number, o0: number, o1: number) {
  const t = Math.max(0, Math.min(1, (v - i0) / (i1 - i0)));
  return o0 + t * (o1 - o0);
}

// ── Smoke ─────────────────────────────────────────────────────────────────
function SmokeParticle({ seed, active }: { seed: number; active: React.MutableRefObject<boolean> }) {
  const ref = useRef<THREE.Mesh>(null);
  const xOffset = useMemo(() => (Math.sin(seed * 13.7) * 0.5) * 0.4, [seed]);
  const speed   = useMemo(() => 0.3 + (Math.sin(seed * 7.3) * 0.5 + 0.5) * 0.3, [seed]);
  const phase   = useMemo(() => (Math.sin(seed * 3.1) * 0.5 + 0.5) * Math.PI * 2, [seed]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.elapsedTime * speed + phase) % 1 + 1) % 1;
    ref.current.position.y = t * 2.2;
    ref.current.position.x = xOffset + Math.sin(clock.elapsedTime * 0.8 + phase) * 0.12;
    ref.current.scale.setScalar(0.04 + t * 0.1);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      active.current ? Math.sin(t * Math.PI) * 0.3 : 0;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#faf6f0" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function Smoke({ active }: { active: React.MutableRefObject<boolean> }) {
  return (
    <group position={[-0.25, 0.2, 0]}>
      {Array.from({ length: 12 }, (_, i) => (
        <SmokeParticle key={i} seed={i * 17.3 + 1} active={active} />
      ))}
    </group>
  );
}

// ── Plate ─────────────────────────────────────────────────────────────────
function Plate() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1.4, 1.2, 0.08, 48]} />
        <meshStandardMaterial color="#f5f0ea" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[1.38, 0.065, 12, 48]} />
        <meshStandardMaterial color="#ede5d8" roughness={0.4} />
      </mesh>
    </group>
  );
}

// ── Spaghetti ─────────────────────────────────────────────────────────────
function SpaghettiStrand({ seed }: { seed: number }) {
  const geometry = useMemo(() => {
    const rng = (s: number) => Math.sin(s * 127.1 + seed * 311.7) * 0.5 + 0.5;
    const pts: THREE.Vector3[] = [];
    const turns = 2 + rng(0) * 2;
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const angle = t * turns * Math.PI * 2 + rng(1) * Math.PI;
      const r = 0.15 + rng(t + 2) * 0.5;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * r * (0.7 + rng(t + 3) * 0.3),
        0.1 + rng(t + 5) * 0.07,
        Math.sin(angle) * r * (0.6 + rng(t + 4) * 0.4),
      ));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 30, 0.012, 5, false);
  }, [seed]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#d4a96a" roughness={0.7} />
    </mesh>
  );
}

function SpaghettiNest() {
  return (
    <group>
      {Array.from({ length: 10 }, (_, i) => (
        <SpaghettiStrand key={i} seed={i * 17.3 + 5} />
      ))}
    </group>
  );
}

// ── Steak ─────────────────────────────────────────────────────────────────
function Steak() {
  return (
    <group>
      <mesh rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.65, 0.18, 0.48]} />
        <meshStandardMaterial color="#3d1a08" roughness={0.9} />
      </mesh>
      {[-0.15, 0, 0.15].map((x, i) => (
        <mesh key={i} position={[x, 0.092, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.04, 0.003, 0.46]} />
          <meshStandardMaterial color="#1a0800" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ── Sauce splatter ─────────────────────────────────────────────────────────
function SauceSplatter() {
  const positions = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const r = 0.28 + Math.sin(i * 31.7) * 0.15 + 0.15;
      return [Math.cos(angle) * r, 0, Math.sin(angle) * r] as [number, number, number];
    }), []);

  return (
    <group position={[0.45, 0.11, 0]}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03 + (i % 3) * 0.015, 6, 6]} />
          <meshStandardMaterial color="#8b1a00" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ── Fork ──────────────────────────────────────────────────────────────────
function Fork() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.038, 0.033, 0.9, 8]} />
        <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.024, 0.038, 0.2, 8]} />
        <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} />
      </mesh>
      {[-0.055, -0.018, 0.018, 0.055].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.36, 6]} />
          <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ── Spoon ─────────────────────────────────────────────────────────────────
function Spoon() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.038, 0.033, 0.9, 8]} />
        <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.024, 0.038, 0.2, 8]} />
        <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.22, 0]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.12, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#c4622d" roughness={0.2} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function HeroScene() {
  const scrollData = useScroll();

  const assemblyRef  = useRef<THREE.Group>(null);
  const plateGrpRef  = useRef<THREE.Group>(null);
  const spagGrpRef   = useRef<THREE.Group>(null);
  const steakGrpRef  = useRef<THREE.Group>(null);
  const sauceGrpRef  = useRef<THREE.Group>(null);
  const forkGrpRef   = useRef<THREE.Group>(null);
  const spoonGrpRef  = useRef<THREE.Group>(null);
  const smokeActive  = useRef(false);

  useFrame(({ camera }) => {
    const p = scrollData.offset;

    // 0 → 0.15  plate rises and scales in
    if (plateGrpRef.current) {
      plateGrpRef.current.scale.setScalar(mapRange(p, 0, 0.15, 0.3, 1));
      plateGrpRef.current.position.y = mapRange(p, 0, 0.15, -3, 0);
    }

    // camera pull-back
    camera.position.z = mapRange(p, 0, 0.15, 4.5, 5.5);
    camera.position.x = mapRange(p, 0.6, 0.8, 0, -0.8);

    // 0.15 → 0.3  spaghetti drops
    if (spagGrpRef.current) {
      spagGrpRef.current.position.y = mapRange(p, 0.15, 0.3, 6, 0);
    }
    smokeActive.current = p >= 0.28;

    // 0.3 → 0.45  steak drops
    if (steakGrpRef.current) {
      steakGrpRef.current.position.y = mapRange(p, 0.3, 0.45, 6, 0);
    }

    // sauce: visible 0.44 → 0.7, scatter on impact
    if (sauceGrpRef.current) {
      const show = p >= 0.44 && p <= 0.72;
      sauceGrpRef.current.visible = show;
      if (show) sauceGrpRef.current.scale.setScalar(mapRange(p, 0.44, 0.56, 0, 1));
    }

    // 0.45 → 0.6  fork/spoon arc in
    if (forkGrpRef.current) {
      forkGrpRef.current.position.x = mapRange(p, 0.45, 0.6, -8, -1.6);
      forkGrpRef.current.rotation.z = mapRange(p, 0.45, 0.6, -0.3, 0);
    }
    if (spoonGrpRef.current) {
      spoonGrpRef.current.position.x = mapRange(p, 0.45, 0.6, 8, 1.6);
      spoonGrpRef.current.rotation.z = mapRange(p, 0.45, 0.6, 0.3, 0);
    }

    // 0.6 → 0.8  full assembly rotates
    if (assemblyRef.current) {
      assemblyRef.current.rotation.y = mapRange(p, 0.6, 0.8, 0, Math.PI * 0.4);
    }
  });

  return (
    <>
      <ambientLight intensity={1.2} color="#fff8f0" />
      <directionalLight position={[3, 6, 4]} intensity={1.8} color="#ffe8c0" castShadow />
      <directionalLight position={[-4, 3, 2]} intensity={0.6} color="#ffd4a0" />
      <pointLight position={[0, 3, 3]} intensity={0.8} color="#ffffff" />

      <group ref={assemblyRef}>
        <group ref={plateGrpRef} position={[0, -3, 0]} scale={0.3}>
          <Plate />
          <group ref={spagGrpRef} position={[0, 6, 0]}>
            <SpaghettiNest />
            <Smoke active={smokeActive} />
          </group>
          <group ref={steakGrpRef} position={[0, 6, 0]}>
            <Steak />
            <group ref={sauceGrpRef} visible={false}>
              <SauceSplatter />
            </group>
          </group>
        </group>

        <group ref={forkGrpRef} position={[-8, 0, 0]}>
          <Fork />
        </group>
        <group ref={spoonGrpRef} position={[8, 0, 0]}>
          <Spoon />
        </group>
      </group>
    </>
  );
}
