'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { woodTexture, steakTopTexture, steakSideTexture, ceramicTexture, linenTexture } from '@/lib/textures';
import { pointerState } from '@/lib/scroll';

/* Cinematic scroll-driven dining tablescape — every object is real geometry
   with PBR materials lit by a procedural studio environment (no external
   assets anywhere). The camera dollies around the dish as the user scrolls,
   in the style of high-end product-scroll sites. */

// ─── Environment & atmosphere ──────────────────────────────────────────────

function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const envMap = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 0.42;
    scene.fog = new THREE.Fog('#0d0703', 7, 17);
    return () => {
      scene.environment = null;
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

// ─── Food & tableware ──────────────────────────────────────────────────────

function Steak() {
  const top = useMemo(() => steakTopTexture(), []);
  const side = useMemo(() => steakSideTexture(), []);
  const geo = useMemo(() => {
    // organic lump: displaced, squashed cylinder (keeps side/top/bottom groups)
    const g = new THREE.CylinderGeometry(0.55, 0.58, 0.24, 48, 6);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const bulge =
        Math.sin(x * 4.1) * 0.045 + Math.cos(z * 5.3 + 1.7) * 0.05 + Math.sin((x + z) * 7.7) * 0.022;
      const r = Math.sqrt(x * x + z * z) || 1;
      pos.setXYZ(i, x + (x / r) * bulge, y + Math.abs(bulge) * 0.5 * Math.sign(y), z + (z / r) * bulge);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group position={[0.02, 0.33, 0.02]} rotation={[0, 0.5, 0]} scale={[1.12, 1, 0.88]}>
      <mesh geometry={geo} castShadow receiveShadow>
        {/* material-0: side wall, material-1: top cap, material-2: bottom */}
        <meshPhysicalMaterial
          attach="material-0"
          map={side.map}
          bumpMap={side.bump}
          bumpScale={2.2}
          color="#9a6e50"
          roughness={0.55}
          clearcoat={0.35}
          clearcoatRoughness={0.5}
        />
        <meshPhysicalMaterial
          attach="material-1"
          map={top.map}
          bumpMap={top.bump}
          bumpScale={0.9}
          roughness={0.38}
          clearcoat={0.55}
          clearcoatRoughness={0.35}
        />
        <meshPhysicalMaterial attach="material-2" color="#3a1608" roughness={0.6} />
      </mesh>
      {/* butter pat melting on top */}
      <mesh position={[0.1, 0.17, -0.05]} rotation={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.16, 0.05, 0.16]} />
        <meshPhysicalMaterial color="#e6cf8f" roughness={0.35} clearcoat={0.6} />
      </mesh>
      {/* rosemary sprig */}
      <group position={[-0.16, 0.145, 0.1]} rotation={[1.35, 0.5, 0.4]} scale={0.7}>
        {[0, 0.09, 0.18, 0.27].map((y, i) => (
          <group key={i} position={[0, y, 0]}>
            <mesh>
              <cylinderGeometry args={[0.008, 0.008, 0.1, 5]} />
              <meshStandardMaterial color="#37552e" roughness={0.8} />
            </mesh>
            {[-0.035, 0.035].map((x, j) => (
              <mesh key={j} position={[x, 0.01, 0]} rotation={[0, 0, x > 0 ? 0.9 : -0.9]} scale={[1, 0.28, 0.16]}>
                <sphereGeometry args={[0.045, 8, 6]} />
                <meshStandardMaterial color="#4a7038" roughness={0.7} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      {/* flaky salt */}
      {[[-0.3, 0.16, 0.2], [0.25, 0.17, 0.25], [0.05, 0.18, -0.3], [-0.15, 0.17, -0.2]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0.4 * i, i, 0.7 * i]}>
          <boxGeometry args={[0.025, 0.008, 0.025]} />
          <meshStandardMaterial color="#fffdf5" roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function SauceSwoosh() {
  // glossy reduction smear across the plate
  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(-0.62, 0, 0.42),
      new THREE.Vector3(-0.2, 0, 0.62),
      new THREE.Vector3(0.35, 0, 0.5),
      new THREE.Vector3(0.66, 0, 0.12),
    ];
    return new THREE.CatmullRomCurve3(pts);
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.TubeGeometry(curve, 40, 0.085, 8, false);
    g.scale(1, 0.09, 1); // flatten to a smear
    return g;
  }, [curve]);
  return (
    <mesh geometry={geo} position={[0, 0.19, 0]} receiveShadow>
      <meshPhysicalMaterial color="#2d0f04" roughness={0.12} clearcoat={1} clearcoatRoughness={0.1} />
    </mesh>
  );
}

function Plate() {
  const speckle = useMemo(() => ceramicTexture(), []);
  const geo = useMemo(() => {
    const profile: THREE.Vector2[] = [];
    // lathe profile: center → well → rim lip
    profile.push(new THREE.Vector2(0.0, 0.0));
    profile.push(new THREE.Vector2(0.88, 0.008));
    profile.push(new THREE.Vector2(1.08, 0.05));
    profile.push(new THREE.Vector2(1.26, 0.115));
    profile.push(new THREE.Vector2(1.3, 0.13));
    profile.push(new THREE.Vector2(1.26, 0.09));
    profile.push(new THREE.Vector2(1.0, 0.0));
    return new THREE.LatheGeometry(profile, 64);
  }, []);
  return (
    <mesh geometry={geo} position={[0, 0.16, 0]} castShadow receiveShadow>
      <meshPhysicalMaterial
        map={speckle}
        roughness={0.26}
        clearcoat={0.7}
        clearcoatRoughness={0.3}
        envMapIntensity={1.35}
      />
    </mesh>
  );
}

function WineGlass() {
  const glassGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0.28, 0)); // base edge
    pts.push(new THREE.Vector2(0.02, 0.02));
    pts.push(new THREE.Vector2(0.025, 0.55)); // stem
    pts.push(new THREE.Vector2(0.1, 0.62));
    pts.push(new THREE.Vector2(0.3, 0.78)); // bowl bottom
    pts.push(new THREE.Vector2(0.34, 1.05));
    pts.push(new THREE.Vector2(0.27, 1.3)); // rim taper
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  const wineGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0.0, 0.8));
    pts.push(new THREE.Vector2(0.29, 0.82));
    pts.push(new THREE.Vector2(0.325, 1.0));
    pts.push(new THREE.Vector2(0.0, 1.02));
    return new THREE.LatheGeometry(pts, 40);
  }, []);
  return (
    <group position={[-1.9, 0.16, -1.15]} scale={0.82}>
      <mesh geometry={glassGeo} castShadow>
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.04}
          metalness={0}
          transmission={0.94}
          thickness={0.25}
          ior={1.45}
          transparent
          opacity={0.98}
        />
      </mesh>
      <mesh geometry={wineGeo}>
        <meshPhysicalMaterial color="#4a0a14" roughness={0.05} clearcoat={1} />
      </mesh>
    </group>
  );
}

