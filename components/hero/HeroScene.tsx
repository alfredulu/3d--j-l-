'use client';

import { useRef, useMemo, Suspense, Component } from 'react';
import type { ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Silently swallows GLB 404/network errors so the scene renders without
// a model until the file is placed in /public/models/.
class ModelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function mapRange(v: number, i0: number, i1: number, o0: number, o1: number) {
  const t = Math.max(0, Math.min(1, (v - i0) / (i1 - i0)));
  return o0 + t * (o1 - o0);
}

// ── Smoke particles ────────────────────────────────────────────────────────
function SmokeParticle({ seed, active }: { seed: number; active: React.MutableRefObject<boolean> }) {
  const ref = useRef<THREE.Mesh>(null);
  const xOffset = useMemo(() => (Math.sin(seed * 13.7) * 0.5) * 0.6, [seed]);
  const speed   = useMemo(() => 0.3 + (Math.sin(seed * 7.3) * 0.5 + 0.5) * 0.3, [seed]);
  const phase   = useMemo(() => (Math.sin(seed * 3.1) * 0.5 + 0.5) * Math.PI * 2, [seed]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.elapsedTime * speed + phase) % 1 + 1) % 1;
    ref.current.position.y = t * 3.0;
    ref.current.position.x = xOffset + Math.sin(clock.elapsedTime * 0.8 + phase) * 0.18;
    ref.current.scale.setScalar(0.06 + t * 0.18);
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      active.current ? Math.sin(t * Math.PI) * 0.35 : 0;
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
    <group position={[0, 0.4, 0]}>
      {Array.from({ length: 14 }, (_, i) => (
        <SmokeParticle key={i} seed={i * 17.3 + 1} active={active} />
      ))}
    </group>
  );
}

// ── GLB model loaders ──────────────────────────────────────────────────────
function PlateModel() {
  const { scene } = useGLTF('/models/plate.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={[2.5, 2.5, 2.5]} />;
}

function SteakModel() {
  const { scene } = useGLTF('/models/steak.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={[1.6, 1.6, 1.6]} position={[-0.3, 0.12, 0]} />;
}

function PastaModel() {
  const { scene } = useGLTF('/models/pasta.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={[1.5, 1.5, 1.5]} position={[0.2, 0.1, 0]} />;
}

function ForkModel() {
  const { scene } = useGLTF('/models/fork.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={[2.0, 2.0, 2.0]} />;
}

function SpoonModel() {
  const { scene } = useGLTF('/models/spoon.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={[2.0, 2.0, 2.0]} />;
}


// ── Main scene ─────────────────────────────────────────────────────────────
interface HeroSceneProps {
  scrollYRef: React.MutableRefObject<number>;
  sectionRef: React.RefObject<HTMLElement>;
}

export default function HeroScene({ scrollYRef, sectionRef }: HeroSceneProps) {
  const assemblyRef = useRef<THREE.Group>(null);
  const plateGrpRef = useRef<THREE.Group>(null);
  const pastaGrpRef = useRef<THREE.Group>(null);
  const steakGrpRef = useRef<THREE.Group>(null);
  const forkGrpRef  = useRef<THREE.Group>(null);
  const spoonGrpRef = useRef<THREE.Group>(null);
  const smokeActive = useRef(false);

  useFrame(({ camera }) => {
    const el = sectionRef.current;
    if (!el) return;
    const p = Math.max(0, Math.min(1, (scrollYRef.current - el.offsetTop) / el.offsetHeight));

    // 0 → 0.15: plate rises and scales in
    if (plateGrpRef.current) {
      plateGrpRef.current.scale.setScalar(mapRange(p, 0, 0.15, 0.3, 1));
      plateGrpRef.current.position.y = mapRange(p, 0, 0.15, -5, 0);
    }

    // camera stays at z=5 max, drifts left at end
    camera.position.z = 5;
    camera.position.x = mapRange(p, 0.6, 0.8, 0, -0.8);

    // 0.15 → 0.3: pasta drops in
    if (pastaGrpRef.current) {
      pastaGrpRef.current.position.y = mapRange(p, 0.15, 0.3, 8, 0);
    }
    smokeActive.current = p >= 0.28;

    // 0.3 → 0.45: steak drops in
    if (steakGrpRef.current) {
      steakGrpRef.current.position.y = mapRange(p, 0.3, 0.45, 8, 0);
    }

    // 0.45 → 0.6: fork and spoon arc in from opposite sides
    if (forkGrpRef.current) {
      forkGrpRef.current.position.x = mapRange(p, 0.45, 0.6, -10, -3.2);
      forkGrpRef.current.rotation.z = mapRange(p, 0.45, 0.6, -0.3, 0);
    }
    if (spoonGrpRef.current) {
      spoonGrpRef.current.position.x = mapRange(p, 0.45, 0.6, 10, 3.2);
      spoonGrpRef.current.rotation.z = mapRange(p, 0.45, 0.6, 0.3, 0);
    }

    // 0.6 → 0.8: full assembly rotates for reveal
    if (assemblyRef.current) {
      assemblyRef.current.rotation.y = mapRange(p, 0.6, 0.8, 0, Math.PI * 0.4);
    }
  });

  return (
    <group ref={assemblyRef}>
      <group ref={plateGrpRef} position={[0, -5, 0]} scale={0.3}>
        <ModelBoundary>
          <Suspense fallback={null}>
            <PlateModel />
          </Suspense>
        </ModelBoundary>

        <group ref={pastaGrpRef} position={[0, 8, 0]}>
          <ModelBoundary>
            <Suspense fallback={null}>
              <PastaModel />
            </Suspense>
          </ModelBoundary>
          <Smoke active={smokeActive} />
        </group>

        <group ref={steakGrpRef} position={[0, 8, 0]}>
          <ModelBoundary>
            <Suspense fallback={null}>
              <SteakModel />
            </Suspense>
          </ModelBoundary>
        </group>
      </group>

      <group ref={forkGrpRef} position={[-10, -0.5, 0]}>
        <ModelBoundary>
          <Suspense fallback={null}>
            <ForkModel />
          </Suspense>
        </ModelBoundary>
      </group>

      <group ref={spoonGrpRef} position={[10, -0.5, 0]}>
        <ModelBoundary>
          <Suspense fallback={null}>
            <SpoonModel />
          </Suspense>
        </ModelBoundary>
      </group>
    </group>
  );
}
