'use client';

import RevealText from '@/components/ui/RevealText';
import MagneticButton from '@/components/ui/MagneticButton';
import ArtFrame from '@/components/ui/ArtFrame';

const DETAILS = [
  { k: 'Hours', v: 'Tuesday — Sunday · From 7 PM' },
  { k: 'Location', v: 'Victoria Island, Lagos' },
  { k: 'Enquiries', v: 'reserve@ojele.ng' },
];

export default function ReserveSection() {
  return (
    <section
      id="reserve"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--ink)',
        color: 'var(--cream)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(6rem, 14vh, 12rem) clamp(1.5rem, 5vw, 5rem)',
      }}
    >
      {/* Ambient art wash */}
      <ArtFrame
        variant="ember"
        reveal={false}
        parallax={16}
        rounded={0}
        style={{ position: 'absolute', inset: 0, opacity: 0.5 }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 60%, transparent 20%, rgba(10,6,3,0.85) 90%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: '1.8rem' }}>
          Reservations
        </p>

        <RevealText
          as="h2"
          text="Reserve Your Table"
          className="display"
          style={{
            color: 'var(--cream)',
            fontSize: 'clamp(2.8rem, 8vw, 7rem)',
            fontVariationSettings: '"opsz" 144',
            marginBottom: '2rem',
          }}
        />

        <p
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
            color: 'rgba(247,241,232,0.6)',
            lineHeight: 1.7,
            maxWidth: '46ch',
            margin: '0 auto 3rem',
          }}
        >
          Fourteen seats. Three sittings. One evening you will not forget. Private
          dining available for parties of eight and above.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4.5rem' }}>
          <MagneticButton href="#reserve" variant="solid" strength={0.4}>
            Book an Evening →
          </MagneticButton>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            borderTop: '1px solid rgba(247,241,232,0.14)',
            paddingTop: '2.5rem',
            maxWidth: '780px',
            margin: '0 auto',
          }}
        >
          {DETAILS.map((d) => (
            <div key={d.k}>
              <p className="eyebrow" style={{ color: 'rgba(247,241,232,0.4)', marginBottom: '0.6rem' }}>
                {d.k}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontSize: '1.05rem',
                  color: 'var(--cream)',
                }}
              >
                {d.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
