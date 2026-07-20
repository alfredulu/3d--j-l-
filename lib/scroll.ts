// Shared scroll state, updated once per frame by LenisProvider and read by
// WebGL scenes / parallax layers without prop-drilling or re-renders.
export const scrollState = {
  y: 0,
  velocity: 0,
  progress: 0,
  direction: 0 as number,
};

// Normalised pointer, -1..1, lerped in Cursor + read by shaders.
export const pointerState = {
  x: 0,
  y: 0,
  // 0..1 raw for convenience
  nx: 0.5,
  ny: 0.5,
};
