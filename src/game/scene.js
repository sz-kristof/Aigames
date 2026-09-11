/* A Scene is both the authoring surface (the chainable add/find/actor calls
 * the level files use) and the runtime that draws and hit-tests it. */

import { drawProp, propBounds, getProp, LIVE } from '../art/props.js';
import { prepare, alpha, glow } from '../core/draw.js';
import { MOODS } from '../art/palette.js';
import { Rng } from '../core/rng.js';

let uid = 0;

/* Zoomed all the way out every prop is on screen at once, which is the one
 * case where redrawing a few hundred outlined paths per frame gets expensive.
 * Below this zoom each static prop is baked once into a sprite at a resolution
 * at least as fine as the screen, so the blit is pixel-exact; zoom in past it
 * and the paths are drawn live again (and far fewer of them are in view). */
const SPRITE_SCALE = 1.6;
const MAX_SPRITE_PX = 420000;
const BAKES_PER_FRAME = 24;

export class Scene {
  constructor(def) {
    this.id = def.id;
    this.name = def.name;
    this.sub = def.sub;
    this.blurb = def.blurb || '';
    this.world = def.world;
    this.mood = MOODS[def.mood] || MOODS.cafe;
    this.backdrop = def.backdrop;
    this.ambience = def.ambience || null;
    this.start = def.start || { x: def.world.w / 2, y: def.world.h / 2, zoom: 1 };
    this.rng = new Rng(def.seed || 7);

    this.flats = [];      // floor decals, drawn before everything
    this.statics = [];    // y-sorted scenery
    this.actors = [];     // y-sorted, animated, tappable
    this.ceiling = [];    // hangs above, drawn last
    this.finds = [];      // subset of statics flagged findable
    this.bg = null;
    this.sprites = new Map();
    this.spriteBudget = 12e6;   // total baked pixels allowed
    this.bakesLeft = 0;
  }

  /** Bake one placed prop into a sprite, or null if it is not worth caching. */
  spriteFor(o) {
    const hit = this.sprites.get(o.id);
    if (hit !== undefined) return hit;
    if (this.bakesLeft <= 0) return undefined;   // try again next frame

    const b = propBounds(o);
    const pad = 8;
    const w = b.x1 - b.x0 + pad * 2;
    const h = b.y1 - b.y0 + pad * 2;
    const cw = Math.ceil(w * SPRITE_SCALE);
    const ch = Math.ceil(h * SPRITE_SCALE);
    if (w <= 0 || h <= 0 || cw * ch > MAX_SPRITE_PX || cw * ch > this.spriteBudget) {
      this.sprites.set(o.id, null);
      return null;
    }
    this.bakesLeft--;
    this.spriteBudget -= cw * ch;
    const cv = document.createElement('canvas');
    cv.width = cw;
    cv.height = ch;
    const c2 = cv.getContext('2d');
    prepare(c2);
    c2.scale(SPRITE_SCALE, SPRITE_SCALE);
    c2.translate(-(b.x0 - pad), -(b.y0 - pad));
    drawProp(c2, o, 0);
    const sp = { cv, x: b.x0 - pad, y: b.y0 - pad, w, h };
    this.sprites.set(o.id, sp);
    return sp;
  }

  /* ------------------------------------------------------- authoring API */

  add(type, x, y, opts = {}) {
    const o = Object.assign({ id: ++uid, type, x, y }, opts);
    const def = getProp(type);
    if (def.flat) this.flats.push(o);
    else if (def.ceiling || def.span) this.ceiling.push(o);
    else this.statics.push(o);
    return o;
  }

  /** Scatter n copies of a type in a box — the cheap way to get density. */
  scatter(types, box, n, opts = {}) {
    const list = Array.isArray(types) ? types : [types];
    for (let i = 0; i < n; i++) {
      const t = this.rng.pick(list);
      const x = this.rng.range(box.x, box.x + box.w);
      const y = this.rng.range(box.y, box.y + box.h);
      this.add(t, Math.round(x), Math.round(y), Object.assign({
        s: opts.sMin ? this.rng.range(opts.sMin, opts.sMax || 1) : (opts.s || 1),
        flip: this.rng.chance(0.5),
        seed: this.rng.int(1, 999),
      }, opts.props ? opts.props(this.rng, i) : {}));
    }
  }

