/* Plants, foliage and water.
 * Foliage is built with draw.group(), which strokes every blob first and then
 * fills them — so a bush reads as one leafy mass rather than a pile of circles. */

import {
  INK, rrect, circle, oval, poly, curve, line, ink, shadow, group, groupPaths,
  cachedPath, glow, lighten, darken, alpha,
} from '../core/draw.js';
import { P } from './palette.js';
import { hash01 } from '../core/rng.js';

const C = (o, f) => o.c || f;

/* ------------------------------------------------------------ leaf shapes */
/* Every leaf is a cached Path2D placed by a transform, so a palm with nine
 * fronds costs nine matrix pushes rather than nine hundred line segments. */

const q = (n, step = 2) => Math.round(n / step) * step;

/** Serrated frond blade running from (0,0) out to length `len` along -Y. */
function frondPath(len, wid, notch = 0.45) {
  len = q(len, 4); wid = q(wid, 2);
  return cachedPath(`frond|${len}|${wid}|${notch}`, (path) => {
    const n = 9;
    const spine = (p) => [Math.sin(p * 0.9) * len * 0.16, -len * p];
    const w = (p) => wid * Math.sin(Math.min(1, p * 1.15) * Math.PI) * 0.92 + wid * 0.12;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const p = i / n, [sx, sy] = spine(p);
      pts.push([sx - w(p) * (i % 2 ? notch : 1), sy]);
    }
    for (let i = n; i >= 0; i--) {
      const p = i / n, [sx, sy] = spine(p);
      pts.push([sx + w(p) * (i % 2 ? 1 : notch), sy]);
    }
    path.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) path.lineTo(pts[i][0], pts[i][1]);
    path.closePath();
  });
}

/** Round split leaf, monstera style: a full blade with slits cut into it. */
function splitLeafPath(r) {
  r = q(r, 3);
  return cachedPath(`split|${r}`, (path) => {
    const n = 22;
    for (let i = 0; i <= n; i++) {
      const p = i / n;
      const a = -Math.PI / 2 + (p - 0.5) * Math.PI * 1.88;
      const lobe = 1 - 0.26 * Math.pow(Math.abs(Math.sin((p - 0.5) * Math.PI * 3.4)), 3);
      const taper = 0.72 + 0.28 * Math.sin(p * Math.PI);
      const rad = r * lobe * taper;
      const x = Math.cos(a) * rad, y = Math.sin(a) * rad * 0.94 + r * 0.18;
      if (i === 0) path.moveTo(x, y); else path.lineTo(x, y);
    }
    path.lineTo(0, r * 0.34);
    path.closePath();
  });
}

function simpleLeafPath(len, wid) {
  len = q(len); wid = q(wid);
  return cachedPath(`leaf|${len}|${wid}`, (path) => {
    path.moveTo(0, 0);
    path.quadraticCurveTo(len * 0.5, -wid, len, 0);
    path.quadraticCurveTo(len * 0.5, wid, 0, 0);
    path.closePath();
  });
}

const at = (x, y, rot = 0) => (ctx) => { ctx.translate(x, y); if (rot) ctx.rotate(rot); };

function pot(ctx, w, h, colour, rim = true) {
  poly(ctx, [[-w / 2, -h], [w / 2, -h], [w / 2 - w * 0.12, 0], [-w / 2 + w * 0.12, 0]]);
  ink(ctx, colour, 3);
  if (rim) { rrect(ctx, -w / 2 - 3, -h - 8, w + 6, 10, 3); ink(ctx, lighten(colour, 0.18), 3); }
  oval(ctx, 0, -h - 3, w * 0.4, w * 0.1); ink(ctx, '#5b4433', 0);
}