function Cutlery() {
  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#cfc8bc', metalness: 0.95, roughness: 0.18 }),
    [],
  );
  const linen = useMemo(() => linenTexture(), []);
  return (
    <group>
      {/* napkin under fork */}
      <mesh position={[-2.1, 0.175, 0.45]} rotation={[-Math.PI / 2, 0, 0.12]} receiveShadow>
        <boxGeometry args={[0.55, 1.35, 0.03]} />
        <meshStandardMaterial map={linen} roughness={0.9} />
      </mesh>
      {/* fork */}
      <group position={[-2.08, 0.21, 0.42]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <mesh material={metal} castShadow>
          <cylinderGeometry args={[0.035, 0.028, 0.85, 10]} />
        </mesh>
        <mesh material={metal} position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.038, 0.16, 8]} />
        </mesh>
        {[-0.048, -0.016, 0.016, 0.048].map((x, i) => (
          <mesh key={i} material={metal} position={[x, 0.68, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.26, 6]} />
          </mesh>
        ))}
      </group>
      {/* knife */}
      <group position={[2.0, 0.2, 0.5]} rotation={[-Math.PI / 2, 0, -0.08]}>
        <mesh material={metal} castShadow>
          <cylinderGeometry args={[0.038, 0.03, 0.8, 10]} />
        </mesh>
        <mesh material={metal} position={[0.015, 0.62, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.11, 0.55, 0.012]} />
        </mesh>
      </group>
    </group>
  );
}

function Candle() {
  const lightRef = useRef<THREE.PointLight>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flicker = 1 + Math.sin(t * 11) * 0.12 + Math.sin(t * 23 + 1) * 0.07;
    if (lightRef.current) lightRef.current.intensity = 4.6 * flicker;
    if (flameRef.current) {
      flameRef.current.scale.set(1, 1 + Math.sin(t * 13) * 0.15, 1);
      flameRef.current.position.x = Math.sin(t * 7) * 0.01;
    }
  });
  return (
    <group position={[2.1, 0.16, -1.25]}>
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.14, 0.15, 0.6, 24]} />
        <meshPhysicalMaterial color="#efe3ce" roughness={0.5} clearcoat={0.3} transmission={0.08} />
      </mesh>
      <mesh position={[0, 0.63, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.06, 4]} />
        <meshStandardMaterial color="#1a1008" />
      </mesh>
      <mesh ref={flameRef} position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.045, 10, 12]} />
        <meshBasicMaterial color="#ffc76a" transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshBasicMaterial color="#ff9a3c" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.85, 0]} color="#ffb45e" intensity={4.6} distance={9} decay={1.8} />
    </group>
  );
}

// ─── Smoke & embers ────────────────────────────────────────────────────────

