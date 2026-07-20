'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { CSSProperties, ComponentType } from 'react';

interface RevealTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

// Splits text into words and reveals each with a masked upward slide when
// the element scrolls into view. Words stay in flow so wrapping is natural.
export default function RevealText({
  text,
  as = 'span',
  className,
  style,
  delay = 0,
  stagger = 0.055,
  once = true,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-12% 0px' });
  const words = text.split(' ');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (motion as unknown as Record<string, ComponentType<any>>)[as];

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            marginRight: '0.26em',
          }}
        >
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform' }}
            initial={{ y: '115%' }}
            animate={inView ? { y: 0 } : { y: '115%' }}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