  /** A findable item. `where` is the nudge shown if the player asks twice. */
  find(type, x, y, opts = {}) {
    const def = getProp(type);
    const o = this.add(type, x, y, Object.assign({ findable: true }, opts));
    o.label = opts.label || def.name || type;
    o.tint = opts.tint || def.tint || '#ffd166';
    o.where = opts.where || '';
    o.found = false;
    o.pulse = 0;
    this.finds.push(o);
    return o;
  }

  actor(type, x, y, opts = {}) {
    const o = Object.assign({
      id: ++uid, type, x, y, seed: this.rng.range(0, 7), moving: false,
      home: { x, y }, react: 0,
    }, opts);
    if (o.route) { o.leg = 0; o.legT = 0; o.speed = o.speed || 26; }
    this.actors.push(o);
    return o;
  }

  /* ---------------------------------------------------------- preparation */

  /** Render the static backdrop once into an offscreen canvas. */
  prepareBackdrop() {
    if (this.bg || !this.backdrop) return;
    const cv = document.createElement('canvas');
    cv.width = this.world.w;
    cv.height = this.world.h;
    const ctx = cv.getContext('2d');
    prepare(ctx);
    this.backdrop(ctx, this);
    this.bg = cv;
    this.statics.sort((a, b) => (a.sort ?? a.y) - (b.sort ?? b.y));
  }

  /* ------------------------------------------------------------- runtime */

  update(dt, t) {
    for (const a of this.actors) {
      if (a.react > 0) a.react = Math.max(0, a.react - dt);
      if (!a.route) continue;
      const route = a.route;
      const from = route[a.leg];
      const to = route[(a.leg + 1) % route.length];
      const dist = Math.hypot(to.x - from.x, to.y - from.y) || 1;
      if (a.pause > 0) { a.pause -= dt; a.moving = false; continue; }
      a.legT += (a.speed * dt) / dist;
      a.moving = true;
      if (a.legT >= 1) {
        a.legT = 0;
        a.leg = (a.leg + 1) % route.length;
        a.pause = to.wait ?? (a.dwell ? this.rng.range(1.2, 4.5) : 0);
      }
      a.x = from.x + (to.x - from.x) * a.legT;
      a.y = from.y + (to.y - from.y) * a.legT;
      a.flip = to.x < from.x;
    }
    // drifting things (butterflies, fish) bob around wherever they just moved to
    for (const a of this.actors) {
      if (!a.float) continue;
      const base = a.route ? a.y : a.home.y;
      a.y = base + Math.sin(t * (a.float.f || 1.5) + a.seed) * (a.float.a || 8);
    }
    for (const f of this.finds) if (f.pulse > 0) f.pulse = Math.max(0, f.pulse - dt);
  }

  draw(ctx, t, camera) {
    const b = camera.bounds();
    if (this.bg) ctx.drawImage(this.bg, 0, 0);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const baked = camera.zoom * dpr <= SPRITE_SCALE;
    this.bakesLeft = baked ? BAKES_PER_FRAME : 0;

    const visible = (o) => {
      const bb = propBounds(o);
      return bb.x1 > b.x0 && bb.x0 < b.x1 && bb.y1 > b.y0 && bb.y0 < b.y1;
    };

    const paint = (o) => {
      if (baked && !LIVE.has(o.type)) {
        const sp = this.spriteFor(o);
        if (sp) { ctx.drawImage(sp.cv, sp.x, sp.y, sp.w, sp.h); return; }
      }
      drawProp(ctx, o, t);
    };

    for (const o of this.flats) if (visible(o)) paint(o);

    // merge the pre-sorted scenery with the few moving actors
    const acts = this.actors.slice().sort((a, b) => (a.sort ?? a.y) - (b.sort ?? b.y));
    let i = 0, j = 0;
    const S = this.statics, A = acts;
    while (i < S.length || j < A.length) {
      const useStatic = j >= A.length || (i < S.length && (S[i].sort ?? S[i].y) <= (A[j].sort ?? A[j].y));
      const o = useStatic ? S[i++] : A[j++];
      if (!visible(o)) continue;
      if (!useStatic) drawProp(ctx, o, t);          // actors always draw live
      else if (o.findable) this.drawFind(ctx, o, t, paint);
      else paint(o);
    }

    for (const o of this.ceiling) if (visible(o)) paint(o);
  }

