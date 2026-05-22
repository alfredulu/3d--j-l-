'use client';

import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 80);
      setScrolled(y > 20);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: '#faf6f0',
        boxShadow: scrolled ? '0 1px 20px rgba(26,15,10,0.08)' : 'none',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        padding: '0 2.5rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-fraunces), serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1a0f0a',
          letterSpacing: '0.04em',
        }}
      >
        ÒJÈLÉ
      </span>

      <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {['Menu', 'About', 'Reserve'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              fontFamily: 'var(--font-dm-sans), sans-serif',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: '#1a0f0a',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c4622d')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#1a0f0a')}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
