# Scroll-scrubbed film (the "Apple technique")

Drop a video here and the site grows a new section automatically:
scrolling down plays it FORWARD, scrolling up plays it in REVERSE —
exactly how the Apple AirPods pages and those viral 3D-looking sites work.

Files it looks for (either or both):

  film.webm
  film.mp4

No file → no section. Nothing breaks.

## Make the video scrub-smooth (important!)

Normal videos only have a keyframe every 1–10 seconds, which makes
scrubbing jumpy. Re-encode with a keyframe on EVERY frame:

  ffmpeg -i input.mp4 -an -g 1 -crf 24 -pix_fmt yuv420p -movflags +faststart public/video/film.mp4
  ffmpeg -i input.mp4 -an -g 1 -b:v 3M public/video/film.webm

(-an strips audio; scrub films are always silent. Keep clips 10–30s.)

## Where to get footage for free

1. **Your phone.** The most underrated option — put a plated dish on a
   table near a window or candle, walk your phone SLOWLY around it in one
   smooth arc (2–3 slow orbits, ~20s). Scrubbed by scroll, this looks
   exactly like the AI-generated films — because it's the same trick with
   a real camera.
2. **Blender (free)** — render a camera orbit of any 3D scene.
3. **Free trials/credits** on AI video tools (Runway, Luma, Pika, etc.)
   when you want the fully-generated look.
4. Stock sites with free tiers (Pexels/Coverr) have restaurant b-roll.

## Why some sites also react to the mouse

That part is never video — it's real-time 3D (Three.js / Spline).
This site already has that: the hero tablescape is live 3D that scrubs
with scroll AND follows the pointer. Video film sections and live 3D
can coexist — that's what most award sites do.

## Current film

`film.mp4` — 18s macro b-roll of a T-bone steak searing over open flame
(1280px, all-intra H.264 for smooth scrubbing). Sourced from the public
repo mahmud035/the-bbq-place-restaurant (media/video/home-bg-video.mkv),
which ships it as template stock footage. Replace it any time by dropping
your own film.mp4 here — your own dishes will always beat stock.
