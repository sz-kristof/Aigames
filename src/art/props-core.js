/* Furniture, fittings and containers.
 * Every prop draws from a baseline origin (0,0) = where it meets the floor,
 * and builds upward into negative Y. `o` is the placed instance. */

import {
  INK, rect, rrect, circle, oval, poly, curve, line, ink, shadow,
  lighten, darken, alpha, sheen, glow, text,
} from '../core/draw.js';
import { P } from './palette.js';
import { hash01 } from '../core/rng.js';

const C = (o, fallback) => o.c || fallback;

export const CORE = {
  /* ------------------------------------------------------------ seating */

  table_round: {
    w: 132, h: 96,
    draw(ctx, o) {
      const c = C(o, P.wood), w = o.w || 128;
      shadow(ctx, 0, -2, w * 0.44, 13);
      // pedestal foot
      oval(ctx, 0, -8, w * 0.22, 8); ink(ctx, darken(c, 0.3), 3);
      rrect(ctx, -7, -74, 14, 68, 5); ink(ctx, darken(c, 0.15), 3);
      // top
      oval(ctx, 0, -74, w / 2, w * 0.17); ink(ctx, lighten(c, 0.2), 3.5);
      oval(ctx, 0, -78, w / 2 - 5, w * 0.14); ink(ctx, lighten(c, 0.36), 0);
      if (o.cloth) {
        curve(ctx, [[-w / 2, -74], [0, -62], [w / 2, -74], [w * 0.36, -80], [-w * 0.36, -80]]);
        ink(ctx, o.cloth, 3);
      }
    },
  },

  table_square: {
    w: 150, h: 92,
    draw(ctx, o) {
      const c = C(o, P.oak), w = o.w || 140, h = 66, d = o.d || 46;
      shadow(ctx, 0, -2, w * 0.5, 12);
      for (const lx of [-w / 2 + 9, w / 2 - 9]) {
        rrect(ctx, lx - 5, -h, 10, h, 3); ink(ctx, darken(c, 0.28), 3);
      }
      rrect(ctx, -w / 2, -h - 10, w, 12, 4); ink(ctx, darken(c, 0.12), 3);
      rrect(ctx, -w / 2 - 4, -h - d / 2 - 10, w + 8, d, 7); ink(ctx, lighten(c, 0.22), 3.5);
      rrect(ctx, -w / 2 + 4, -h - d / 2 - 6, w - 8, d - 12, 5); ink(ctx, lighten(c, 0.34), 0);
    },
  },

  chair: {
    w: 62, h: 108,
    draw(ctx, o) {
      const c = C(o, P.red), back = o.back ?? true;
      shadow(ctx, 0, -2, 26, 9);
      for (const lx of [-19, 19]) { rrect(ctx, lx - 4, -46, 8, 46, 3); ink(ctx, darken(c, 0.3), 3); }
      if (back) {
        rrect(ctx, -20, -104, 40, 62, 12); ink(ctx, c, 3.2);
        rrect(ctx, -12, -96, 24, 44, 9); ink(ctx, lighten(c, 0.18), 0);
      }
      rrect(ctx, -24, -54, 48, 14, 6); ink(ctx, lighten(c, 0.12), 3.2);
    },
  },

  stool: {
    w: 48, h: 60,
    draw(ctx, o) {
      const c = C(o, P.walnut);
      shadow(ctx, 0, -2, 20, 8);
      for (const lx of [-14, 14]) { rrect(ctx, lx - 3.5, -44, 7, 44, 3); ink(ctx, darken(c, 0.25), 3); }
      line(ctx, -14, -20, 14, -20, darken(c, 0.25), 4);
      oval(ctx, 0, -46, 23, 9); ink(ctx, lighten(c, 0.25), 3.2);
    },
  },

  bench: {
    w: 190, h: 86,
    draw(ctx, o) {
      const c = C(o, P.wood), w = o.w || 176;
      shadow(ctx, 0, -2, w * 0.5, 11);
      for (const lx of [-w / 2 + 14, w / 2 - 14]) { rrect(ctx, lx - 5, -42, 10, 42, 3); ink(ctx, darken(c, 0.32), 3); }
      for (let i = 0; i < 3; i++) { rrect(ctx, -w / 2, -80 + i * 12, w, 9, 4); ink(ctx, i === 0 ? lighten(c, 0.1) : c, 2.6); }
      rrect(ctx, -w / 2 - 3, -48, w + 6, 14, 5); ink(ctx, lighten(c, 0.2), 3.2);
    },
  },

  sofa: {
    w: 210, h: 110,
    draw(ctx, o) {
      const c = C(o, '#d98b6a'), w = o.w || 196;
      shadow(ctx, 0, -2, w * 0.5, 13);
      rrect(ctx, -w / 2, -98, w, 62, 16); ink(ctx, darken(c, 0.1), 3.4);         // back
      rrect(ctx, -w / 2 - 8, -62, 26, 58, 11); ink(ctx, c, 3.2);                  // arms
      rrect(ctx, w / 2 - 18, -62, 26, 58, 11); ink(ctx, c, 3.2);
      rrect(ctx, -w / 2 + 14, -58, w - 28, 34, 12); ink(ctx, lighten(c, 0.16), 3.2);
      for (let i = 0; i < 2; i++) {
        const x = -w / 4 + i * (w / 2);
        rrect(ctx, x - 22, -92, 44, 40, 12); ink(ctx, lighten(c, 0.28), 2.8);
      }
    },
  },

  cushion: {
    w: 58, h: 34,
    draw(ctx, o) {
      const c = C(o, P.rose), w = o.w || 52;
      shadow(ctx, 0, -2, w * 0.46, 7);
      // a plump floor pouf: side wall, then a domed top
      ctx.beginPath();
      ctx.moveTo(-w / 2, -16);
      ctx.quadraticCurveTo(-w / 2 - 2, -2, 0, -2);
      ctx.quadraticCurveTo(w / 2 + 2, -2, w / 2, -16);
      ctx.closePath();
      ink(ctx, darken(c, 0.14), 3);
      oval(ctx, 0, -18, w / 2, w * 0.24); ink(ctx, c, 3);
      oval(ctx, 0, -21, w * 0.3, w * 0.12); ink(ctx, lighten(c, 0.24), 0);
      circle(ctx, 0, -18, 3); ink(ctx, darken(c, 0.3), 1.8);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        line(ctx, Math.cos(a) * 5, -18 + Math.sin(a) * 2.4,
          Math.cos(a) * (w / 2 - 4), -18 + Math.sin(a) * (w * 0.24 - 2),
          alpha(darken(c, 0.32), 0.4), 1.6);
      }
    },
  },

  /* --------------------------------------------------------- structures */

  counter: {
    w: 420, h: 118,
    draw(ctx, o) {
      const c = C(o, P.walnut), w = o.w || 400, h = o.h || 104;
      shadow(ctx, 0, -2, w * 0.5, 12);
      rrect(ctx, -w / 2, -h, w, h, 6); ink(ctx, c, 3.4);
      for (let x = -w / 2 + 26; x < w / 2 - 10; x += 52) {
        rrect(ctx, x, -h + 14, 38, h - 28, 5); ink(ctx, darken(c, 0.14), 2.6);
      }
      rrect(ctx, -w / 2 - 9, -h - 16, w + 18, 20, 7); ink(ctx, o.top || lighten(c, 0.42), 3.4);
      rrect(ctx, -w / 2 - 4, -h - 12, w + 8, 7, 4); ink(ctx, lighten(c, 0.6), 0);
    },
  },

  shelf_unit: {
    w: 160, h: 220,
    draw(ctx, o) {
      const c = C(o, P.walnut), w = o.w || 150, h = o.h || 210, rows = o.rows || 4;
      shadow(ctx, 0, -2, w * 0.5, 10);
      rrect(ctx, -w / 2, -h, w, h, 6); ink(ctx, darken(c, 0.2), 3.4);
      rrect(ctx, -w / 2 + 7, -h + 7, w - 14, h - 14, 4); ink(ctx, darken(c, 0.45), 0);
      const gap = (h - 14) / rows;
      const seed = (o.seed || 3) * 97;
      for (let r = 0; r < rows; r++) {
        const y = -h + 7 + gap * (r + 1);
        rrect(ctx, -w / 2 + 5, y - 6, w - 10, 7, 3); ink(ctx, c, 2.4);
        let x = -w / 2 + 14;
        let i = 0;
        while (x < w / 2 - 20) {
          const k = hash01(seed + r * 31 + i * 7);
          if (k < 0.22) { x += 8 + k * 20; i++; continue; }
          const bw = 7 + k * 9, bh = 26 + hash01(seed + r * 13 + i) * 18;
          const col = ['#e8615a', '#f2b23e', '#7fc7a6', '#5a8fd6', '#c9a6e8', '#ff8a6b'][Math.floor(k * 6)];
          rrect(ctx, x, y - 6 - bh, bw, bh, 2); ink(ctx, col, 2);
          line(ctx, x + 1.5, y - 6 - bh + 6, x + bw - 1.5, y - 6 - bh + 6, alpha('#fff8ee', 0.55), 1.6);
          x += bw + 1.5; i++;
        }
      }
    },
  },

  cabinet: {
    w: 130, h: 120,
    draw(ctx, o) {
      const c = C(o, P.mint), w = o.w || 124, h = o.h || 112;
      shadow(ctx, 0, -2, w * 0.5, 10);
      rrect(ctx, -w / 2, -h, w, h, 7); ink(ctx, c, 3.4);
      for (const dx of [-1, 1]) {
        rrect(ctx, dx > 0 ? 4 : -w / 2 + 6, -h + 8, w / 2 - 10, h - 16, 5); ink(ctx, lighten(c, 0.2), 2.6);
        circle(ctx, dx * 8, -h / 2, 3.6); ink(ctx, P.brass, 2);
      }
      rrect(ctx, -w / 2 - 5, -h - 10, w + 10, 12, 5); ink(ctx, lighten(c, 0.42), 3.2);
    },
  },

  crate: {
    w: 86, h: 66,
    draw(ctx, o) {
      const c = C(o, P.oak), w = o.w || 78, h = o.h || 58;
      shadow(ctx, 0, -2, w * 0.5, 8);
      rrect(ctx, -w / 2, -h, w, h, 4); ink(ctx, c, 3);
      line(ctx, -w / 2 + 3, -h + 10, w / 2 - 3, -h + 10, darken(c, 0.25), 3);
      line(ctx, -w / 2 + 3, -12, w / 2 - 3, -12, darken(c, 0.25), 3);
      line(ctx, -w / 2 + 4, -h + 4, w / 2 - 4, -4, alpha(darken(c, 0.3), 0.8), 3);
      rrect(ctx, -w / 2 - 3, -h - 7, w + 6, 9, 3); ink(ctx, lighten(c, 0.2), 3);
    },
  },

  box: {
    w: 66, h: 52,
    draw(ctx, o) {
      const c = C(o, '#d9a76c'), w = o.w || 60, h = o.h || 46;
      shadow(ctx, 0, -2, w * 0.5, 7);
      rrect(ctx, -w / 2, -h, w, h, 4); ink(ctx, c, 3);
      rrect(ctx, -w / 2 - 3, -h - 8, w + 6, 10, 3); ink(ctx, lighten(c, 0.16), 3);
      line(ctx, 0, -h - 8, 0, 0, alpha(darken(c, 0.3), 0.7), 3);
      if (o.tape) { rrect(ctx, -6, -h - 9, 12, 12, 2); ink(ctx, P.bone, 2); }
    },
  },

  basket: {
    w: 66, h: 50,
    draw(ctx, o) {
      const c = C(o, '#dcae72'), w = o.w || 58;
      shadow(ctx, 0, -2, w * 0.5, 7);
      poly(ctx, [[-w / 2, -40], [w / 2, -40], [w / 2 - 8, 0], [-w / 2 + 8, 0]]); ink(ctx, c, 3);
      for (let i = 1; i < 3; i++) line(ctx, -w / 2 + 2 + i, -40 + i * 12, w / 2 - 2 - i, -40 + i * 12, alpha(darken(c, 0.3), 0.75), 2);
      oval(ctx, 0, -40, w / 2, 6); ink(ctx, lighten(c, 0.2), 3);
      if (o.handle) { ctx.beginPath(); ctx.arc(0, -40, w * 0.42, Math.PI, 0); ctx.lineWidth = 4; ctx.strokeStyle = darken(c, 0.25); ctx.stroke(); }
    },
  },

  barrel: {
    w: 74, h: 86,
    draw(ctx, o) {
      const c = C(o, '#a9713f');
      shadow(ctx, 0, -2, 32, 9);
      rrect(ctx, -32, -78, 64, 78, 14); ink(ctx, c, 3.2);
      for (const y of [-60, -26]) { rrect(ctx, -34, y, 68, 9, 4); ink(ctx, P.metalDark, 2.4); }
      oval(ctx, 0, -78, 31, 10); ink(ctx, lighten(c, 0.25), 3.2);
    },
  },

  bin: {
    w: 62, h: 74,
    draw(ctx, o) {
      const c = C(o, P.metal);
      shadow(ctx, 0, -2, 26, 8);
      poly(ctx, [[-26, -66], [26, -66], [21, 0], [-21, 0]]); ink(ctx, c, 3);
      oval(ctx, 0, -66, 27, 8); ink(ctx, darken(c, 0.2), 3);
      for (let i = -3; i <= 3; i++) line(ctx, i * 7, -62, i * 6, -6, alpha(darken(c, 0.35), 0.5), 2);
    },
  },

  ladder: {
    w: 54, h: 190,
    draw(ctx, o) {
      const c = C(o, P.oak), h = o.h || 180;
      shadow(ctx, 0, -2, 24, 7);
      for (const lx of [-20, 20]) { rrect(ctx, lx - 4, -h, 8, h, 3); ink(ctx, c, 3); }
      for (let y = -h + 22; y < -14; y += 34) { rrect(ctx, -20, y, 40, 7, 3); ink(ctx, darken(c, 0.15), 2.6); }
    },
  },

  /* --------------------------------------------------------- wall stuff */

  wall_frame: {
    w: 78, h: 96,
    draw(ctx, o) {
      const w = o.w || 66, h = o.h || 82, c = C(o, P.walnut);
      rrect(ctx, -w / 2, -h, w, h, 4); ink(ctx, c, 3.2);
      rrect(ctx, -w / 2 + 7, -h + 7, w - 14, h - 14, 2); ink(ctx, o.art || P.paper, 2);
      const a = o.art2 || P.sky;
      if (o.v === 1) { circle(ctx, 0, -h * 0.6, w * 0.16); ink(ctx, P.gold, 2); poly(ctx, [[-w / 2 + 9, -14], [-6, -h * 0.55], [10, -22], [w / 2 - 9, -14]]); ink(ctx, a, 2); }
      else if (o.v === 2) { for (let i = 0; i < 3; i++) { circle(ctx, -14 + i * 14, -h * 0.5 + (i % 2) * 12, 8); ink(ctx, [P.rose, P.mint, P.amber][i], 2); } }
      else { poly(ctx, [[-w / 2 + 9, -12], [-4, -h * 0.62], [w / 2 - 9, -12]]); ink(ctx, a, 2); circle(ctx, w * 0.22, -h * 0.68, 7); ink(ctx, P.butter, 2); }
    },
  },

  wall_clock: {
    w: 56, h: 56,
    draw(ctx, o, t) {
      const c = C(o, P.cream);
      circle(ctx, 0, -26, 26); ink(ctx, C(o, P.red), 3.4);
      circle(ctx, 0, -26, 20); ink(ctx, c, 2.4);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        line(ctx, Math.cos(a) * 16, -26 + Math.sin(a) * 16, Math.cos(a) * 13, -26 + Math.sin(a) * 13, INK, 1.6);
      }
      const m = (t || 0) * 0.5;
      line(ctx, 0, -26, Math.cos(m - 1.2) * 13, -26 + Math.sin(m - 1.2) * 13, INK, 2.4);
      line(ctx, 0, -26, Math.cos(m / 12 - 1.9) * 8, -26 + Math.sin(m / 12 - 1.9) * 8, INK, 3);
      circle(ctx, 0, -26, 2.4); ink(ctx, INK, 0);
    },
  },

  window_arch: {
    w: 170, h: 230,
    draw(ctx, o) {
      const w = o.w || 150, h = o.h || 210, frame = C(o, P.cream);
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -h + w / 2);
      ctx.arc(0, -h + w / 2, w / 2, Math.PI, 0); ctx.lineTo(w / 2, 0); ctx.closePath();
      ink(ctx, o.sky || '#bfe6f5', 3.6);
      // outside hint
      ctx.save(); ctx.clip();
      for (let i = 0; i < 4; i++) { circle(ctx, -w * 0.4 + i * w * 0.3, -h * 0.55 + (i % 2) * 26, 26); ink(ctx, alpha('#ffffff', 0.5), 0); }
      rrect(ctx, -w / 2, -34, w, 34, 0); ink(ctx, o.ground || '#9fd0a8', 0);
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -h + w / 2);
      ctx.arc(0, -h + w / 2, w / 2, Math.PI, 0); ctx.lineTo(w / 2, 0); ctx.closePath();
      ink(ctx, null, 4.5);
      line(ctx, 0, -2, 0, -h + 4, frame, 7);
      line(ctx, -w / 2 + 3, -h * 0.52, w / 2 - 3, -h * 0.52, frame, 7);
      rrect(ctx, -w / 2 - 10, -10, w + 20, 14, 5); ink(ctx, frame, 3.4);
      if (o.curtain) {
        for (const sgn of [-1, 1]) {
          const ex = sgn * (w / 2 + 6);
          ctx.beginPath();
          ctx.moveTo(ex, -h + 4);
          ctx.quadraticCurveTo(ex - sgn * 34, -h * 0.62, ex - sgn * 20, -8);
          ctx.lineTo(ex, -8);
          ctx.closePath();
          ink(ctx, o.curtain, 3.2);
          for (let i = 1; i <= 2; i++) {
            const k = i / 3;
            ctx.beginPath();
            ctx.moveTo(ex - sgn * 30 * k, -h + 10);
            ctx.quadraticCurveTo(ex - sgn * (34 * k + 4), -h * 0.6, ex - sgn * 18 * k, -12);
            ctx.lineWidth = 2; ctx.strokeStyle = alpha(darken(o.curtain, 0.3), 0.6); ctx.stroke();
          }
        }
        rrect(ctx, -w / 2 - 14, -h - 2, w + 28, 9, 4); ink(ctx, P.walnut, 3);
      }
    },
  },

  door_arch: {
    w: 140, h: 220,
    draw(ctx, o) {
      const w = o.w || 120, h = o.h || 206, c = C(o, P.red);
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -h + w / 2);
      ctx.arc(0, -h + w / 2, w / 2, Math.PI, 0); ctx.lineTo(w / 2, 0); ctx.closePath();
      ink(ctx, c, 4);
      rrect(ctx, -w / 2 + 14, -h + 22, w - 28, 52, 8); ink(ctx, o.sky || '#bfe6f5', 3);
      circle(ctx, w / 2 - 20, -h * 0.42, 5); ink(ctx, P.brass, 2.4);
      rrect(ctx, -w / 2 - 8, -12, w + 16, 14, 4); ink(ctx, darken(c, 0.3), 3);
    },
  },

  awning: {
    w: 260, h: 74,
    draw(ctx, o) {
      const w = o.w || 240, a = C(o, P.red), b = o.c2 || P.cream;
      const n = Math.max(4, Math.round(w / 34));
      const sw = w / n;
      ctx.beginPath();
      ctx.moveTo(-w / 2, -62);
      ctx.lineTo(w / 2, -62);
      ctx.lineTo(w / 2 + 8, -14);
      for (let i = n; i >= 0; i--) {
        const x = -w / 2 - 8 + (i / n) * (w + 16);
        ctx.quadraticCurveTo(x + sw / 2, -2, x, -14);
      }
      ctx.closePath();
      ink(ctx, a, 3.4);
      ctx.save(); ctx.clip();
      for (let i = 0; i < n; i += 2) {
        const x = -w / 2 - 8 + (i / n) * (w + 16);
        rect(ctx, x, -64, sw, 70); ink(ctx, b, 0);
      }
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(-w / 2, -62); ctx.lineTo(w / 2, -62); ctx.lineTo(w / 2 + 8, -14);
      for (let i = n; i >= 0; i--) {
        const x = -w / 2 - 8 + (i / n) * (w + 16);
        ctx.quadraticCurveTo(x + sw / 2, -2, x, -14);
      }
      ctx.closePath(); ink(ctx, null, 3.4);
    },
  },

  sign_hanging: {
    w: 130, h: 110,
    draw(ctx, o) {
      const c = C(o, P.mint), w = o.w || 116;
      line(ctx, -w / 2 + 10, -104, -w / 2 + 10, -76, INK, 3);
      line(ctx, w / 2 - 10, -104, w / 2 - 10, -76, INK, 3);
      rrect(ctx, -w / 2, -76, w, 52, 9); ink(ctx, c, 3.4);
      rrect(ctx, -w / 2 + 6, -70, w - 12, 40, 6); ink(ctx, lighten(c, 0.3), 2.2);
      if (o.label) text(ctx, o.label, 0, -50, o.fs || 19, INK, 600);
    },
  },

  chalkboard: {
    w: 118, h: 180,
    draw(ctx, o) {
      const c = C(o, P.walnut);
      shadow(ctx, 0, -2, 46, 9);
      poly(ctx, [[-42, 0], [-24, -150], [-14, -150], [-30, 0]]); ink(ctx, c, 3);
      poly(ctx, [[42, 0], [24, -150], [14, -150], [30, 0]]); ink(ctx, c, 3);
      rrect(ctx, -50, -158, 100, 118, 7); ink(ctx, c, 3.4);
      rrect(ctx, -42, -150, 84, 102, 4); ink(ctx, '#3b4a45', 2.6);
      for (let i = 0; i < 4; i++) line(ctx, -32 + (i % 2) * 6, -134 + i * 22, 30 - (i % 3) * 10, -134 + i * 22, alpha('#fff8ee', 0.7), 2.6);
      if (o.label) text(ctx, o.label, 0, -140, 15, '#fff8ee', 600);
    },
  },

  /* ------------------------------------------------------------ lights */

  lamp_pendant: {
    w: 76, h: 150, ceiling: true,
    draw(ctx, o, t) {
      const c = C(o, P.amber), drop = o.drop || 90, r = o.r || 30;
      const sway = Math.sin((t || 0) * 0.7 + (o.x || 0) * 0.01) * 0.03;
      ctx.rotate(sway);
      line(ctx, 0, 0, 0, drop, INK, 3);
      ctx.beginPath();
      ctx.moveTo(-r, drop + 22);
      ctx.quadraticCurveTo(-r * 0.9, drop - 6, 0, drop - 8);
      ctx.quadraticCurveTo(r * 0.9, drop - 6, r, drop + 22);
      ctx.closePath();
      ink(ctx, c, 3.2);
      oval(ctx, 0, drop + 22, r, r * 0.24); ink(ctx, lighten(c, 0.45), 3);
      if (o.on !== false) {
        circle(ctx, 0, drop + 26, 7); ink(ctx, P.butter, 0);
        glow(ctx, 0, drop + 30, r * 3.4, o.light || P.butter, 0.3);
      }
    },
  },

  lantern: {
    w: 46, h: 86, ceiling: true,
    draw(ctx, o, t) {
      const c = C(o, '#ef6b5e'), r = o.r || 18, drop = o.drop || 26;
      const sway = Math.sin((t || 0) * 0.9 + (o.x || 0) * 0.02) * 0.06;
      ctx.rotate(sway);
      line(ctx, 0, 0, 0, drop, INK, 2.4);
      rrect(ctx, -r * 0.5, drop, r, 6, 2); ink(ctx, darken(c, 0.35), 2.4);
      oval(ctx, 0, drop + 6 + r * 0.95, r, r * 0.95); ink(ctx, c, 3);
      for (let i = -1; i <= 1; i++) {
        const x = i * r * 0.55;
        ctx.beginPath();
        ctx.moveTo(x, drop + 8);
        ctx.quadraticCurveTo(x * 1.25, drop + 6 + r, x, drop + 6 + r * 1.85);
        ctx.lineWidth = 1.6; ctx.strokeStyle = alpha(darken(c, 0.4), 0.55); ctx.stroke();
      }
      rrect(ctx, -r * 0.4, drop + 6 + r * 1.8, r * 0.8, 6, 2); ink(ctx, darken(c, 0.35), 2.4);
      line(ctx, 0, drop + 6 + r * 1.95, 0, drop + 6 + r * 2.5, P.gold, 2.4);
      glow(ctx, 0, drop + 6 + r, r * 3.3, o.light || '#ffb35c', 0.4);
    },
  },

  floor_lamp: {
    w: 62, h: 190,
    draw(ctx, o) {
      const c = C(o, P.butter), h = o.h || 172;
      shadow(ctx, 0, -2, 22, 7);
      oval(ctx, 0, -6, 20, 7); ink(ctx, P.metalDark, 3);
      rrect(ctx, -3, -h, 6, h - 4, 3); ink(ctx, P.metalDark, 2.6);
      poly(ctx, [[-26, -h + 40], [26, -h + 40], [18, -h], [-18, -h]]); ink(ctx, c, 3.2);
      glow(ctx, 0, -h + 38, 104, P.butter, 0.26);
    },
  },

  candle: {
    w: 22, h: 46,
    draw(ctx, o, t) {
      const c = C(o, P.cream);
      rrect(ctx, -6, -30, 12, 30, 3); ink(ctx, c, 2.4);
      const f = 1 + Math.sin((t || 0) * 9 + (o.x || 0)) * 0.14;
      ctx.save(); ctx.translate(0, -32); ctx.scale(1, f);
      curve(ctx, [[0, -13], [4, -4], [0, 2], [-4, -4]]); ink(ctx, P.gold, 0);
      curve(ctx, [[0, -8], [2, -3], [0, 1], [-2, -3]]); ink(ctx, '#fff3c4', 0);
      ctx.restore();
      glow(ctx, 0, -36, 46, P.butter, 0.3);
    },
  },

  string_lights: {
    w: 10, h: 10, span: true,
    draw(ctx, o, t) {
      const dx = o.x2 - o.x, dy = (o.y2 || o.y) - o.y, sag = o.sag || 46;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dx / 2, dy / 2 + sag * 2, dx, dy);
      ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.stroke();
      const n = o.n || Math.max(4, Math.round(Math.hypot(dx, dy) / 56));
      for (let i = 1; i < n; i++) {
        const k = i / n, mk = 1 - k;
        const x = mk * mk * 0 + 2 * mk * k * (dx / 2) + k * k * dx;
        const y = mk * mk * 0 + 2 * mk * k * (dy / 2 + sag * 2) + k * k * dy;
        const tw = 0.75 + 0.25 * Math.sin((t || 0) * 2.6 + i * 1.7);
        circle(ctx, x, y + 7, 5.2); ink(ctx, o.c || P.butter, 2);
        if (i % 2) glow(ctx, x, y + 7, 40, o.light || P.gold, 0.3 * tw);
      }
    },
  },

  bunting: {
    w: 10, h: 10, span: true,
    draw(ctx, o) {
      const dx = o.x2 - o.x, dy = (o.y2 || o.y) - o.y, sag = o.sag || 26;
      const cols = o.cols || [P.red, P.amber, P.mint, P.sky, P.lilac];
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.quadraticCurveTo(dx / 2, dy / 2 + sag * 2, dx, dy);
      ctx.lineWidth = 2.2; ctx.strokeStyle = INK; ctx.stroke();
      const n = o.n || Math.max(5, Math.round(Math.hypot(dx, dy) / 44));
      for (let i = 0; i <= n; i++) {
        const k = i / n, mk = 1 - k;
        const x = 2 * mk * k * (dx / 2) + k * k * dx;
        const y = 2 * mk * k * (dy / 2 + sag * 2) + k * k * dy;
        poly(ctx, [[x - 11, y], [x + 11, y], [x, y + 26]]);
        ink(ctx, cols[i % cols.length], 2.2);
      }
    },
  },


  cat_bed: {
    w: 88, h: 44,
    draw(ctx, o) {
      const c = C(o, '#e0846b');
      shadow(ctx, 0, -2, 36, 8);
      oval(ctx, 0, -14, 40, 18); ink(ctx, c, 3.2);
      oval(ctx, 0, -18, 29, 12); ink(ctx, lighten(c, 0.34), 2.8);
    },
  },

  plant_stand: {
    w: 70, h: 96,
    draw(ctx, o) {
      const c = C(o, P.walnut), h = o.h || 80;
      shadow(ctx, 0, -2, 24, 7);
      for (const lx of [-18, 0, 18]) line(ctx, lx * 0.5, -h, lx, -2, c, 5);
      oval(ctx, 0, -h, 26, 9); ink(ctx, lighten(c, 0.2), 3.2);
      line(ctx, -14, -h * 0.45, 14, -h * 0.45, darken(c, 0.2), 3.4);
    },
  },

  coat_rack: {
    w: 96, h: 230,
    draw(ctx, o) {
      const c = C(o, P.walnut), h = o.h || 210;
      shadow(ctx, 0, -2, 26, 7);
      for (const lx of [-20, 0, 20]) line(ctx, lx * 0.6, -h * 0.2, lx, -2, c, 5);
      rrect(ctx, -5, -h, 10, h - 30, 4); ink(ctx, c, 3);
      for (const s of [-1, 1]) {
        line(ctx, 0, -h + 14, s * 22, -h + 26, c, 5);
        circle(ctx, s * 24, -h + 28, 4); ink(ctx, P.brass, 2);
      }
      if (o.coat) {
        ctx.beginPath();
        ctx.moveTo(-20, -h + 26);
        ctx.quadraticCurveTo(-34, -h * 0.6, -24, -h * 0.34);
        ctx.lineTo(-4, -h * 0.34);
        ctx.quadraticCurveTo(-6, -h * 0.7, -16, -h + 24);
        ctx.closePath();
        ink(ctx, o.coat, 3);
      }
      if (o.hat) { oval(ctx, 24, -h + 22, 17, 6); ink(ctx, o.hat, 2.6); rrect(ctx, 15, -h + 6, 18, 17, 6); ink(ctx, o.hat, 2.6); }
    },
  },

  wall_shelf: {
    w: 130, h: 64,
    draw(ctx, o) {
      const c = C(o, P.walnut), w = o.w || 118, seed = (o.seed || 1) * 53;
      rrect(ctx, -w / 2, -8, w, 9, 3); ink(ctx, c, 3);
      poly(ctx, [[-w / 2 + 8, 1], [-w / 2 + 20, 1], [-w / 2 + 8, 16]]); ink(ctx, darken(c, 0.2), 2.4);
      poly(ctx, [[w / 2 - 8, 1], [w / 2 - 20, 1], [w / 2 - 8, 16]]); ink(ctx, darken(c, 0.2), 2.4);
      let x = -w / 2 + 10;
      let i = 0;
      while (x < w / 2 - 18) {
        const k = hash01(seed + i);
        if (k < 0.2) { x += 10 + k * 14; i++; continue; }
        if (k < 0.62) {
          const bw = 7 + k * 7, bh = 20 + k * 16;
          rrect(ctx, x, -8 - bh, bw, bh, 2);
          ink(ctx, ['#e8615a', '#f2b23e', '#7fc7a6', '#5a8fd6', '#c9a6e8'][Math.floor(k * 5)], 2);
          x += bw + 2;
        } else {
          poly(ctx, [[x, -8], [x + 15, -8], [x + 13, -25], [x + 2, -25]]);
          ink(ctx, ['#fff2df', '#8fd0c4', '#f4a2b4'][Math.floor(k * 3)], 2.2);
          oval(ctx, x + 7.5, -25, 6.5, 2.4); ink(ctx, '#8a5a35', 1.8);
          x += 20;
        }
        i++;
      }
    },
  },

  magazine_rack: {
    w: 76, h: 74,
    draw(ctx, o) {
      const c = C(o, P.oak);
      shadow(ctx, 0, -2, 28, 7);
      poly(ctx, [[-30, -44], [30, -44], [24, 0], [-24, 0]]); ink(ctx, c, 3);
      for (let i = 0; i < 4; i++) {
        rrect(ctx, -24 + i * 13, -62 + (i % 2) * 6, 12, 26, 2);
        ink(ctx, ['#e8615a', '#f2b23e', '#7fc7a6', '#8ad7ff'][i], 2.2);
      }
    },
  },

  stacked_chairs: {
    w: 70, h: 150,
    draw(ctx, o) {
      const c = C(o, P.mint);
      shadow(ctx, 0, -2, 26, 8);
      for (let i = 0; i < 3; i++) {
        const y = -i * 26;
        rrect(ctx, -20, y - 96, 40, 54, 11); ink(ctx, i % 2 ? c : lighten(c, 0.14), 3);
        rrect(ctx, -24, y - 48, 48, 12, 5); ink(ctx, lighten(c, 0.24), 2.8);
      }
      for (const lx of [-18, 18]) { rrect(ctx, lx - 4, -44, 8, 44, 3); ink(ctx, darken(c, 0.3), 2.8); }
    },
  },

  /* --------------------------------------------------------- shop gear */

  espresso_machine: {
    w: 108, h: 92,
    draw(ctx, o, t) {
      const c = C(o, '#c8453f');
      rrect(ctx, -48, -78, 96, 78, 8); ink(ctx, c, 3.4);
      rrect(ctx, -40, -70, 80, 30, 5); ink(ctx, lighten(c, 0.24), 2.6);
      rrect(ctx, -52, -92, 104, 18, 6); ink(ctx, P.metalDark, 3.2);
      for (const dx of [-22, 22]) {
        rrect(ctx, dx - 7, -38, 14, 18, 3); ink(ctx, P.metal, 2.4);
        rrect(ctx, dx - 13, -20, 26, 6, 2); ink(ctx, P.metalDark, 2.2);
      }
      circle(ctx, 0, -55, 9); ink(ctx, P.brass, 2.4);
      circle(ctx, 0, -55, 4); ink(ctx, P.cream, 1.6);
      for (const dx of [-34, 34]) { circle(ctx, dx, -58, 5); ink(ctx, P.gold, 2); }
      const s = 0.6 + 0.4 * Math.sin((t || 0) * 2);
      ctx.globalAlpha = 0.35 * s;
      circle(ctx, -22, -100, 9); ink(ctx, '#ffffff', 0);
      circle(ctx, 24, -104, 7); ink(ctx, '#ffffff', 0);
      ctx.globalAlpha = 1;
    },
  },

  register: {
    w: 76, h: 70,
    draw(ctx, o) {
      const c = C(o, P.mint);
      rrect(ctx, -34, -46, 68, 46, 6); ink(ctx, c, 3.2);
      rrect(ctx, -28, -74, 46, 32, 5); ink(ctx, lighten(c, 0.2), 3);
      rrect(ctx, -22, -68, 34, 16, 3); ink(ctx, '#3b4a45', 2.2);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { circle(ctx, -22 + j * 11, -34 + i * 11, 3.4); ink(ctx, lighten(c, 0.45), 1.6); }
    },
  },

  pastry_case: {
    w: 170, h: 120,
    draw(ctx, o) {
      const w = o.w || 156;
      rrect(ctx, -w / 2, -30, w, 30, 4); ink(ctx, C(o, P.walnut), 3.2);
      rrect(ctx, -w / 2, -104, w, 76, 6); ink(ctx, alpha('#cfeefb', 0.55), 3.4);
      line(ctx, -w / 2 + 4, -66, w / 2 - 4, -66, alpha(P.cream, 0.9), 4);
      const seed = (o.seed || 1) * 31;
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < 4; i++) {
          const x = -w / 2 + 22 + i * (w - 44) / 3, y = -70 + row * 36;
          const k = hash01(seed + row * 7 + i);
          if (k < 0.18) continue;
          if (k < 0.5) { oval(ctx, x, y - 5, 11, 8); ink(ctx, ['#f5c98a', '#f0a05a', '#e8615a'][Math.floor(k * 6) % 3], 2.2); oval(ctx, x, y - 9, 6, 3.4); ink(ctx, P.rose, 1.6); }
          else if (k < 0.78) { rrect(ctx, x - 10, y - 14, 20, 14, 3); ink(ctx, '#f6d9a8', 2.2); rrect(ctx, x - 10, y - 18, 20, 6, 2); ink(ctx, P.rose, 1.8); }
          else { circle(ctx, x, y - 7, 8); ink(ctx, '#f2b23e', 2.2); circle(ctx, x, y - 7, 3); ink(ctx, lighten('#f2b23e', 0.5), 1.6); }
        }
      }
      sheen(ctx, -w / 2 + 14, -98, 9, 58, 0.4);
    },
  },

  cat_tower: {
    w: 120, h: 240,
    draw(ctx, o) {
      const c = C(o, '#d9c3a5');
      shadow(ctx, 0, -2, 44, 10);
      rrect(ctx, -44, -18, 88, 18, 6); ink(ctx, c, 3.2);
      rrect(ctx, -13, -132, 26, 118, 6); ink(ctx, lighten(c, 0.1), 3);
      for (let y = -128; y < -20; y += 11) line(ctx, -13, y, 13, y, alpha(darken(c, 0.25), 0.5), 1.6);
      rrect(ctx, -40, -166, 80, 36, 9); ink(ctx, c, 3.2);
      circle(ctx, 0, -148, 16); ink(ctx, darken(c, 0.4), 2.6);
      rrect(ctx, -34, -206, 68, 16, 6); ink(ctx, lighten(c, 0.16), 3.2);
      rrect(ctx, -9, -190, 18, 26, 5); ink(ctx, lighten(c, 0.05), 3);
      circle(ctx, 26, -180, 9); ink(ctx, P.rose, 2.4);
      line(ctx, 26, -190, 26, -206, INK, 2);
    },
  },

  stall: {
    w: 330, h: 230,
    draw(ctx, o) {
      const w = o.w || 300, c = C(o, P.walnut);
      shadow(ctx, 0, -2, w * 0.5, 12);
      for (const lx of [-w / 2 + 12, w / 2 - 12]) { rrect(ctx, lx - 6, -196, 12, 196, 4); ink(ctx, c, 3.2); }
      rrect(ctx, -w / 2, -96, w, 18, 5); ink(ctx, darken(c, 0.15), 3);   // counter shelf
      rrect(ctx, -w / 2 + 6, -78, w - 12, 74, 4); ink(ctx, darken(c, 0.3), 3);
      for (let x = -w / 2 + 16; x < w / 2 - 16; x += 26) line(ctx, x, -76, x, -6, alpha(darken(c, 0.5), 0.7), 2);
      rrect(ctx, -w / 2 - 10, -112, w + 20, 20, 6); ink(ctx, o.top || lighten(c, 0.34), 3.4);
      rrect(ctx, -w / 2 - 14, -210, w + 28, 18, 6); ink(ctx, darken(c, 0.2), 3.2);
    },
  },

  cart: {
    w: 200, h: 150,
    draw(ctx, o) {
      const c = C(o, P.teal), w = o.w || 180;
      shadow(ctx, 0, -6, w * 0.46, 10);
      for (const dx of [-w / 3, w / 3]) {
        circle(ctx, dx, -26, 26); ink(ctx, '#5a4a5f', 3.4);
        circle(ctx, dx, -26, 19); ink(ctx, darken(c, 0.28), 2.6);
        for (let i = 0; i < 4; i++) {
          const a = i * Math.PI / 4;
          line(ctx, dx - Math.cos(a) * 17, -26 - Math.sin(a) * 17, dx + Math.cos(a) * 17, -26 + Math.sin(a) * 17, '#8a7a92', 2.6);
        }
        circle(ctx, dx, -26, 6); ink(ctx, '#d9cbb4', 2.2);
      }
      rrect(ctx, -w / 2, -96, w, 62, 8); ink(ctx, c, 3.4);
      rrect(ctx, -w / 2 + 10, -86, w - 20, 40, 5); ink(ctx, lighten(c, 0.22), 2.6);
      rrect(ctx, -w / 2 - 8, -112, w + 16, 18, 6); ink(ctx, lighten(c, 0.46), 3.2);
      rrect(ctx, w / 2 - 4, -120, 10, 30, 4); ink(ctx, darken(c, 0.3), 2.6);
    },
  },

  post: {
    w: 26, h: 210,
    draw(ctx, o) {
      const c = C(o, P.walnut), h = o.h || 190;
      shadow(ctx, 0, -2, 14, 6);
      rrect(ctx, -8, -h, 16, h, 4); ink(ctx, c, 3);
      rrect(ctx, -11, -h - 8, 22, 10, 3); ink(ctx, lighten(c, 0.2), 3);
    },
  },

  fence: {
    w: 120, h: 74,
    draw(ctx, o) {
      const c = C(o, P.oak), w = o.w || 110;
      for (let x = -w / 2; x <= w / 2 - 12; x += 22) {
        poly(ctx, [[x, 0], [x, -52], [x + 6, -62], [x + 12, -52], [x + 12, 0]]);
        ink(ctx, c, 2.6);
      }
      rrect(ctx, -w / 2 - 3, -40, w + 6, 7, 2); ink(ctx, darken(c, 0.16), 2.4);
    },
  },

  planter_box: {
    w: 140, h: 60,
    draw(ctx, o) {
      const c = C(o, '#b9754a'), w = o.w || 128;
      shadow(ctx, 0, -2, w * 0.5, 8);
      poly(ctx, [[-w / 2, -44], [w / 2, -44], [w / 2 - 6, 0], [-w / 2 + 6, 0]]); ink(ctx, c, 3.2);
      rrect(ctx, -w / 2 - 4, -52, w + 8, 12, 4); ink(ctx, lighten(c, 0.2), 3);
      oval(ctx, 0, -46, w / 2 - 8, 7); ink(ctx, '#5b4433', 0);
    },
  },

  work_bench: {
    w: 240, h: 106,
    draw(ctx, o) {
      const c = C(o, P.oak), w = o.w || 220;
      shadow(ctx, 0, -2, w * 0.5, 11);
      for (const lx of [-w / 2 + 12, w / 2 - 12]) { rrect(ctx, lx - 6, -86, 12, 86, 3); ink(ctx, darken(c, 0.28), 3); }
      rrect(ctx, -w / 2 + 6, -40, w - 12, 9, 3); ink(ctx, darken(c, 0.18), 2.6);
      rrect(ctx, -w / 2, -100, w, 18, 5); ink(ctx, lighten(c, 0.2), 3.4);
      rrect(ctx, -w / 2 + 6, -96, w - 12, 7, 3); ink(ctx, lighten(c, 0.36), 0);
    },
  },

  rug: {
    w: 300, h: 160, flat: true,
    draw(ctx, o) {
      const c = C(o, '#e0705f'), w = o.w || 280, h = o.h || 150;
      oval(ctx, 0, 0, w / 2, h / 2); ink(ctx, c, 3.4);
      oval(ctx, 0, 0, w / 2 - 14, h / 2 - 9); ink(ctx, lighten(c, 0.22), 2.6);
      oval(ctx, 0, 0, w / 2 - 34, h / 2 - 22); ink(ctx, c, 2.6);
      oval(ctx, 0, 0, w / 2 - 54, h / 2 - 34); ink(ctx, lighten(c, 0.34), 2.6);
    },
  },

  mat: {
    w: 170, h: 86, flat: true,
    draw(ctx, o) {
      const c = C(o, '#c9a227'), w = o.w || 150, h = o.h || 74;
      rrect(ctx, -w / 2, -h / 2, w, h, 10); ink(ctx, c, 3);
      rrect(ctx, -w / 2 + 8, -h / 2 + 6, w - 16, h - 12, 6); ink(ctx, lighten(c, 0.2), 2.2);
      ctx.save();
      rrect(ctx, -w / 2 + 8, -h / 2 + 6, w - 16, h - 12, 6);
      ctx.clip();
      for (let x = -w / 2; x < w / 2; x += 13) line(ctx, x, -h / 2, x + 8, h / 2, alpha(darken(c, 0.3), 0.35), 2);
      for (let y = -h / 2; y < h / 2; y += 11) line(ctx, -w / 2, y, w / 2, y + 5, alpha(lighten(c, 0.4), 0.3), 2);
      ctx.restore();
      for (const sx of [-1, 1]) for (let i = 0; i < 5; i++) {
        line(ctx, sx * w / 2, -h / 2 + 8 + i * ((h - 16) / 4), sx * (w / 2 + 7), -h / 2 + 8 + i * ((h - 16) / 4), darken(c, 0.2), 2.4);
      }
    },
  },

  puddle: {
    w: 130, h: 60, flat: true,
    draw(ctx, o) {
      const c = C(o, '#7fb6d6');
      curve(ctx, [[-58, 0], [-24, -22], [26, -18], [58, 2], [18, 20], [-26, 16]]);
      ink(ctx, alpha(c, 0.55), 0);
      curve(ctx, [[-40, -2], [-14, -12], [14, -8]]);
      ink(ctx, null, 2, alpha('#ffffff', 0.5));
    },
  },
};
