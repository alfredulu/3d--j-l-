// Procedural canvas textures — photoreal-ish material maps with zero
// external assets. Each returns a THREE.CanvasTexture (client-only).
import * as THREE from 'three';

function makeCanvas(size: number) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return { c, ctx: c.getContext('2d')! };
}

function rand(seedRef: { v: number }) {
  // deterministic LCG so renders are stable frame-to-frame
  seedRef.v = (seedRef.v * 1664525 + 1013904223) % 4294967296;
  return seedRef.v / 4294967296;
}

/** Dark walnut table wood with grain streaks. */
export function woodTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(1024);
  const seed = { v: 7 };
  const g = ctx.createLinearGradient(0, 0, 1024, 1024);
  g.addColorStop(0, '#2a1a10');
  g.addColorStop(0.5, '#382415');
  g.addColorStop(1, '#241408');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 1024);
  // grain streaks
  for (let i = 0; i < 160; i++) {
    const y = rand(seed) * 1024;
    const w = 0.5 + rand(seed) * 2.2;
    const alpha = 0.022 + rand(seed) * 0.055;
    const shade = rand(seed) > 0.5 ? '255,214,170' : '10,4,2';
    ctx.strokeStyle = `rgba(${shade},${alpha})`;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(-20, y);
    // wavy grain line
    for (let x = 0; x <= 1064; x += 64) {
      ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * 6 + (rand(seed) - 0.5) * 8);
    }
    ctx.stroke();
  }
  // knots
  for (let i = 0; i < 5; i++) {
    const x = rand(seed) * 1024, y = rand(seed) * 1024;
    const r = 8 + rand(seed) * 18;
    const rg = ctx.createRadialGradient(x, y, 1, x, y, r);
    rg.addColorStop(0, 'rgba(12,5,2,0.7)');
    rg.addColorStop(1, 'rgba(12,5,2,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3.5, 3.5);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function toBump(c: HTMLCanvasElement): THREE.CanvasTexture {
  const bc = document.createElement('canvas');
  bc.width = bc.height = c.width;
  const bctx = bc.getContext('2d')!;
  bctx.drawImage(c, 0, 0);
  bctx.globalCompositeOperation = 'saturation';
  bctx.fillStyle = '#888';
  bctx.fillRect(0, 0, c.width, c.width);
  return new THREE.CanvasTexture(bc);
}

/** Steak TOP crust — browned surface with diagonal char grill lines. */
export function steakTopTexture(): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const { c, ctx } = makeCanvas(512);
  const seed = { v: 21 };
  const g = ctx.createRadialGradient(256, 256, 40, 256, 256, 300);
  g.addColorStop(0, '#7a3c1a');
  g.addColorStop(0.55, '#5c2a10');
  g.addColorStop(0.85, '#41190a');
  g.addColorStop(1, '#2f1206');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) {
    const x = rand(seed) * 512, y = rand(seed) * 512;
    const r = 2 + rand(seed) * 9;
    const light = rand(seed) > 0.45;
    ctx.fillStyle = light
      ? `rgba(${160 + rand(seed) * 60},${80 + rand(seed) * 30},${28},${0.05 + rand(seed) * 0.12})`
      : `rgba(20,6,2,${0.06 + rand(seed) * 0.12})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // char grill lines (top only)
  ctx.save();
  ctx.translate(256, 256);
  ctx.rotate(-0.5);
  for (let i = -3; i <= 3; i++) {
    const y = i * 66 + (rand(seed) - 0.5) * 8;
    ctx.fillStyle = 'rgba(14,4,1,0.7)';
    ctx.fillRect(-300, y - 8, 600, 16);
    ctx.fillStyle = 'rgba(255,180,110,0.14)';
    ctx.fillRect(-300, y - 11, 600, 3);
  }
  ctx.restore();
  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = `rgba(255,${200 + rand(seed) * 40},170,${0.10 + rand(seed) * 0.2})`;
    ctx.beginPath();
    ctx.arc(rand(seed) * 512, rand(seed) * 512, 0.8 + rand(seed) * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  return { map, bump: toBump(c) };
}

/** Steak SIDE crust — mottled sear, no grill lines, subtle rosy band. */
export function steakSideTexture(): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  const { c, ctx } = makeCanvas(512);
  const seed = { v: 77 };
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, '#4a1f0c');
  g.addColorStop(0.35, '#5e2a10');
  g.addColorStop(0.55, '#6e3a1c');
  g.addColorStop(0.75, '#552510');
  g.addColorStop(1, '#39150a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  // faint rosy medium-rare band mid-side
  const band = ctx.createLinearGradient(0, 200, 0, 300);
  band.addColorStop(0, 'rgba(140,60,40,0)');
  band.addColorStop(0.5, 'rgba(158,64,48,0.35)');
  band.addColorStop(1, 'rgba(140,60,40,0)');
  ctx.fillStyle = band;
  ctx.fillRect(0, 180, 512, 140);
  // heavy mottle
  for (let i = 0; i < 1400; i++) {
    const x = rand(seed) * 512, y = rand(seed) * 512;
    const r = 1.5 + rand(seed) * 7;
    const light = rand(seed) > 0.5;
    ctx.fillStyle = light
      ? `rgba(${150 + rand(seed) * 70},${75 + rand(seed) * 35},30,${0.05 + rand(seed) * 0.1})`
      : `rgba(18,5,2,${0.05 + rand(seed) * 0.12})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // vertical fibrous streaks, very subtle
  for (let i = 0; i < 90; i++) {
    const x = rand(seed) * 512;
    ctx.strokeStyle = `rgba(30,10,4,${0.05 + rand(seed) * 0.07})`;
    ctx.lineWidth = 1 + rand(seed) * 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (rand(seed) - 0.5) * 40, 512);
    ctx.stroke();
  }
  // glisten flecks
  for (let i = 0; i < 110; i++) {
    ctx.fillStyle = `rgba(255,${190 + rand(seed) * 50},160,${0.08 + rand(seed) * 0.16})`;
    ctx.beginPath();
    ctx.arc(rand(seed) * 512, rand(seed) * 512, 0.7 + rand(seed) * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  const map = new THREE.CanvasTexture(c);
  map.wrapS = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  return { map, bump: toBump(c) };
}

/** Off-white ceramic with faint speckle — used as roughness/color detail. */
export function ceramicTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(512);
  const seed = { v: 5 };
  ctx.fillStyle = '#f2ece2';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 700; i++) {
    ctx.fillStyle = `rgba(120,100,80,${0.03 + rand(seed) * 0.05})`;
    ctx.beginPath();
    ctx.arc(rand(seed) * 512, rand(seed) * 512, 0.5 + rand(seed) * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Linen napkin weave. */
export function linenTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(256);
  ctx.fillStyle = '#ded2bd';
  ctx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 3) {
    ctx.fillStyle = x % 6 === 0 ? 'rgba(120,100,70,0.12)' : 'rgba(255,250,240,0.10)';
    ctx.fillRect(x, 0, 1, 256);
  }
  for (let y = 0; y < 256; y += 3) {
    ctx.fillStyle = y % 6 === 0 ? 'rgba(120,100,70,0.10)' : 'rgba(255,250,240,0.08)';
    ctx.fillRect(0, y, 256, 1);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
