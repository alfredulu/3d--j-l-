'use client';

import RevealText from '@/components/ui/RevealText';

const COLS = [
  { h: 'Visit', items: ['1 Akin Adesola Street', 'Victoria Island, Lagos', 'Nigeria'] },
  { h: 'Hours', items: ['Tue — Sun', 'Seatings 7 · 8 · 9 PM', 'Closed Mondays'] },
  { h: 'Contact', items: ['reserve@ojele.ng', '+234 800 000 0000', '@ojele.lagos'] },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--cream)', padding: 'clamp(4rem, 9vh, 7rem) clamp(1.5rem, 5vw, 5rem) 2.5rem', overflow: 'hidden' }}>
      {/* Giant wordmark */}
      <div style={{ borderBottom: '1px solid rgba(247,241,232,0.12)', paddingBottom: 'clamp(2rem, 5vh, 4rem)', marginBottom: '3rem' }}>
        <RevealText
          as="div"
          text="ÒJÈLÉ"
          className="display"
          style={{
            fontSize: 'clamp(4.5rem, 24vw, 22rem)',
            color: 'var(--cream)',
            lineHeight: 0.85,
            fontVariationSettings: '"opsz" 144',
          }}
        />
      </div>

      {/* Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
          marginBottom: '4rem',
        }}
      >
        {COLS.map((col) => (
          <div key={col.h}>
            <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: '1.2rem' }}>
              {col.h}
            </p>
            {col.items.map((it) => (
              <p
                key={it}
                style={{
                  fontFamily: 'var(--font-dm-sans), sans-serif',
                  fontSize: '0.92rem',
                  color: 'rgba(247,241,232,0.65)',
                  lineHeight: 1.9,
                }}
              >
                {it}
              </p>
            ))}
          </div>
        ))}
        <div>
          <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: '1.2rem' }}>
            Back
          </p>
          <a
            href="#hero"
            data-cursor
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '0.92rem',
              color: 'rgba(247,241,232,0.85)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            To the top ↑
          </a>
        </div>
      </div>

      {/* Baseline */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderTop: '1px solid rgba(247,241,232,0.12)',
          paddingTop: '2rem',
        }}
      >
        <span className="eyebrow" style={{ color: 'rgba(247,241,232,0.4)' }}>
          © 2026 ÒJÈLÉ Fine Dining
        </span>
        <span className="eyebrow" style={{ color: 'rgba(247,241,232,0.4)' }}>
          Fire · Time · Intention
        </span>
      </div>
    </footer>
  );
}
