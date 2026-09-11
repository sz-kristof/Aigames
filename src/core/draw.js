/* Canvas drawing primitives for the bold-outline, flat-colour look.
 * Everything is a path + solid fill + dark stroke, so the art scales
 * cleanly with the camera the way vector art does. */

export const INK = '#33263f';

/* ---------------------------------------------------------------- colour */

function clamp255(n) { return n < 0 ? 0 : n > 255 ? 255 : Math.round(n); }

const hexCache = new Map();
export function toRgb(hex) {
  let c = hexCache.get(hex);
  if (c) return c;
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  hexCache.set(hex, c);
  return c;
}

export function mix(a, b, t) {
  const A = toRgb(a), B = toRgb(b);
  return `rgb(${clamp255(A[0] + (B[0] - A[0]) * t)},${clamp255(A[1] + (B[1] - A[1]) * t)},${clamp255(A[2] + (B[2] - A[2]) * t)})`;
}

/** Lighten toward a warm white — keeps highlights from going grey. */
export function lighten(c, t) { return mix(c, '#fffaf2', t); }
/** Darken toward a violet ink — shadows stay in the same colour family. */
export function darken(c, t) { return mix(c, '#2b1f39', t); }

export function alpha(hex, a) {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

/* --------------------------------------------------------------- context */

export function prepare(ctx) {
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.miterLimit = 2;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
}

/** Fill + outline the current path. `lw <= 0` skips the outline. */
export function ink(ctx, fill, lw = 3, colour = INK) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw > 0) { ctx.lineWidth = lw; ctx.strokeStyle = colour; ctx.stroke(); }
}

/* ---------------------------------------------------------------- shapes */

export function rect(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
}

export function rrect(ctx, x, y, w, h, r = 6) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, rr);
  else {
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }
}

export function circle(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.arc(cx, cy, Math.abs(r), 0, Math.PI * 2);
}

export function oval(ctx, cx, cy, rx, ry, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), rot, 0, Math.PI * 2);
}

export function poly(ctx, pts, close = true) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (close) ctx.closePath();
}

/** Smooth closed curve through points — used for foliage, cushions, blobs. */
export function curve(ctx, pts, close = true) {
  const n = pts.length;
  ctx.beginPath();
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let start = close ? mid(pts[n - 1], pts[0]) : pts[0];
  ctx.moveTo(start[0], start[1]);
  for (let i = 0; i < (close ? n : n - 1); i++) {
    const cur = pts[i], nxt = pts[(i + 1) % n];
    const m = close ? mid(cur, nxt) : nxt;
    ctx.quadraticCurveTo(cur[0], cur[1], m[0], m[1]);
  }
  if (close) ctx.closePath();
}

/**
 * A stroked limb — tail, handle, pastry — with its outline.
 * Outline first, colour on top: painting the outline afterwards with
 * destination-over would tuck it behind the opaque backdrop instead.
 */
export function limb(ctx, colour, w, extra = 3, colourInk = INK) {
  ctx.lineWidth = w + extra;
  ctx.strokeStyle = colourInk;
  ctx.stroke();
  ctx.lineWidth = w;
  ctx.strokeStyle = colour;
  ctx.stroke();
}

export function line(ctx, x1, y1, x2, y2, colour = INK, lw = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = lw;
  ctx.strokeStyle = colour;
  ctx.stroke();
}

/* ------------------------------------------------------------- composites */

/** Soft contact shadow on the floor. Drawn without an outline on purpose. */
export function shadow(ctx, cx, cy, rx, ry, a = 0.2) {
  oval(ctx, cx, cy, rx, ry);
  ctx.fillStyle = `rgba(51,38,63,${a})`;
  ctx.fill();
}

/**
 * A box in the oblique "cozy diorama" projection: a squashed top face with
 * a flat front below it. Cheap to draw, reads convincingly solid.
 * Origin is the centre of the footprint on the floor.
 */
export function slab(ctx, w, d, h, colour, opts = {}) {
  const { lw = 3, r = 4, top = lighten(colour, 0.26), front = colour, y = 0 } = opts;
  const hw = w / 2, hd = d * 0.26;
  // front face
  rrect(ctx, -hw, y - h + hd * 0.4, w, h - hd * 0.4 + 2, r);
  ink(ctx, front, lw);
  // top face
  oval(ctx, 0, y - h, hw, hd);
  if (opts.squareTop) rrect(ctx, -hw, y - h - hd, w, hd * 2, r);
  ink(ctx, top, lw);
}