function Smoke() {
  const COUNT = 8;
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const seeds = useMemo(() => Array.from({ length: COUNT }, (_, i) => i * 13.7 + 3), []);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    seeds.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      const cycle = ((t * (0.14 + (Math.sin(s) * 0.5 + 0.5) * 0.1) + s) % 1 + 1) % 1;
      m.position.set(
        0.05 + Math.sin(t * 0.5 + s) * (0.12 + cycle * 0.3),
        0.55 + cycle * 1.9,
        Math.cos(t * 0.4 + s * 2) * (0.1 + cycle * 0.25),
      );
      m.scale.setScalar(0.05 + cycle * 0.26);
      (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(cycle * Math.PI) * 0.042;
    });
  });
  return (
    <group>
      {seeds.map((s, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#c9b8a6" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Embers() {
  const COUNT = 26;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => ({ s: i * 7.31 + 1, r: 2 + (i % 5) * 0.8 })),
    [],
  );
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    seeds.forEach(({ s, r }, i) => {
      const cycle = ((t * 0.07 + s * 0.13) % 1 + 1) % 1;
      dummy.position.set(
        Math.sin(s * 3 + t * 0.18) * r,
        0.3 + cycle * 3.4,
        Math.cos(s * 2 + t * 0.14) * r - 0.5,
      );
      dummy.scale.setScalar((Math.sin(cycle * Math.PI) * 0.02 + 0.004) * (1 + Math.sin(t * 3 + s) * 0.3));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ff9a4d" transparent opacity={0.85} depthWrite={false} />
    </instancedMesh>
  );
}

// ─── Table ─────────────────────────────────────────────────────────────────

function Table() {
  const wood = useMemo(() => woodTexture(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]} receiveShadow>
      <planeGeometry args={[24, 24]} />
      <meshPhysicalMaterial map={wood} roughness={0.62} clearcoat={0.1} clearcoatRoughness={0.6} />
    </mesh>
  );
}

// ─── Camera choreography ───────────────────────────────────────────────────

const CAM_POSITIONS = [
  new THREE.Vector3(0.5, 1.45, 2.3),  // hero close-up, high angle
  new THREE.Vector3(-3.0, 1.3, 2.3),   // side dolly past the wine glass
  new THREE.Vector3(2.6, 2.5, 2.9),    // high three-quarter of the table
  new THREE.Vector3(0.0, 3.9, 1.15),   // near top-down finale
];
const CAM_TARGETS = [
  new THREE.Vector3(0, 0.42, 0),
  new THREE.Vector3(-0.7, 0.45, -0.4),
  new THREE.Vector3(0, 0.2, -0.1),
  new THREE.Vector3(0, 0.1, -0.2),
];

function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const posCurve = useMemo(() => new THREE.CatmullRomCurve3(CAM_POSITIONS, false, 'catmullrom', 0.4), []);
  const tgtCurve = useMemo(() => new THREE.CatmullRomCurve3(CAM_TARGETS, false, 'catmullrom', 0.4), []);
  const smooth = useRef(0);
  const look = useRef(new THREE.Vector3());
  const pos = useRef(new THREE.Vector3());
  const { size } = useThree();

  useFrame(({ camera }, delta) => {
    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    smooth.current = THREE.MathUtils.damp(smooth.current, target, 4, delta);
    const p = smooth.current;
    posCurve.getPoint(p, pos.current);
    tgtCurve.getPoint(p, look.current);
    // portrait screens: pull back so the whole place-setting stays in frame
    const aspect = size.width / size.height;
    if (aspect < 0.9) pos.current.multiplyScalar(THREE.MathUtils.mapLinear(aspect, 0.35, 0.9, 1.8, 1.15));
    // subtle pointer parallax so the scene feels alive under the mouse
    pos.current.x += pointerState.x * 0.12;
    pos.current.y += pointerState.y * 0.07;
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });
  return null;
}

// ─── Scene assembly ────────────────────────────────────────────────────────

function SceneContents({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      <StudioEnvironment />
      <CameraRig progressRef={progressRef} />

      {/* warm key with soft shadows */}
      <spotLight
        position={[3.5, 5.5, 2.5]}
        angle={0.55}
        penumbra={0.9}
        intensity={170}
        color="#ffcf98"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      {/* ember rim from behind */}
      <pointLight position={[-3, 1.2, -3.5]} intensity={26} color="#e05a1e" distance={12} />
      {/* cool fill */}
      <directionalLight position={[-4, 3, 4]} intensity={0.28} color="#9db8e8" />
      <ambientLight intensity={0.11} color="#ffe9d2" />

      <Table />
      <Plate />
      <SauceSwoosh />
      <Steak />
      <WineGlass />
      <Cutlery />
      <Candle />
      <Smoke />
      <Embers />

      {/* distant warm glow backdrop */}
      <mesh position={[0, 2.4, -7.5]}>
        <planeGeometry args={[30, 12]} />
        <meshBasicMaterial color="#1a0c05" />
      </mesh>
    </>
  );
}

export default function TableScene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.6]}
      camera={{ position: [0.5, 1.45, 2.3], fov: 42 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#0d0703']} />
      <SceneContents progressRef={progressRef} />
    </Canvas>
  );
}