export const NATURE = {
  pot_plain: {
    w: 56, h: 60,
    draw(ctx, o) {
      shadow(ctx, 0, -2, (o.w || 48) * 0.5, 7);
      pot(ctx, o.w || 48, o.h || 44, C(o, '#c9733f'));
    },
  },

  plant_monstera: {
    w: 150, h: 200,
    draw(ctx, o, t) {
      const g = C(o, '#3f9a5e'), seed = (o.seed || 4) * 29, n = o.n || 7;
      const sway = Math.sin((t || 0) * 0.8 + seed) * 0.03;
      shadow(ctx, 0, -2, 32, 8);
      const stems = [];
      const blades = [];
      for (let i = 0; i < n; i++) {
        const k = hash01(seed + i);
        const ang = -Math.PI / 2 + (i / (n - 1) - 0.5) * 1.85 + (k - 0.5) * 0.2;
        const len = 46 + k * 44;
        const tipX = Math.cos(ang) * len, tipY = Math.sin(ang) * len - 44;
        const r = 27 + k * 13;
        stems.push([ang, len, tipX, tipY]);
        blades.push({ p: splitLeafPath(r), t: at(tipX, tipY, ang + Math.PI / 2 + sway * (1 + k)),
          c: i % 2 ? g : lighten(g, 0.13) });
      }
      ctx.save();
      ctx.rotate(sway * 0.4);
      for (const [ang, len, tipX, tipY] of stems) {
        ctx.beginPath();
        ctx.moveTo(0, -42);
        ctx.quadraticCurveTo(tipX * 0.4, tipY * 0.6 - 12, tipX, tipY);
        ctx.lineWidth = 5.4; ctx.strokeStyle = INK; ctx.stroke();
        ctx.lineWidth = 3; ctx.strokeStyle = darken(g, 0.24); ctx.stroke();
      }
      groupPaths(ctx, blades, g, 2.8);
      ctx.restore();
      pot(ctx, o.pw || 58, 48, C(o, '#c9733f'));
    },
  },

  plant_fern: {
    w: 140, h: 150,
    draw(ctx, o, t) {
      const g = C(o, '#57a45e'), seed = (o.seed || 7) * 19, n = o.n || 9;
      const sway = Math.sin((t || 0) * 1.1 + seed) * 0.05;
      shadow(ctx, 0, -2, 28, 7);
      const blades = [];
      for (let i = 0; i < n; i++) {
        const k = hash01(seed + i);
        const ang = (i / (n - 1) - 0.5) * 2.0;
        const len = 44 + k * 40;
        blades.push({ p: frondPath(len, 11 + k * 4, 0.34), t: at(0, -32, ang + sway * (1 + k * 0.6)),
          c: i % 2 ? g : lighten(g, 0.14) });
      }
      groupPaths(ctx, blades, g, 2.4);
      pot(ctx, o.pw || 50, 36, C(o, '#b8663f'));
    },
  },

  plant_hanging: {
    w: 120, h: 180, ceiling: true,
    draw(ctx, o, t) {
      const g = C(o, '#5fb36a'), seed = (o.seed || 9) * 37, drop = o.drop || 40;
      const sway = Math.sin((t || 0) * 0.6 + seed) * 0.03;
      ctx.rotate(sway);
      for (const s of [-1, 1]) line(ctx, s * 16, drop, 0, 0, INK, 2);
      poly(ctx, [[-24, drop], [24, drop], [18, drop + 28], [-18, drop + 28]]);
      ink(ctx, C(o, '#c9733f'), 3);
      const leaves = [];
      for (let i = 0; i < 8; i++) {
        const k = hash01(seed + i);
        const x = -20 + i * 5.6 + (k - 0.5) * 6;
        const len = 40 + k * 86;
        ctx.beginPath();
        ctx.moveTo(x, drop + 24);
        ctx.quadraticCurveTo(x + (k - 0.5) * 30, drop + 24 + len * 0.6, x + (k - 0.5) * 18, drop + 24 + len);
        ctx.lineWidth = 3.6; ctx.strokeStyle = INK; ctx.stroke();
        ctx.lineWidth = 2; ctx.strokeStyle = darken(g, 0.2); ctx.stroke();
        for (let j = 1; j <= 6; j++) {
          const p = j / 6.5;
          const lx = x + (k - 0.5) * 30 * p * (2 - p) * 0.9, ly = drop + 24 + len * p;
          const rot = ((j % 2) ? 0.55 : 2.6) + p * 0.5;
          leaves.push({ p: simpleLeafPath(13, 6.5), t: at(lx, ly, rot), c: j % 2 ? g : lighten(g, 0.16) });
        }
      }
      groupPaths(ctx, leaves, g, 1.9);
    },
  },

  cactus: {
    w: 80, h: 120,
    draw(ctx, o) {
      const g = C(o, '#5aa06a');
      shadow(ctx, 0, -2, 24, 6);
      pot(ctx, 46, 34, C(o, '#d2724a'));
      group(ctx, [
        () => rrect(ctx, -14, -96, 28, 68, 14),
        () => rrect(ctx, 10, -78, 22, 13, 8),
        () => rrect(ctx, 22, -86, 12, 24, 6),
        () => rrect(ctx, -32, -66, 20, 12, 7),
        () => rrect(ctx, -34, -76, 11, 20, 6),
      ], g, 3);
      for (let i = 0; i < 7; i++) {
        const y = -90 + i * 9;
        line(ctx, -8, y, -4, y - 2, alpha('#e9f6d8', 0.85), 1.4);
        line(ctx, 8, y, 4, y - 2, alpha('#e9f6d8', 0.85), 1.4);
      }
      if (o.flower) { circle(ctx, 0, -100, 6.5); ink(ctx, P.rose, 2.2); circle(ctx, 0, -100, 2.6); ink(ctx, P.gold, 1.6); }
    },
  },

  succulent: {
    w: 48, h: 44,
    draw(ctx, o) {
      const g = C(o, '#7fbf8a');
      pot(ctx, 36, 24, C(o, '#cfc0a8'), false);
      for (let r = 2; r >= 0; r--) {
        const n = 5 + r * 2, rad = 7 + r * 5.5;
        const petals = [];
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + r * 0.4;
          petals.push({ p: simpleLeafPath(rad, rad * 0.52), t: at(0, -26, a),
            c: r === 0 ? lighten(g, 0.3) : r === 1 ? g : darken(g, 0.12) });
        }
        groupPaths(ctx, petals, g, 1.7);
      }
    },
  },

  palm: {
    w: 260, h: 300,
    draw(ctx, o, t) {
      const g = C(o, '#3f9a63'), seed = (o.seed || 11) * 41, h = o.h || 180;
      const sway = Math.sin((t || 0) * 0.5 + seed) * 0.04;
      shadow(ctx, 0, -2, 36, 9);
      ctx.beginPath();
      ctx.moveTo(-10, 0); ctx.quadraticCurveTo(-4, -h * 0.6, -6, -h);
      ctx.lineTo(6, -h); ctx.quadraticCurveTo(6, -h * 0.6, 10, 0); ctx.closePath();
      ink(ctx, '#a5784c', 3);
      for (let i = 0; i < 5; i++) line(ctx, -8 + i, -h * 0.18 * (i + 1), 8 - i, -h * 0.18 * (i + 1) - 4, alpha('#6b4a2c', 0.5), 2);
      const n = o.n || 9;
      const fronds = [];
      for (let i = 0; i < n; i++) {
        const k = hash01(seed + i);
        const a = (i / (n - 1) - 0.5) * 2.5 + (k - 0.5) * 0.18;
        const len = 74 + k * 40;
        fronds.push({ p: frondPath(len, 17 + k * 6, 0.3), t: at(0, -h, a + sway),
          c: i % 2 ? g : lighten(g, 0.12) });
      }
      groupPaths(ctx, fronds, g, 2.8);
      circle(ctx, 0, -h - 2, 7); ink(ctx, darken(g, 0.3), 2.4);
    },
  },

  bush: {
    w: 150, h: 100,
    draw(ctx, o) {
      const g = C(o, '#4e9b5a'), seed = (o.seed || 13) * 7, w = o.w || 110;
      shadow(ctx, 0, -2, w * 0.48, 8);
      const blobs = [];
      for (let i = 0; i < 6; i++) {
        const k = hash01(seed + i);
        const x = -w / 2 + (i / 5) * w, y = -16 - k * 30, r = 22 + k * 14;
        blobs.push([() => circle(ctx, x, y, r), i % 2 ? g : lighten(g, 0.1)]);
      }
      blobs.push([() => oval(ctx, 0, -12, w * 0.52, 20), darken(g, 0.08)]);
      group(ctx, blobs, g, 3);
      ctx.save();
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 4; i++) {
        const k = hash01(seed + 20 + i);
        circle(ctx, -w / 3 + k * w * 0.7, -26 - k * 22, 8 + k * 5);
        ink(ctx, lighten(g, 0.3), 0);
      }
      ctx.restore();
      if (o.berries) for (let i = 0; i < 7; i++) {
        const k = hash01(seed + 40 + i);
        circle(ctx, (k - 0.5) * w * 0.85, -16 - hash01(seed + 50 + i) * 34, 3.8);
        ink(ctx, o.berries, 1.8);
      }
    },
  },

  tree_round: {
    w: 230, h: 300,
    draw(ctx, o, t) {
      const g = C(o, '#4a9a5e'), seed = (o.seed || 17) * 11, h = o.h || 130;
      const sway = Math.sin((t || 0) * 0.45 + seed) * 0.016;
      shadow(ctx, 0, -2, 50, 11);
      ctx.beginPath();
      ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-7, -h * 0.6, -9, -h);
      ctx.lineTo(9, -h); ctx.quadraticCurveTo(7, -h * 0.6, 14, 0); ctx.closePath();
      ink(ctx, '#96643c', 3.2);
      line(ctx, -2, -h * 0.55, -22, -h * 0.78, '#96643c', 7);
      line(ctx, 2, -h * 0.62, 22, -h * 0.84, '#96643c', 6);
      ctx.save();
      ctx.translate(0, -h);
      ctx.rotate(sway);
      const blobs = [];
      for (let i = 0; i < 7; i++) {
        const k = hash01(seed + i);
        const a = (i / 7) * Math.PI * 2;
        const x = Math.cos(a) * (30 + k * 10), y = Math.sin(a) * (22 + k * 8) - 22, r = 32 + k * 13;
        blobs.push([() => circle(ctx, x, y, r), i % 2 ? g : lighten(g, 0.09)]);
      }
      blobs.push([() => circle(ctx, 0, -28, 40), lighten(g, 0.16)]);
      group(ctx, blobs, g, 3.2);
      ctx.save();
      ctx.globalAlpha = 0.45;
      for (let i = 0; i < 4; i++) {
        const k = hash01(seed + 30 + i);
        circle(ctx, -34 + k * 60, -46 - k * 20, 12 + k * 7);
        ink(ctx, lighten(g, 0.32), 0);
      }
      ctx.restore();
      ctx.restore();
    },
  },

  flower_cluster: {
    w: 62, h: 52,
    draw(ctx, o) {
      const seed = (o.seed || 19) * 5;
      const cols = o.cols || [P.rose, P.butter, P.coral, P.lilac];
      for (let i = 0; i < 5; i++) {
        const k = hash01(seed + i);
        const x = (i - 2) * 9 + (k - 0.5) * 6, y = -14 - k * 26;
        ctx.beginPath(); ctx.moveTo(x * 0.3, 0); ctx.quadraticCurveTo(x * 0.7, y * 0.5, x, y);
        ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
        ctx.lineWidth = 2.2; ctx.strokeStyle = P.jade; ctx.stroke();
        const col = cols[Math.floor(k * cols.length)];
        const petals = [];
        for (let p = 0; p < 5; p++) {
          const a = (p / 5) * Math.PI * 2 + k;
          petals.push(() => circle(ctx, x + Math.cos(a) * 4.4, y + Math.sin(a) * 4.4, 3.8));
        }
        group(ctx, petals, col, 1.7);
        circle(ctx, x, y, 2.6); ink(ctx, P.gold, 1.4);
      }
    },
  },

  grass_tuft: {
    w: 52, h: 38,
    draw(ctx, o, t) {
      const g = C(o, '#63ae5e'), seed = (o.seed || 23) * 3;
      const sway = Math.sin((t || 0) * 1.4 + seed) * 3;
      for (let i = 0; i < 7; i++) {
        const k = hash01(seed + i), x = (i - 3) * 5;
        ctx.beginPath(); ctx.moveTo(x, 0);
        ctx.quadraticCurveTo(x + (k - 0.5) * 10, -14 - k * 10, x + (k - 0.5) * 24 + sway * k, -22 - k * 16);
        ctx.lineWidth = 4.4; ctx.strokeStyle = INK; ctx.stroke();
        ctx.lineWidth = 2.6; ctx.strokeStyle = i % 2 ? g : darken(g, 0.15); ctx.stroke();
      }
    },
  },

  vine_wall: {
    w: 70, h: 220, ceiling: true,
    draw(ctx, o) {
      const g = C(o, '#59a85f'), seed = (o.seed || 27) * 13, len = o.len || 150;
      const leaves = [];
      for (let s = -1; s <= 1; s++) {
        const x0 = s * 13;
        ctx.beginPath(); ctx.moveTo(x0, 0);
        ctx.quadraticCurveTo(x0 + s * 14, len * 0.5, x0 + s * 5, len);
        ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke();
        ctx.lineWidth = 2.2; ctx.strokeStyle = darken(g, 0.2); ctx.stroke();
        for (let j = 1; j <= 9; j++) {
          const p = j / 10, y = len * p;
          const lx = x0 + s * 14 * p * (2 - p), rot = (j % 2) ? 0.6 : 2.5;
          const r = 12 + hash01(seed + j + s * 5) * 5;
          leaves.push({ p: simpleLeafPath(r, r * 0.55), t: at(lx, y, rot), c: j % 2 ? g : lighten(g, 0.15) });
        }
      }
      groupPaths(ctx, leaves, g, 1.9);
    },
  },

  pond: {
    w: 320, h: 170, flat: true,
    draw(ctx, o, t) {
      const w = o.w || 280, h = o.h || 140;
      oval(ctx, 0, 0, w / 2 + 10, h / 2 + 10); ink(ctx, C(o, '#b6aa96'), 3.4);
      oval(ctx, 0, 0, w / 2, h / 2); ink(ctx, '#5fa9cc', 3);
      ctx.save();
      oval(ctx, 0, 0, w / 2, h / 2); ctx.clip();
      oval(ctx, -w * 0.1, h * 0.1, w * 0.4, h * 0.3); ink(ctx, alpha('#3d8aa8', 0.5), 0);
      for (let i = 0; i < 5; i++) {
        const ph = (t || 0) * 0.4 + i;
        oval(ctx, Math.sin(ph) * 34, -h / 2.4 + i * (h / 6), w * 0.28, 5);
        ink(ctx, alpha('#ffffff', 0.3), 0);
      }
      ctx.restore();
      for (let i = 0; i < 5; i++) {
        const a = i * 1.3, x = Math.cos(a) * w * 0.31, y = Math.sin(a) * h * 0.3;
        oval(ctx, x, y, 17, 10); ink(ctx, '#4f9c5d', 2.4);
        poly(ctx, [[x, y], [x + 5, y - 5], [x + 9, y + 2]]); ink(ctx, '#3d8a4c', 0);
        if (i % 2) { circle(ctx, x + 11, y - 7, 5.4); ink(ctx, P.rose, 2); circle(ctx, x + 11, y - 7, 2.2); ink(ctx, P.gold, 1.4); }
      }
    },
  },

  stone: {
    w: 66, h: 40,
    draw(ctx, o) {
      const c = C(o, P.stone), w = o.w || 44;
      shadow(ctx, 0, -2, w * 0.5, 6);
      curve(ctx, [[-w / 2, 0], [-w * 0.42, -19], [0, -26], [w * 0.42, -17], [w / 2, 0]]);
      ink(ctx, c, 3);
      curve(ctx, [[-w * 0.25, -13], [0, -19], [w * 0.2, -13]]);
      ink(ctx, null, 2, alpha(lighten(c, 0.5), 0.8));
    },
  },

  lily: {
    w: 42, h: 22, flat: true,
    draw(ctx, o) {
      oval(ctx, 0, 0, 17, 10); ink(ctx, '#4f9c5d', 2.4);
      poly(ctx, [[0, 0], [6, -5], [9, 2]]); ink(ctx, '#3d8a4c', 0);
    },
  },

  /* A flat pool of warm light — lets night scenes have readable ground. */
  lightpool: {
    w: 320, h: 160, flat: true,
    draw(ctx, o) {
      const rx = o.r || 150;
      ctx.save();
      ctx.scale(1, 0.46);
      glow(ctx, 0, 0, rx, o.c || '#ffb35c', o.a ?? 0.34);
      ctx.restore();
    },
  },
};
