/**
 * Ink trail: a calligraphic stroke that follows the pointer and fades like wet
 * ink. Slow movement lays down a thicker line, fast movement a hairline.
 * On touch devices the finger is the pen: the stroke is laid down while a
 * finger is on the glass (including during a scroll). Skipped for
 * reduced-motion users.
 */
type Point = { x: number; y: number; t: number; w: number };

const LIFE = 1400; // ms a point stays visible
const MAX_W = 2.2;
const MIN_W = 0.5;
const MAX_GAP = 160; // px between events beyond which the pen is considered lifted
// A finger moves faster than a mouse, so ease the speed penalty to keep touch
// strokes from collapsing into hairlines.
const MOUSE_SPEED_K = 2.2;
const TOUCH_SPEED_K = 0.8;

export function initInkTrail(canvas: HTMLCanvasElement) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const points: Point[] = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let raf = 0;
  let last: { x: number; y: number; t: number } | null = null;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  // Static theme token; reading computed style inside `draw` would force a
  // style recalc on every frame.
  const ink =
    getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#f0efeb';

  const addPoint = (x: number, y: number, speedK: number) => {
    const t = performance.now();
    let w = MAX_W;
    if (last) {
      const dt = Math.max(1, t - last.t);
      const speed = Math.hypot(x - last.x, y - last.y) / dt; // px per ms
      w = Math.max(MIN_W, MAX_W - speed * speedK);
      // Smooth the width so it doesn't jitter between events.
      const prev = points[points.length - 1];
      if (prev) w = prev.w + (w - prev.w) * 0.35;
    }
    last = { x, y, t };
    points.push({ x, y, t, w });
    if (!raf) raf = requestAnimationFrame(draw);
  };

  const onPointerMove = (e: PointerEvent) => {
    // Touch is handled via touchmove, which keeps firing during a native scroll
    // where pointermove would be cancelled.
    if (e.pointerType === 'touch') return;
    addPoint(e.clientX, e.clientY, MOUSE_SPEED_K);
  };

  const onTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) addPoint(touch.clientX, touch.clientY, TOUCH_SPEED_K);
  };

  const onLeave = () => {
    last = null;
  };

  const draw = () => {
    raf = 0;
    const now = performance.now();
    while (points.length && now - points[0].t > LIFE) points.shift();

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (points.length < 2) return;

    ctx.strokeStyle = ink;

    // Draw each segment separately so alpha and width can follow the ink's age.
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      // A gap in time or space means the pointer left and came back: don't connect.
      if (b.t - a.t > 120 || Math.hypot(b.x - a.x, b.y - a.y) > MAX_GAP) continue;
      const age = (now - b.t) / LIFE;
      const alpha = 0.3 * (1 - age) ** 1.6;
      if (alpha <= 0.005) continue;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = b.w * (1 - age * 0.35);
      ctx.beginPath();
      if (i > 1) {
        // Quadratic through the midpoints keeps the stroke smooth.
        const p = points[i - 2];
        ctx.moveTo((p.x + a.x) / 2, (p.y + a.y) / 2);
        ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
      } else {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onLeave);
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onLeave, { passive: true });
  window.addEventListener('touchcancel', onLeave, { passive: true });
}
