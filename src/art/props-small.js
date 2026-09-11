/* Tabletop clutter: food, drink, stationery, the small stuff that makes a
 * scene feel lived-in — and that hidden objects can hide among. */

import {
  INK, rrect, circle, oval, poly, curve, line, limb, ink, shadow,
  lighten, darken, alpha, sheen, text, rect,
} from '../core/draw.js';
import { P } from './palette.js';
import { hash01 } from '../core/rng.js';

const C = (o, f) => o.c || f;

export const SMALL = {
  cup: {
    w: 26, h: 26,
    draw(ctx, o, t) {
      const c = C(o, P.cream);
      oval(ctx, 0, -1, 11, 3.6); ink(ctx, alpha(INK, 0.16), 0);
      poly(ctx, [[-9, -19], [9, -19], [7, -2], [-7, -2]]); ink(ctx, c, 2.6);
      oval(ctx, 0, -19, 9, 3.4); ink(ctx, o.fill || '#8a5a35', 2.4);
      ctx.beginPath(); ctx.arc(10, -12, 5.5, -1.2, 1.2); ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.stroke();
      if (o.steam !== false) {
        ctx.save(); ctx.globalAlpha = 0.32;
        for (let i = 0; i < 2; i++) {
          const ph = (t || 0) * 1.1 + i * 1.6;
          const y = -22 - ((ph % 2) / 2) * 20;
          circle(ctx, Math.sin(ph * 2) * 3 + i * 3 - 2, y, 3.2 + (i ? 1 : 0)); ink(ctx, '#ffffff', 0);
        }
        ctx.restore();
      }
    },
  },

  mug: {
    w: 28, h: 28,
    draw(ctx, o) {
      const c = C(o, P.sky);
      rrect(ctx, -9, -21, 18, 21, 4); ink(ctx, c, 2.6);
      ctx.beginPath(); ctx.arc(11, -12, 5.5, -1.3, 1.3); ctx.lineWidth = 2.6; ctx.strokeStyle = INK; ctx.stroke();
      oval(ctx, 0, -21, 8.6, 3.2); ink(ctx, o.fill || '#6b4226', 2.2);
      line(ctx, -6, -14, 6, -14, alpha(lighten(c, 0.5), 0.9), 2);
    },
  },

  teapot: {
    w: 46, h: 38,
    draw(ctx, o) {
      const c = C(o, P.mint);
      oval(ctx, 0, -14, 16, 13); ink(ctx, c, 3);
      ctx.beginPath(); ctx.moveTo(-14, -18); ctx.quadraticCurveTo(-24, -22, -21, -6); ctx.lineWidth = 3.4; ctx.strokeStyle = INK; ctx.stroke();
      ctx.beginPath(); ctx.arc(17, -16, 7, -1.4, 1.4); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
      oval(ctx, 0, -26, 8, 3.4); ink(ctx, lighten(c, 0.24), 2.4);
      circle(ctx, 0, -30, 3.4); ink(ctx, P.brass, 2);
      oval(ctx, -5, -18, 5, 3.6, -0.5); ink(ctx, alpha('#ffffff', 0.55), 0);
    },
  },

  plate: {
    w: 34, h: 12,
    draw(ctx, o) {
      const c = C(o, P.paper);
      oval(ctx, 0, -4, 16, 6); ink(ctx, c, 2.4);
      oval(ctx, 0, -5, 10, 3.4); ink(ctx, darken(c, 0.06), 1.6);
    },
  },

  cake: {
    w: 34, h: 30,
    draw(ctx, o) {
      const c = C(o, '#f6d9a8');
      poly(ctx, [[-14, -2], [14, -2], [10, -22], [-10, -22]]); ink(ctx, c, 2.6);
      poly(ctx, [[-11, -20], [11, -20], [9, -27], [-9, -27]]); ink(ctx, o.icing || P.rose, 2.4);
      circle(ctx, 0, -30, 3.6); ink(ctx, P.red, 2);
      line(ctx, -10, -12, 10, -12, alpha(darken(c, 0.3), 0.6), 2);
    },
  },

  donut: {
    w: 26, h: 18,
    draw(ctx, o) {
      const c = C(o, '#e8a05a');
      oval(ctx, 0, -8, 12, 9); ink(ctx, c, 2.6);
      curve(ctx, [[-11, -11], [-4, -15], [5, -10], [11, -13], [10, -5], [-2, -8], [-10, -5]]);
      ink(ctx, o.icing || P.rose, 2.2);
      oval(ctx, 0, -8, 4, 3); ink(ctx, '#fff8ee', 2);
      for (let i = 0; i < 5; i++) { const a = i * 1.3; line(ctx, Math.cos(a) * 7, -9 + Math.sin(a) * 4, Math.cos(a) * 7 + 3, -9 + Math.sin(a) * 4 + 1, [P.mint, P.sky, P.butter, P.red, P.lilac][i], 2); }
    },
  },

  croissant: {
    w: 30, h: 18,
    draw(ctx, o) {
      const c = C(o, '#e6b063');
      ctx.beginPath(); ctx.arc(0, -2, 12, Math.PI * 1.12, Math.PI * 1.88);
      limb(ctx, c, 9, 2.5);
      for (let i = -1; i <= 1; i++) line(ctx, i * 6, -12, i * 6, -8, alpha(darken(c, 0.3), 0.7), 1.8);
    },
  },

  macaron: {
    w: 20, h: 14,
    draw(ctx, o) {
      const c = C(o, P.rose);
      oval(ctx, 0, -10, 8, 4.4); ink(ctx, c, 2.2);
      oval(ctx, 0, -4, 8, 4.4); ink(ctx, c, 2.2);
      rect(ctx, -7, -7.5, 14, 3.2); ink(ctx, lighten(c, 0.5), 0);
    },
  },

  bowl: {
    w: 34, h: 24,
    draw(ctx, o) {
      const c = C(o, P.paper);
      ctx.beginPath(); ctx.arc(0, -12, 14, 0, Math.PI); ctx.closePath(); ink(ctx, c, 2.8);
      oval(ctx, 0, -12, 14, 4.6); ink(ctx, o.fill || '#f0c27a', 2.4);
      if (o.noodles) {
        for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(i * 4, -13, 4, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 1.8; ctx.strokeStyle = '#f6e0a8'; ctx.stroke(); }
        circle(ctx, 6, -14, 3.4); ink(ctx, P.red, 1.8);
        poly(ctx, [[-8, -18], [-2, -20], [-4, -14]]); ink(ctx, P.pine, 1.8);
        line(ctx, -10, -30, 8, -13, '#d9a76c', 2.4);
        line(ctx, -6, -31, 11, -14, '#d9a76c', 2.4);
      }
    },
  },

  jar: {
    w: 26, h: 34,
    draw(ctx, o) {
      const c = C(o, '#cfeefb');
      rrect(ctx, -9, -26, 18, 26, 4); ink(ctx, alpha(c, 0.75), 2.6);
      rrect(ctx, -8, -16, 16, 15, 3); ink(ctx, o.fill || P.amber, 0);
      rrect(ctx, -10, -31, 20, 6, 2); ink(ctx, o.lid || P.red, 2.4);
      sheen(ctx, -6, -23, 3, 14, 0.5);
    },
  },

  bottle: {
    w: 20, h: 44,
    draw(ctx, o) {
      const c = C(o, P.jade);
      poly(ctx, [[-8, 0], [-8, -22], [-3, -30], [-3, -38], [3, -38], [3, -30], [8, -22], [8, 0]]);
      ink(ctx, alpha(c, 0.85), 2.6);
      rrect(ctx, -4, -42, 8, 5, 2); ink(ctx, o.lid || P.red, 2);
      sheen(ctx, -5, -20, 2.6, 14, 0.45);
    },
  },

  stack_books: {
    w: 46, h: 36,
    draw(ctx, o) {
      const seed = (o.seed || 1) * 17;
      const cols = [P.red, P.amber, P.mint, P.sky, P.lilac, P.coral];
      const n = o.n || 3;
      let y = 0;
      for (let i = 0; i < n; i++) {
        const k = hash01(seed + i);
        const w = 30 + k * 14, h = 7 + k * 4;
        rrect(ctx, -w / 2 + (k - 0.5) * 5, y - h, w, h, 2); ink(ctx, cols[Math.floor(k * 6) % 6], 2.4);
        line(ctx, -w / 2 + (k - 0.5) * 5 + 3, y - h / 2, w / 2 + (k - 0.5) * 5 - 3, y - h / 2, alpha('#fff8ee', 0.5), 1.4);
        y -= h;
      }
    },
  },

  book_open: {
    w: 44, h: 20, flat: true,
    draw(ctx, o) {
      const c = C(o, P.paper);
      poly(ctx, [[-20, 0], [-2, -5], [-2, 3], [-20, 7]]); ink(ctx, c, 2.4);
      poly(ctx, [[20, 0], [2, -5], [2, 3], [20, 7]]); ink(ctx, c, 2.4);
      for (let i = 0; i < 3; i++) { line(ctx, -16, -1 + i * 2.6, -6, -3 + i * 2.6, alpha(INK, 0.35), 1.2); line(ctx, 6, -3 + i * 2.6, 16, -1 + i * 2.6, alpha(INK, 0.35), 1.2); }
    },
  },

  paper_stack: {
    w: 34, h: 14, flat: true,
    draw(ctx, o) {
      for (let i = 0; i < 3; i++) { rrect(ctx, -15 + i * 2, -4 - i * 3, 30, 8, 1.5); ink(ctx, P.paper, 2); }
    },
  },

  laptop: {
    w: 48, h: 34,
    draw(ctx, o) {
      const c = C(o, P.metal);
      poly(ctx, [[-22, 0], [22, 0], [18, -5], [-18, -5]]); ink(ctx, c, 2.4);
      rrect(ctx, -17, -30, 34, 26, 3); ink(ctx, darken(c, 0.15), 2.6);
      rrect(ctx, -14, -27, 28, 20, 2); ink(ctx, o.screen || '#8ad7ff', 1.8);
      line(ctx, -10, -22, 6, -22, alpha('#ffffff', 0.7), 1.6);
      line(ctx, -10, -18, 2, -18, alpha('#ffffff', 0.5), 1.6);
    },
  },

  vase_flowers: {
    w: 44, h: 62,
    draw(ctx, o) {
      const c = C(o, P.sky);
      const seed = (o.seed || 2) * 23;
      for (let i = 0; i < 5; i++) {
        const k = hash01(seed + i);
        const ax = (i - 2) * 6 + (k - 0.5) * 5, ay = -34 - k * 22;
        ctx.beginPath(); ctx.moveTo(0, -24); ctx.quadraticCurveTo(ax * 0.5, -34, ax, ay);
        ctx.lineWidth = 2.4; ctx.strokeStyle = P.jade; ctx.stroke();
        const col = [P.rose, P.butter, P.red, P.lilac, P.coral][i % 5];
        for (let p = 0; p < 5; p++) { const a = (p / 5) * Math.PI * 2; circle(ctx, ax + Math.cos(a) * 4.4, ay + Math.sin(a) * 4.4, 3.6); ink(ctx, col, 1.8); }
        circle(ctx, ax, ay, 3); ink(ctx, P.gold, 1.6);
      }
      poly(ctx, [[-10, -26], [10, -26], [7, 0], [-7, 0]]); ink(ctx, alpha(c, 0.85), 2.8);
      oval(ctx, 0, -26, 10, 3.6); ink(ctx, darken(c, 0.1), 2.2);
    },
  },

  menu_card: {
    w: 24, h: 32,
    draw(ctx, o) {
      rrect(ctx, -9, -28, 18, 28, 2.4); ink(ctx, P.paper, 2.4);
      for (let i = 0; i < 4; i++) line(ctx, -5, -22 + i * 5, 5, -22 + i * 5, alpha(INK, 0.4), 1.4);
      poly(ctx, [[-9, 0], [9, 0], [4, 5], [-4, 5]]); ink(ctx, darken(P.paper, 0.12), 2);
    },
  },

  napkin_holder: {
    w: 26, h: 22,
    draw(ctx, o) {
      rrect(ctx, -11, -14, 22, 14, 2); ink(ctx, C(o, P.metal), 2.4);
      for (let i = 0; i < 3; i++) { poly(ctx, [[-7 + i * 5, -14], [-3 + i * 5, -20], [1 + i * 5, -14]]); ink(ctx, P.paper, 1.8); }
    },
  },

  skewers: {
    w: 34, h: 30,
    draw(ctx, o) {
      for (let i = -1; i <= 1; i++) {
        const x = i * 9;
        line(ctx, x, 0, x + i * 2, -28, '#d9a76c', 2.4);
        for (let j = 0; j < 3; j++) { circle(ctx, x + i * 1.2, -8 - j * 7, 4.4); ink(ctx, ['#c96a4a', '#e0a94e', '#c96a4a'][j], 2); }
      }
    },
  },

  steamer: {
    w: 52, h: 44,
    draw(ctx, o, t) {
      const c = C(o, '#dcb075');
      for (let i = 0; i < 3; i++) { rrect(ctx, -22 + i, -12 - i * 11, 44 - i * 2, 12, 3); ink(ctx, i === 2 ? lighten(c, 0.18) : c, 2.6); }
      oval(ctx, 0, -45, 21, 5); ink(ctx, lighten(c, 0.3), 2.6);
      ctx.save(); ctx.globalAlpha = 0.3;
      for (let i = 0; i < 3; i++) { const ph = (t || 0) * 0.9 + i * 2; circle(ctx, (i - 1) * 9 + Math.sin(ph * 2) * 4, -50 - ((ph % 2.4) / 2.4) * 26, 5 + i); ink(ctx, '#ffffff', 0); }
      ctx.restore();
    },
  },

  fruit_crate: {
    w: 74, h: 50,
    draw(ctx, o) {
      const c = C(o, '#d9a76c'), seed = (o.seed || 5) * 13;
      const fruit = o.fruit || [P.red, P.amber, P.jade];
      for (let i = 0; i < 7; i++) {
        const k = hash01(seed + i);
        circle(ctx, -24 + (i % 4) * 16 + (k - 0.5) * 5, -34 - Math.floor(i / 4) * 10, 8);
        ink(ctx, fruit[Math.floor(k * fruit.length)], 2.2);
      }
      poly(ctx, [[-32, -32], [32, -32], [28, 0], [-28, 0]]); ink(ctx, c, 3);
      line(ctx, -30, -20, 30, -20, alpha(darken(c, 0.3), 0.8), 2.4);
    },
  },

  lamp_table: {
    w: 40, h: 54,
    draw(ctx, o) {
      const c = C(o, P.butter);
      oval(ctx, 0, -3, 11, 4); ink(ctx, P.metalDark, 2.4);
      rrect(ctx, -2.5, -30, 5, 28, 2); ink(ctx, P.metalDark, 2.2);
      poly(ctx, [[-16, -30], [16, -30], [11, -50], [-11, -50]]); ink(ctx, c, 2.8);
    },
  },

  radio: {
    w: 44, h: 32,
    draw(ctx, o) {
      const c = C(o, '#c96a4a');
      rrect(ctx, -19, -26, 38, 26, 5); ink(ctx, c, 2.8);
      circle(ctx, -8, -13, 8); ink(ctx, darken(c, 0.4), 2.2);
      for (let i = 0; i < 3; i++) circle(ctx, -8, -13, 3 + i * 2.4);
      ink(ctx, null, 1.2, alpha('#fff8ee', 0.4));
      circle(ctx, 9, -17, 3.4); ink(ctx, P.gold, 2);
      circle(ctx, 9, -8, 3.4); ink(ctx, P.gold, 2);
      line(ctx, 14, -26, 21, -42, P.metalDark, 2.2);
    },
  },

  suitcase: {
    w: 56, h: 42,
    draw(ctx, o) {
      const c = C(o, '#a9713f');
      rrect(ctx, -25, -34, 50, 34, 5); ink(ctx, c, 3);
      line(ctx, -25, -20, 25, -20, darken(c, 0.3), 3);
      rrect(ctx, -7, -40, 14, 8, 3); ink(ctx, null, 3);
      circle(ctx, -12, -20, 2.6); ink(ctx, P.brass, 1.8);
      circle(ctx, 12, -20, 2.6); ink(ctx, P.brass, 1.8);
    },
  },

  umbrella_stand: {
    w: 44, h: 90,
    draw(ctx, o) {
      const c = C(o, P.metalDark);
      shadow(ctx, 0, -2, 18, 6);
      poly(ctx, [[-15, -46], [15, -46], [12, 0], [-12, 0]]); ink(ctx, c, 3);
      for (let i = -1; i <= 1; i++) {
        const x = i * 6;
        line(ctx, x, -44, x + i * 4, -84, [P.red, P.sky, P.pine][i + 1], 3.4);
        ctx.beginPath(); ctx.arc(x + i * 4 - 4, -84, 4, 0, Math.PI); ctx.lineWidth = 2.6; ctx.strokeStyle = INK; ctx.stroke();
      }
    },
  },

  sack: {
    w: 52, h: 56,
    draw(ctx, o) {
      const c = C(o, '#cdb48a');
      shadow(ctx, 0, -2, 22, 7);
      curve(ctx, [[-22, 0], [-18, -34], [-8, -44], [8, -44], [18, -34], [22, 0]]); ink(ctx, c, 3);
      line(ctx, -9, -44, 9, -44, darken(c, 0.35), 3);
      if (o.spill) { oval(ctx, 16, -4, 10, 4); ink(ctx, o.spill, 2); }
    },
  },

  tool_hook: {
    w: 40, h: 46,
    draw(ctx, o) {
      const kind = o.v || 0;
      if (kind === 0) { // trowel
        line(ctx, 0, -6, 0, -26, '#8a5a35', 3.4);
        poly(ctx, [[-7, -26], [7, -26], [0, -44]]); ink(ctx, P.metal, 2.6);
      } else if (kind === 1) { // shears
        line(ctx, -4, -8, -1, -30, P.metal, 3);
        line(ctx, 4, -8, 1, -30, P.metal, 3);
        circle(ctx, -5, -5, 4.4); ink(ctx, P.red, 2.2);
        circle(ctx, 5, -5, 4.4); ink(ctx, P.red, 2.2);
      } else { // watering can silhouette on a hook
        rrect(ctx, -12, -26, 24, 22, 5); ink(ctx, P.metal, 2.6);
        line(ctx, -12, -22, -24, -12, P.metal, 3);
      }
    },
  },

  watering_can: {
    w: 56, h: 44,
    draw(ctx, o) {
      const c = C(o, '#7fb0c7');
      shadow(ctx, 0, -2, 20, 6);
      rrect(ctx, -17, -30, 34, 30, 7); ink(ctx, c, 3);
      ctx.beginPath(); ctx.moveTo(17, -26); ctx.quadraticCurveTo(31, -24, 29, -8);
      limb(ctx, c, 4.4, 2);
      circle(ctx, 30, -6, 5); ink(ctx, darken(c, 0.2), 2.4);
      ctx.beginPath(); ctx.arc(-6, -32, 9, Math.PI * 1.05, Math.PI * 1.95); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
    },
  },

  wheelbarrow: {
    w: 110, h: 66,
    draw(ctx, o) {
      const c = C(o, '#d1603f');
      shadow(ctx, 0, -3, 40, 8);
      circle(ctx, -28, -16, 14); ink(ctx, P.charcoal, 3);
      circle(ctx, -28, -16, 5); ink(ctx, P.bone, 2);
      poly(ctx, [[-44, -52], [34, -46], [26, -18], [-32, -22]]); ink(ctx, c, 3.2);
      line(ctx, 30, -46, 52, -34, '#8a5a35', 4);
      line(ctx, 8, -20, 30, -6, P.metalDark, 3);
      if (o.fill) { oval(ctx, -6, -50, 24, 8); ink(ctx, o.fill, 2.4); }
    },
  },

  seed_tray: {
    w: 60, h: 24,
    draw(ctx, o) {
      const c = C(o, '#8a5a35');
      rrect(ctx, -26, -14, 52, 14, 3); ink(ctx, c, 2.6);
      for (let i = 0; i < 4; i++) {
        circle(ctx, -18 + i * 12, -16, 5); ink(ctx, '#4b3a2a', 2);
        for (let j = 0; j < 2; j++) { curve(ctx, [[-18 + i * 12, -19], [-15 + i * 12 - j * 6, -25], [-18 + i * 12, -21]]); ink(ctx, P.jade, 1.6); }
      }
    },
  },

  clipboard: {
    w: 26, h: 34,
    draw(ctx, o) {
      rrect(ctx, -11, -30, 22, 30, 2.4); ink(ctx, '#c99a5e', 2.6);
      rrect(ctx, -9, -27, 18, 24, 1.8); ink(ctx, P.paper, 2);
      rrect(ctx, -4, -33, 8, 5, 2); ink(ctx, P.metal, 2);
      for (let i = 0; i < 3; i++) line(ctx, -5, -21 + i * 5, 5, -21 + i * 5, alpha(INK, 0.4), 1.4);
    },
  },

  parcel: {
    w: 40, h: 34,
    draw(ctx, o) {
      const c = C(o, '#d9b98a');
      rrect(ctx, -17, -28, 34, 28, 3); ink(ctx, c, 2.8);
      line(ctx, 0, -28, 0, 0, '#c96a4a', 2.6);
      line(ctx, -17, -14, 17, -14, '#c96a4a', 2.6);
      poly(ctx, [[-5, -30], [0, -26], [5, -30], [0, -34]]); ink(ctx, '#c96a4a', 2);
    },
  },


  yarn_ball: {
    w: 30, h: 26,
    draw(ctx, o) {
      const c = C(o, '#e35d9b');
      circle(ctx, 0, -11, 11); ink(ctx, c, 2.6);
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.ellipse(0, -11, 10, 4.5, i * 0.9, 0, Math.PI * 2);
        ctx.lineWidth = 1.4; ctx.strokeStyle = alpha(darken(c, 0.35), 0.7); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(9, -6);
      ctx.quadraticCurveTo(20, -2, 15, 2);
      ctx.lineWidth = 2; ctx.strokeStyle = c; ctx.stroke();
    },
  },

  stack_cups: {
    w: 30, h: 40,
    draw(ctx, o) {
      const c = C(o, P.cream);
      for (let i = 0; i < 3; i++) {
        const y = -i * 9;
        poly(ctx, [[-9, y - 16], [9, y - 16], [7.5, y], [-7.5, y]]); ink(ctx, i % 2 ? c : lighten(c, 0.1), 2.4);
      }
      oval(ctx, 0, -34, 9, 3.4); ink(ctx, darken(c, 0.08), 2);
    },
  },

  tip_jar: {
    w: 30, h: 38,
    draw(ctx, o) {
      rrect(ctx, -11, -30, 22, 30, 4); ink(ctx, alpha('#cfeefb', 0.7), 2.6);
      for (let i = 0; i < 4; i++) { circle(ctx, -5 + (i % 3) * 5, -6 - Math.floor(i / 3) * 5, 3.4); ink(ctx, P.brass, 1.6); }
      rrect(ctx, -9, -24, 18, 7, 2); ink(ctx, P.paper, 1.8);
    },
  },

  cat_toy: {
    w: 26, h: 22,
    draw(ctx, o) {
      const c = C(o, '#5a8fd6');
      circle(ctx, 0, -8, 8); ink(ctx, c, 2.4);
      for (let i = 0; i < 4; i++) { const a = i * 0.8 - 1.2; line(ctx, 0, -8, Math.cos(a) * 13, -8 + Math.sin(a) * 13, P.amber, 2); }
    },
  },

  bell_jar: {
    w: 40, h: 50,
    draw(ctx, o) {
      const c = '#cfeefb';
      rrect(ctx, -17, -8, 34, 8, 3); ink(ctx, '#8a5a35', 2.6);
      ctx.beginPath(); ctx.moveTo(-15, -8); ctx.lineTo(-15, -30);
      ctx.quadraticCurveTo(-15, -44, 0, -44); ctx.quadraticCurveTo(15, -44, 15, -30);
      ctx.lineTo(15, -8); ctx.closePath(); ink(ctx, alpha(c, 0.45), 2.8);
      if (o.inside) { circle(ctx, 0, -24, 7); ink(ctx, o.inside, 2.2); }
      sheen(ctx, -9, -34, 3, 16, 0.5);
    },
  },
};
