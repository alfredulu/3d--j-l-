'use client';

import { useEffect, useRef } from 'react';
import { scrollState } from '@/lib/scroll';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = Math.min(1, Math.max(0, scrollState.progress || 0));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <div ref={barRef} className="scroll-progress" style={{ width: '100%', transform: 'scaleX(0)' }} aria-hidden />;
}
