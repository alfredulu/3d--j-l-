'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState, pointerState } from '@/lib/scroll';

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uScroll;
  uniform vec2  uRes;
  varying vec2 vUv;

  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 34.23); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0,0.0));
    float c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i = 0; i < 6; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = uv * vec2(3.2, 2.4);
    float t = uTime * 0.05 + uScroll * 0.00035;

    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(p + 3.4 * q + vec2(1.7, 9.2) + t * 0.5),
      fbm(p + 3.4 * q + vec2(8.3, 2.8) - t * 0.5)
    );
    float f = fbm(p + 2.6 * r + uMouse * 0.35);

    vec3 c1 = vec3(0.045, 0.022, 0.012);
    vec3 c2 = vec3(0.52, 0.15, 0.05);
    vec3 c3 = vec3(0.85, 0.40, 0.14);
    vec3 c4 = vec3(0.96, 0.76, 0.36);

    vec3 col = mix(c1, c2, smoothstep(0.05, 0.62, f));
    col = mix(col, c3, smoothstep(0.42, 0.92, f));
    col = mix(col, c4, smoothstep(0.78, 1.08, f) * 0.85);

    // heat glow lifting from the base
    float rise = smoothstep(0.0, 0.55, f * f + (1.0 - uv.y) * 0.28);
    col += c4 * 0.14 * pow(1.0 - uv.y, 2.0) * rise;

    // vignette
    float d = distance(uv, vec2(0.5, 0.44));
    col *= smoothstep(0.98, 0.22, d);

    // fine grain
    col += (hash(uv * uRes + t) - 0.5) * 0.025;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function EmberPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useFrame((_, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value += Math.min(delta, 0.05);
    m.uniforms.uScroll.value = scrollState.y;
    mouse.current.x += (pointerState.x - mouse.current.x) * 0.04;
    mouse.current.y += (pointerState.y - mouse.current.y) * 0.04;
    m.uniforms.uMouse.value.copy(mouse.current);
    m.uniforms.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
    </mesh>
  );
}

export default function EmberBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        // Fallback gradient shows if WebGL is unavailable.
        background: 'linear-gradient(160deg, #0d0703 0%, #2a1207 45%, #7a3111 78%, #d9772f 100%)',
      }}
    >
      <Canvas
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <EmberPlane />
      </Canvas>
    </div>
  );
}
