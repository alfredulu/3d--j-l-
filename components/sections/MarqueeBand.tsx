'use client';

import Marquee from '@/components/ui/Marquee';

const WORDS = ['Fire', 'Time', 'Intention', 'Fire', 'Time', 'Intention'];

export default function MarqueeBand() {
  return (
    <section
      style={{
        background: 'var(--cream)',
        borderTop: '1px solid rgba(20,12,7,0.08)',
        borderBottom: '1px solid rgba(20,12,7,0.08)',
        padding: '1.6rem 0',
        overflow: 'hidden',
      }}
    >
      <Marquee speed={70}>
        {WORDS.map((w, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span
              className="display"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.6rem)',
                color: 'var(--ink)',
                padding: '0 1.4rem',
                fontStyle: i % 3 === 2 ? 'italic' : 'normal',
              }}
            >
              {w}
            </span>
            <span style={{ color: 'var(--terracotta)', fontSize: 'clamp(1rem,2vw,1.6rem)' }}>✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
