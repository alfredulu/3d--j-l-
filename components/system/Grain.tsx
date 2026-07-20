'use client';

// Self-contained film grain using an inline SVG turbulence data-URI.
// No external assets — renders identically everywhere.
const GRAIN_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'>
     <filter id='n'>
       <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
       <feColorMatrix type='saturate' values='0'/>
     </filter>
     <rect width='100%' height='100%' filter='url(#n)'/>
   </svg>`.replace(/\n\s*/g, ''),
);

export default function Grain() {
  return (
    <div
      className="grain"
      aria-hidden
      style={{ ['--grain-url' as string]: `url("data:image/svg+xml,${GRAIN_SVG}")` }}
    />
  );
}
