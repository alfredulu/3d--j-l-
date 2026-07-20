'use client';

import { useRef, type ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  strength?: number;
  className?: string;
}

// A button/link that leans toward the cursor and eases back on leave.
export default function MagneticButton({
  children,
  href = '#',
  onClick,
  variant = 'solid',
  strength = 0.35,
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
    if (inner.current) inner.current.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0,0)';
    if (inner.current) inner.current.style.transform = 'translate(0,0)';
  };

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '1rem 2.2rem',
    fontFamily: 'var(--font-dm-sans), sans-serif',
    fontSize: '0.76rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    fontWeight: 500,
    borderRadius: '999px',
    transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, color 0.3s ease',
    willChange: 'transform',
  };
  const variants: Record<string, React.CSSProperties> = {
    solid: { background: 'var(--terracotta)', color: '#fff', border: '1px solid var(--terracotta)' },
    outline: { background: 'transparent', color: 'currentColor', border: '1px solid currentColor' },
    ghost: { background: 'rgba(255,255,255,0.06)', color: 'currentColor', border: '1px solid rgba(255,255,255,0.2)' },
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor
      className={className}
      style={{ ...base, ...variants[variant] }}
    >
      <span ref={inner} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)' }}>
        {children}
      </span>
    </a>
  );
}