/** Rounded top-face quad (for rectangular table and counter tops). */
export function topFace(ctx, w, d, y, colour, lw = 3) {
  rrect(ctx, -w / 2, y - d * 0.5, w, d, Math.min(8, d / 2));
  ink(ctx, colour, lw);
}

/** Repeating vertical highlight streaks — glass, metal, ceramic. */
export function sheen(ctx, x, y, w, h, a = 0.35) {
  ctx.save();
  ctx.globalAlpha = a;
  rrect(ctx, x, y, w, h, w / 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
}

/* Building a radial gradient costs real CPU, and a lantern-lit scene wants
 * dozens per frame. Gradients are defined in user space, so one built at the
 * origin can be reused anywhere by translating first — cache and reuse. */
const gradients = new WeakMap();

function radial(ctx, r, colour, a) {
  let perCtx = gradients.get(ctx);
  if (!perCtx) { perCtx = new Map(); gradients.set(ctx, perCtx); }
  const key = `${r}|${colour}|${a}`;
  let g = perCtx.get(key);
  if (!g) {
    g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, alpha(colour, a));
    g.addColorStop(0.55, alpha(colour, a * 0.35));
    g.addColorStop(1, alpha(colour, 0));
    perCtx.set(key, g);
  }
  return g;
}

/** Radial pool of light — lanterns, lamps, glowing finds. */
export function glow(ctx, cx, cy, r, colour, a = 0.5) {
  // quantise so a hundred slightly different radii share a handful of gradients
  const q = Math.max(8, Math.round(r / 10) * 10);
  const key = Math.round(a * 40) / 40;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = radial(ctx, q, colour, key);
  ctx.beginPath();
  ctx.arc(0, 0, q, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function text(ctx, str, x, y, size, colour = INK, weight = 600, font = 'Fredoka') {
  ctx.font = `${weight} ${size}px "${font}", "Trebuchet MS", sans-serif`;
  ctx.fillStyle = colour;
  ctx.fillText(str, x, y);
}

/**
 * Draw a cluster of shapes as ONE silhouette: stroke every shape with a
 * double-width outline first, then fill them all on top. The fills bury the
 * interior strokes, so foliage reads as a single mass instead of bubbles.
 * `shapes` is a list of [pathFn, fillColour] (colour optional).
 */
export function group(ctx, shapes, fill, lw = 3, colour = INK) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = lw * 2;
  for (const s of shapes) { (s[0] || s)(); ctx.stroke(); }
  for (const s of shapes) {
    ctx.fillStyle = s[1] || fill;
    (s[0] || s)();
    ctx.fill();
  }
}

/** A soft wedge of light falling from a window or skylight. */
export function shaft(ctx, x, yTop, yBot, wTop, wBot, colour, a = 0.2) {
  const g = ctx.createLinearGradient(0, yTop, 0, yBot);
  g.addColorStop(0, alpha(colour, a));
  g.addColorStop(0.55, alpha(colour, a * 0.45));
  g.addColorStop(1, alpha(colour, 0));
  poly(ctx, [[x - wTop / 2, yTop], [x + wTop / 2, yTop], [x + wBot / 2, yBot], [x - wBot / 2, yBot]]);
  ctx.fillStyle = g;
  ctx.fill();
}

/** Warm pool of light on the ground under a lamp — flattened, not circular. */
export function pool(ctx, cx, cy, rx, ry, colour, a = 0.3) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(1, ry / rx);
  glow(ctx, 0, 0, rx, colour, a);
  ctx.restore();
}

/**
 * Same idea as group(), but the shapes are pre-built Path2D objects placed by
 * a transform. Foliage reuses a handful of leaf paths across hundreds of
 * leaves, so the point maths happens once instead of every frame.
 * Items are { p: Path2D, t: (ctx) => void, c?: fill }.
 */
export function groupPaths(ctx, items, fill, lw = 3, colour = INK) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = lw * 2;
  for (const it of items) { ctx.save(); it.t(ctx); ctx.stroke(it.p); ctx.restore(); }
  for (const it of items) {
    ctx.save();
    it.t(ctx);
    ctx.fillStyle = it.c || fill;
    ctx.fill(it.p);
    ctx.restore();
  }
}

const pathCache = new Map();
/** Build (or fetch) a cached Path2D. `key` must capture every shape input. */
export function cachedPath(key, build) {
  let p = pathCache.get(key);
  if (!p) { p = new Path2D(); build(p); pathCache.set(key, p); }
  return p;
}