  drawFind(ctx, o, t, paint) {
    const def = getProp(o.type);
    const s = o.s || 1;
    const cy = o.y - (def.h * s) / 2;
    if (o.pulse > 0) {
      const k = 1 - o.pulse / 2.2;
      const r = (Math.max(def.w, def.h) * s) * (0.9 + k * 2.4);
      ctx.save();
      ctx.globalAlpha = Math.min(1, o.pulse * 1.4) * 0.8;
      glow(ctx, o.x, cy, r, '#9be8ff', 0.55);
      ctx.beginPath();
      ctx.arc(o.x, cy, r * 0.55, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = alpha('#bff0ff', 0.9);
      ctx.stroke();
      ctx.restore();
    }
    if (o.found) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      glow(ctx, o.x, cy, Math.max(def.w, def.h) * s * 1.25, o.tint, 0.55);
      ctx.restore();
    }
    (paint || ((p) => drawProp(ctx, p, t)))(o);
    if (o.found) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      const r = Math.max(def.w, def.h) * s * 0.62;
      ctx.beginPath();
      ctx.arc(o.x, cy, r, 0, Math.PI * 2);
      ctx.setLineDash([5, 6]);
      ctx.lineDashOffset = -t * 12;
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = alpha(o.tint, 0.95);
      ctx.stroke();
      ctx.restore();
    }
  }

  /** Screen-space wash + vignette, drawn after the world transform is popped. */
  drawMood(ctx, w, h) {
    if (this.mood.wash) {
      ctx.fillStyle = this.mood.wash;
      ctx.fillRect(0, 0, w, h);
    }
    if (this.mood.vignette) {
      const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.34, w / 2, h / 2, Math.max(w, h) * 0.78);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, this.mood.vignette);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  }

  /* ---------------------------------------------------------- hit testing */

  hitFind(pt, zoom) {
    let best = null, bestD = Infinity;
    for (const o of this.finds) {
      if (o.found) continue;
      const def = getProp(o.type);
      const s = o.s || 1;
      const cy = o.y - (def.h * s) / 2;
      const r = Math.max(def.w, def.h) * s * 0.62 + 10 / zoom;
      const d = Math.hypot(pt.x - o.x, pt.y - cy);
      if (d < r && d < bestD) { best = o; bestD = d; }
    }
    return best;
  }

  hitActor(pt, zoom) {
    let best = null, bestD = Infinity;
    for (const a of this.actors) {
      const def = getProp(a.type);
      const s = a.s || 1;
      const cy = a.y - (def.h * s) / 2;
      const r = Math.max(def.w * 0.6, def.h * 0.5) * s + 6 / zoom;
      const d = Math.hypot(pt.x - a.x, pt.y - cy);
      if (d < r && d < bestD) { best = a; bestD = d; }
    }
    return best;
  }

  /** Any scenery with a `talk` line — lets the world answer a poke. */
  hitProp(pt, zoom) {
    for (let i = this.statics.length - 1; i >= 0; i--) {
      const o = this.statics[i];
      if (!o.talk) continue;
      const def = getProp(o.type);
      const s = o.s || 1;
      const bb = propBounds(o);
      if (pt.x > bb.x0 && pt.x < bb.x1 && pt.y > bb.y0 && pt.y < bb.y1) return o;
    }
    return null;
  }

  remaining() { return this.finds.filter((f) => !f.found).length; }
}
