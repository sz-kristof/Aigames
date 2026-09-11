/* The single registry every scene draws from, plus the icon renderer that
 * reuses the exact same art for the dock thumbnails. */

import { CORE } from './props-core.js';
import { SMALL } from './props-small.js';
import { NATURE } from './props-nature.js';
import { FINDS } from './props-finds.js';
import { ACTORS } from './characters.js';
import { prepare } from '../core/draw.js';

export const PROPS = { ...CORE, ...SMALL, ...NATURE, ...FINDS, ...ACTORS };
export { FINDS };

const MISSING = { w: 20, h: 20, draw(ctx) { ctx.fillStyle = '#f0f'; ctx.fillRect(-10, -10, 20, 20); } };

/* Props whose drawing changes with time. Everything else can be baked into a
 * sprite when the camera is far enough out for the bake to be pixel-exact. */
export const LIVE = new Set([
  'cup', 'espresso_machine', 'steamer', 'candle', 'wall_clock',
  'lamp_pendant', 'lantern', 'string_lights', 'pond', 'grass_tuft',
  'pocket_watch', 'compass', 'snowglobe', 'star_charm', 'spinning_top',
]);

export function getProp(type) {
  return PROPS[type] || MISSING;
}

/** Draw one placed instance with its transform applied. */
export function drawProp(ctx, o, t) {
  const def = getProp(o.type);
  ctx.save();
  ctx.translate(o.x, o.y);
  const s = o.s || 1;
  if (s !== 1) ctx.scale(s, s);
  if (o.flip) ctx.scale(-1, 1);
  if (o.rot) ctx.rotate(o.rot);
  def.draw(ctx, o, t);
  ctx.restore();
}

/** Screen-space bounds of a placed instance, used for culling and hit tests. */
export function propBounds(o) {
  const def = getProp(o.type);
  const s = o.s || 1;
  const w = (o.w || def.w) * s;
  const h = (o.h || def.h) * s;
  if (def.flat) return { x0: o.x - w / 2, y0: o.y - h / 2, x1: o.x + w / 2, y1: o.y + h / 2 };
  if (def.span) {
    const x2 = o.x2 ?? o.x;
    const y2 = o.y2 ?? o.y;
    const sag = (o.sag || 40) * 2 + 60;
    return { x0: Math.min(o.x, x2) - 40, y0: Math.min(o.y, y2) - 20, x1: Math.max(o.x, x2) + 40, y1: Math.max(o.y, y2) + sag };
  }
  if (def.ceiling) {
    // hanging things grow downward from their fixing, by drop plus their own height
    const reach = (o.drop || 0) * s + Math.max(h, (o.len || 0) * s) + 60;
    return { x0: o.x - w, y0: o.y - 24, x1: o.x + w, y1: o.y + reach };
  }
  return { x0: o.x - w / 2, y0: o.y - h, x1: o.x + w / 2, y1: o.y + 8 };
}

const iconCache = new Map();

/** Render a prop into a square canvas — used for the find-list thumbnails. */
export function renderIcon(type, size = 56, opts = {}) {
  const key = `${type}|${size}|${JSON.stringify(opts)}`;
  const hit = iconCache.get(key);
  if (hit) return hit;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cv = document.createElement('canvas');
  cv.width = size * dpr;
  cv.height = size * dpr;
  cv.style.width = size + 'px';
  cv.style.height = size + 'px';
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  prepare(ctx);

  const def = getProp(type);
  const pad = 8;
  const scale = Math.min((size - pad) / def.w, (size - pad) / def.h);
  ctx.translate(size / 2, size / 2 + (def.h * scale) / 2);
  ctx.scale(scale, scale);
  def.draw(ctx, Object.assign({ x: 0, y: 0, steam: false }, opts), 0.7);

  iconCache.set(key, cv);
  return cv;
}
