'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import ArtFrame from '@/components/ui/ArtFrame';

type Variant = 'sear' | 'ember' | 'herb' | 'gold' | 'plate' | 'truffle' | 'wine';

interface PhotoPlateProps {
  /** Basename in /public/images (tried first, so the owner can drop in
      their own photography) e.g. "wagyu" → /images/wagyu.jpg */
  name: string;
  /** Remote photo tried second (Unsplash etc). */
  src?: string;
  /** Generative fallback style if no photo loads — the site never breaks. */
  variant?: Variant;
  label?: string;
  parallax?: number;
  rounded?: number;
  reveal?: boolean;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/* A photography slot with graceful degradation:
   /images/<name>.jpg → remote src → generative ArtFrame.
   Loaded photos get a warm cinematic grade so mixed sources still feel
   like one shoot. */
export default function PhotoPlate({
  name,
  src,
  variant = 'ember',
  label,
  parallax = 12,
  rounded = 6,
  reveal = true,
  style,
  className,
  children,
}: PhotoPlateProps) {
  const candidates = [`/images/${name}.jpg`, `/images/${name}.webp`, ...(src ? [src] : [])];
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const exhausted = idx >= candidates.length;

  return (
    <ArtFrame
      variant={variant}
      label={label}
      parallax={parallax}
      rounded={rounded}
      reveal={reveal}
      style={style}
      className={className}
    >
      {!exhausted && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={candidates[idx]}
          alt={label || name}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setIdx((i) => i + 1);
          }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.9s ease',
            zIndex: 1,
          }}
        />
      )}
      {/* cinematic grade over photos */}
      {!exhausted && loaded && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              background: 'linear-gradient(180deg, rgba(20,10,4,0.12) 0%, transparent 35%, rgba(15,7,3,0.55) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              background: 'radial-gradient(ellipse 90% 80% at 50% 40%, transparent 55%, rgba(10,5,2,0.5) 100%)',
              mixBlendMode: 'multiply',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      {children}
    </ArtFrame>
  );
}
