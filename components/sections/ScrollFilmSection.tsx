'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

/* Apple-style scroll-scrubbed film. Drop a clip at /public/video/film.webm
   (and/or film.mp4) and this section appears automatically: scrolling down
   plays it forward, scrolling up plays it in reverse. No file → the section
   renders nothing. Encode with dense keyframes for smooth scrubbing:
     ffmpeg -i in.mp4 -an -g 1 -crf 24 -movflags +faststart film.mp4
     ffmpeg -i in.mp4 -an -g 1 -b:v 3M film.webm
   See /public/video/README.md for the full guide (free footage ideas incl.
   filming a dish with your phone). */

const SOURCES = ['/video/film.webm', '/video/film.mp4'];

export default function ScrollFilmSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [srcIdx, setSrcIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  const duration = useRef(0);
  const target = useRef(0);

  // loadedmetadata can fire before hydration attaches handlers — poll
  // readyState after mount so we never miss it.
  useEffect(() => {
    if (ready || failed) return;
    const iv = setInterval(() => {
      const v = videoRef.current;
      if (v && v.readyState >= 1 && v.duration > 0) {
        duration.current = v.duration;
        setReady(true);
      }
    }, 250);
    return () => clearInterval(iv);
  }, [ready, failed]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    target.current = v;
  });

  const captionOpacity = useTransform(scrollYProgress, [0.08, 0.2, 0.8, 0.92], [0, 1, 1, 0]);

  // Smoothly chase the scroll position with the video playhead.
  useEffect(() => {
    if (!ready) return;
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    let current = 0;
    const loop = () => {
      const want = target.current * Math.max(0, duration.current - 0.05);
      current += (want - current) * 0.12;
      if (Math.abs(v.currentTime - current) > 0.01) v.currentTime = current;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  if (failed) return null;

  return (
    <section
      ref={sectionRef}
      aria-label="Film"
      style={{
        position: 'relative',
        height: ready ? '300vh' : 'auto',
        background: '#0a0503',
      }}
    >
      <div
        style={{
          position: ready ? 'sticky' : 'relative',
          top: 0,
          height: ready ? '100vh' : 0,
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            duration.current = e.currentTarget.duration || 0;
            setReady(true);
          }}
          onError={() => {
            // try next source; give up when all fail
            if (srcIdx + 1 < SOURCES.length) setSrcIdx(srcIdx + 1);
            else setFailed(true);
          }}
          src={SOURCES[srcIdx]}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {ready && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(10,5,3,0.5) 0%, transparent 25%, transparent 70%, rgba(10,5,3,0.6) 100%)',
                pointerEvents: 'none',
              }}
            />
            <motion.div
              style={{
                position: 'absolute',
                left: 'clamp(1.5rem, 6vw, 6rem)',
                bottom: 'clamp(4rem, 12vh, 8rem)',
                opacity: captionOpacity,
                maxWidth: '460px',
                pointerEvents: 'none',
              }}
            >
              <p className="eyebrow" style={{ color: 'var(--ember)', marginBottom: '0.9rem' }}>
                The Film
              </p>
              <p className="display" style={{ color: 'var(--cream)', fontSize: 'clamp(2rem, 4.6vw, 3.6rem)' }}>
                Scroll to plate.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
