'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

type Variant = 'sear' | 'ember' | 'herb' | 'gold' | 'plate' | 'truffle' | 'wine';

interface Palette {
  base: string;
  bloomA: string;
  bloomB: string;
  glow: string;
}

const PALETTES: Record<Variant, Palette> = {
  sear: {
    base: 'linear-gradient(150deg, #180a05 0%, #431409 34%, #7a2410 60%, #b5451c 82%, #e07b3c 100%)',
    bloomA: 'rgba(224,123,60,0.55)',
    bloomB: 'rgba(120,20,10,0.6)',
    glow: 'rgba(255,180,90,0.35)',
  },
  ember: {
    base: 'linear-gradient(160deg, #0d0703 0%, #2a1207 40%, #7a3111 72%, #d9772f 100%)',
    bloomA: 'rgba(255,150,60,0.5)',
    bloomB: 'rgba(90,20,5,0.7)',
    glow: 'rgba(255,200,120,0.4)',
  },
  herb: {
    base: 'linear-gradient(150deg, #0a1109 0%, #1c3016 40%, #3a5a24 70%, #7a8a2e 100%)',
    bloomA: 'rgba(150,190,70,0.4)',
    bloomB: 'rgba(20,50,15,0.7)',
    glow: 'rgba(210,220,120,0.3)',
  },
  gold: {
    base: 'linear-gradient(150deg, #2a1a06 0%, #6b4410 38%, #b98a2e 68%, #e6c15a 100%)',
    bloomA: 'rgba(240,205,110,0.55)',
    bloomB: 'rgba(90,55,10,0.6)',
    glow: 'rgba(255,235,170,0.45)',
  },
  plate: {
    base: 'linear-gradient(150deg, #efe6d7 0%, #e3d4bd 45%, #d0b48c 78%, #b98a52 100%)',
    bloomA: 'rgba(255,250,240,0.7)',
    bloomB: 'rgba(150,100,55,0.35)',
    glow: 'rgba(255,255,250,0.6)',
  },
  truffle: {
    base: 'linear-gradient(155deg, #0b0805 0%, #241a10 42%, #4a3420 72%, #7c5a30 100%)',
    bloomA: 'rgba(200,160,90,0.35)',
    bloomB: 'rgba(20,12,6,0.75)',
    glow: 'rgba(230,200,140,0.3)',
  },
  wine: {
    base: 'linear-gradient(150deg, #12060a 0%, #3a0d18 42%, #6e1526 70%, #a8324a 100%)',
    bloomA: 'rgba(190,50,80,0.45)',
    bloomB: 'rgba(50,8,15,0.7)',
    glow: 'rgba(230,140,160,0.3)',
  },
};

const NOISE = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
     <filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/>
     <feColorMatrix type='saturate' values='0'/></filter>
     <rect width='100%' height='100%' filter='url(#f)'/></svg>`.replace(/\n\s*/g, ''),
);

interface ArtFrameProps {
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
  parallax?: number; // percent of self-height to drift
  reveal?: boolean;
  rounded?: number;
  children?: ReactNode; // overlay content (captions etc.)
  label?: string; // small corner caption
}

export default function ArtFrame({
  variant = 'ember',
  className,
  style,
  parallax = 12,
  reveal = true,
  rounded = 4,
  children,
  label,
}: ArtFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1.12, 1.06]);

  const pal = PALETTES[variant];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reveal ? { clipPath: 'inset(0 0 100% 0)' } : undefined}
      animate={reveal && inView ? { clipPath: 'inset(0 0 0% 0)' } : undefined}
      transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: rounded,
        background: '#0d0703',
        ...style,
      }}
    >
      {/* Parallax + drifting art layer, oversized to allow travel */}
      <motion.div
        style={{
          position: 'absolute',
          left: '-6%',
          right: '-6%',
          top: '-16%',
          bottom: '-16%',
          y,
          scale,
          background: pal.base,
          willChange: 'transform',
        }}
      >
        {/* Blooms */}
        <div
          className="artframe-bloomA"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 55% 45% at 32% 62%, ${pal.bloomA} 0%, transparent 68%)`,
          }}
        />
        <div
          className="artframe-bloomB"
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 50% 55% at 72% 34%, ${pal.bloomB} 0%, transparent 66%)`,
          }}
        />
        {/* Specular sheen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 60% 22%, ${pal.glow} 0%, transparent 34%)`,
            mixBlendMode: 'screen',
          }}
        />
        {/* Glistening speculars — like light catching a glazed surface */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 44% 40%, rgba(255,248,235,0.5) 0%, transparent 9%),
              radial-gradient(circle at 66% 58%, rgba(255,244,225,0.4) 0%, transparent 7%),
              radial-gradient(circle at 30% 66%, rgba(255,240,215,0.32) 0%, transparent 8%),
              radial-gradient(circle at 74% 30%, rgba(255,250,240,0.3) 0%, transparent 5%),
              radial-gradient(circle at 52% 74%, rgba(255,236,205,0.28) 0%, transparent 6%)
            `,
            mixBlendMode: 'screen',
          }}
        />
        {/* Deep shadow pockets for contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 40% 30% at 18% 82%, rgba(0,0,0,0.5) 0%, transparent 60%),
              radial-gradient(ellipse 35% 40% at 88% 76%, rgba(0,0,0,0.42) 0%, transparent 62%)
            `,
            mixBlendMode: 'multiply',
          }}
        />
        {/* Organic texture — coarse */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,${NOISE}")`,
            backgroundSize: '300px 300px',
            opacity: 0.42,
            mixBlendMode: 'soft-light',
          }}
        />
        {/* Organic texture — fine, adds a grainy 'photographed' feel */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,${NOISE}")`,
            backgroundSize: '110px 110px',
            opacity: 0.2,
            mixBlendMode: 'overlay',
          }}
        />
      </motion.div>

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 95% 88% at 50% 44%, transparent 48%, rgba(0,0,0,0.38) 100%)',
          pointerEvents: 'none',
        }}
      />

      {label && (
        <span
          className="eyebrow"
          style={{
            position: 'absolute',
            bottom: '1.4rem',
            left: '1.4rem',
            color: 'rgba(247,241,232,0.82)',
            zIndex: 3,
            mixBlendMode: 'plus-lighter',
          }}
        >
          {label}
        </span>
      )}

      {children}
    </motion.div>
  );
}
