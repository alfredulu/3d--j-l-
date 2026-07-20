'use client';

import { useEffect, useRef, useState } from 'react';

const LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Craft', href: '#craft' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y > 120);
      // Hero is 200vh; go solid once past the first viewport.
      setSolid(y > window.innerHeight * 0.9);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fg = solid ? '#140c07' : '#f7f1e8';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: solid ? 'rgba(247,241,232,0.9)' : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(14px)' : 'none',
        borderBottom: solid ? '1px solid rgba(20,12,7,0.08)' : '1px solid transparent',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), background-color 0.5s ease, border-color 0.5s ease',
        padding: '0 clamp(1.5rem, 5vw, 5rem)',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <a
        href="#hero"
        data-cursor
        style={{
          fontFamily: 'var(--font-fraunces), serif',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: fg,
          letterSpacing: '0.06em',
          textDecoration: 'none',
          transition: 'color 0.5s ease',
        }}
      >
        ÒJÈLÉ
      </a>

      <nav style={{ display: 'flex', gap: 'clamp(1.4rem, 3vw, 2.8rem)', alignItems: 'center' }}>
        <span className="nav-links" style={{ display: 'contents' }}>
        {LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            data-cursor
            className="eyebrow"
            style={{
              color: fg,
              textDecoration: 'none',
              letterSpacing: '0.16em',
              transition: 'color 0.5s ease, opacity 0.2s ease',
              opacity: 0.85,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c4622d')}
            onMouseLeave={(e) => (e.currentTarget.style.color = fg)}
          >
            {item.label}
          </a>
        ))}
        </span>
        <a
          href="#reserve"
          data-cursor
          className="eyebrow"
          style={{
            color: solid ? '#fff' : '#140c07',
            background: solid ? '#c4622d' : '#f7f1e8',
            padding: '0.6rem 1.2rem',
            borderRadius: '999px',
            textDecoration: 'none',
            letterSpacing: '0.14em',
            transition: 'background 0.5s ease, color 0.5s ease',
          }}
        >
          Reserve
        </a>
      </nav>
    </header>
  );
}
