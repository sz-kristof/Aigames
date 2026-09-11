/* The findable items. Each is small, distinctly silhouetted, and carries the
 * name shown on the dock plus a tint used for its celebration burst. */

import {
  INK, rrect, circle, oval, poly, curve, line, ink,
  lighten, darken, alpha, sheen, text,
} from '../core/draw.js';
import { P } from './palette.js';

const F = (name, tint, w, h, draw) => ({ name, tint, w, h, find: true, draw });

export const FINDS = {
  pocket_watch: F('Pocket watch', P.gold, 30, 34, (ctx, o, t) => {
    ctx.beginPath(); ctx.moveTo(2, -22); ctx.quadraticCurveTo(12, -28, 14, -34);
    ctx.lineWidth = 2.2; ctx.strokeStyle = P.brass; ctx.stroke();
    circle(ctx, 0, -12, 11); ink(ctx, P.gold, 2.6);
    circle(ctx, 0, -12, 7.5); ink(ctx, P.paper, 1.8);
    rrect(ctx, -2.5, -25, 5, 4, 1.5); ink(ctx, P.brass, 1.8);
    const a = (t || 0) * 0.8;
    line(ctx, 0, -12, Math.cos(a) * 5, -12 + Math.sin(a) * 5, INK, 1.6);
    line(ctx, 0, -12, Math.cos(-1.2) * 4, -12 + Math.sin(-1.2) * 4, INK, 1.8);
  }),

  spectacles: F('Spectacles', P.sky, 38, 20, (ctx) => {
    for (const dx of [-9, 9]) { circle(ctx, dx, -9, 7.5); ink(ctx, alpha('#cfeefb', 0.6), 2.4); }
    line(ctx, -2, -10, 2, -10, P.brass, 2.2);
    line(ctx, -16, -11, -22, -14, P.brass, 2);
    line(ctx, 16, -11, 22, -14, P.brass, 2);
  }),

  mitten: F('Red mitten', P.red, 26, 32, (ctx, o) => {
    const c = o.c || '#e0514c';
    curve(ctx, [[-8, -4], [-9, -20], [-3, -27], [5, -25], [7, -14], [8, -4]]); ink(ctx, c, 2.6);
    curve(ctx, [[7, -16], [14, -18], [12, -9], [7, -8]]); ink(ctx, c, 2.4);
    rrect(ctx, -9, -8, 18, 7, 2.5); ink(ctx, lighten(c, 0.3), 2.4);
    line(ctx, -4, -22, 2, -22, alpha('#fff8ee', 0.6), 1.6);
  }),

  camera: F('Old camera', P.charcoal, 40, 28, (ctx) => {
    rrect(ctx, -17, -22, 34, 22, 4); ink(ctx, '#4a4258', 2.6);
    rrect(ctx, -8, -27, 16, 6, 2); ink(ctx, '#5f5670', 2.2);
    circle(ctx, 2, -11, 8); ink(ctx, P.metalDark, 2.4);
    circle(ctx, 2, -11, 4.4); ink(ctx, '#2a3b52', 1.8);
    circle(ctx, 0, -13, 1.8); ink(ctx, alpha('#ffffff', 0.8), 0);
    circle(ctx, -11, -18, 2.6); ink(ctx, P.red, 1.6);
  }),

  keyring: F('Ring of keys', P.brass, 34, 30, (ctx) => {
    circle(ctx, 0, -22, 6.5); ink(ctx, null, 2.4, P.brass);
    for (let i = -1; i <= 1; i++) {
      ctx.save(); ctx.translate(i * 5, -17); ctx.rotate(i * 0.5);
      rrect(ctx, -1.6, 0, 3.2, 16, 1); ink(ctx, i === 0 ? P.gold : P.metal, 1.8);
      rrect(ctx, 1, 9, 4, 3, 1); ink(ctx, i === 0 ? P.gold : P.metal, 1.4);
      rrect(ctx, 1, 13, 3, 2.6, 1); ink(ctx, i === 0 ? P.gold : P.metal, 1.4);
      ctx.restore();
    }
  }),

  music_box: F('Music box', P.plum, 34, 28, (ctx) => {
    rrect(ctx, -15, -16, 30, 16, 3); ink(ctx, '#9d63b5', 2.6);
    rrect(ctx, -15, -22, 30, 7, 3); ink(ctx, lighten('#9d63b5', 0.2), 2.4);
    line(ctx, 15, -19, 21, -19, P.brass, 2.2);
    circle(ctx, 22, -19, 2.6); ink(ctx, P.brass, 1.8);
    circle(ctx, 0, -8, 3.4); ink(ctx, P.gold, 1.8);
  }),

  teddy: F('Tiny teddy', '#c9883f', 30, 34, (ctx) => {
    const c = '#c9883f';
    circle(ctx, -8, -26, 4.6); ink(ctx, c, 2);
    circle(ctx, 8, -26, 4.6); ink(ctx, c, 2);
    circle(ctx, 0, -22, 9); ink(ctx, lighten(c, 0.12), 2.4);
    oval(ctx, 0, -19, 4.6, 3.4); ink(ctx, P.bone, 1.6);
    circle(ctx, -3, -24, 1.4); ink(ctx, INK, 0);
    circle(ctx, 3, -24, 1.4); ink(ctx, INK, 0);
    circle(ctx, 0, -20, 1.6); ink(ctx, INK, 0);
    rrect(ctx, -8, -14, 16, 14, 6); ink(ctx, c, 2.4);
    circle(ctx, -9, -8, 4); ink(ctx, c, 2);
    circle(ctx, 9, -8, 4); ink(ctx, c, 2);
  }),

  locket: F('Silver locket', '#cfd8e3', 24, 32, (ctx) => {
    ctx.beginPath(); ctx.arc(0, -22, 9, Math.PI * 0.15, Math.PI * 0.85, true);
    ctx.lineWidth = 1.8; ctx.strokeStyle = '#9fb0c4'; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -4); ctx.bezierCurveTo(-11, -14, -5, -21, 0, -16);
    ctx.bezierCurveTo(5, -21, 11, -14, 0, -4);
    ink(ctx, '#dfe7ef', 2.4);
    circle(ctx, 0, -12, 2); ink(ctx, P.sky, 1.4);
  }),

  compass: F('Brass compass', P.brass, 30, 28, (ctx, o, t) => {
    circle(ctx, 0, -13, 12); ink(ctx, P.brass, 2.8);
    circle(ctx, 0, -13, 8.5); ink(ctx, P.paper, 1.8);
    const a = Math.sin((t || 0) * 0.6) * 0.4 - 1.2;
    poly(ctx, [[Math.cos(a) * 7, -13 + Math.sin(a) * 7], [3, -11], [-Math.cos(a) * 7, -13 - Math.sin(a) * 7], [-3, -15]]);
    ink(ctx, P.red, 1.4);
    rrect(ctx, -2, -27, 4, 4, 1.4); ink(ctx, darken(P.brass, 0.2), 1.6);
  }),

  paintbrush: F('Paintbrush', '#c96a4a', 30, 32, (ctx) => {
    ctx.save(); ctx.rotate(-0.4);
    rrect(ctx, -2, -26, 4, 20, 2); ink(ctx, '#c96a4a', 2);
    rrect(ctx, -3, -8, 6, 5, 1.4); ink(ctx, P.metal, 1.8);
    poly(ctx, [[-3, -3], [3, -3], [2, 6], [-2, 6]]); ink(ctx, P.plum, 2);
    ctx.restore();
  }),

  harmonica: F('Harmonica', '#b9c4cf', 34, 18, (ctx) => {
    rrect(ctx, -15, -12, 30, 12, 2.4); ink(ctx, '#c8d2dc', 2.4);
    rrect(ctx, -15, -9, 30, 6, 1.5); ink(ctx, '#7f8c9b', 1.8);
    for (let i = -4; i <= 4; i++) line(ctx, i * 3, -9, i * 3, -3, alpha(INK, 0.5), 1.2);
  }),

  seashell: F('Seashell', '#f6c6b6', 30, 24, (ctx) => {
    const c = '#f6c6b6';
    ctx.beginPath(); ctx.moveTo(0, -2);
    ctx.arc(0, -2, 13, Math.PI, 0); ctx.closePath(); ink(ctx, c, 2.6);
    for (let i = -2; i <= 2; i++) {
      const a = Math.PI + (i + 2.5) * (Math.PI / 5);
      line(ctx, 0, -2, Math.cos(a) * 12, -2 + Math.sin(a) * 12, alpha(darken(c, 0.35), 0.7), 1.6);
    }
  }),

  ticket: F('Paper ticket', P.butter, 30, 18, (ctx) => {
    ctx.save(); ctx.rotate(-0.18);
    rrect(ctx, -14, -10, 28, 12, 2); ink(ctx, '#ffe6a0', 2.2);
    line(ctx, 3, -10, 3, 2, alpha(INK, 0.45), 1.4);
    line(ctx, -10, -6, -1, -6, alpha(INK, 0.5), 1.4);
    line(ctx, -10, -2, -3, -2, alpha(INK, 0.4), 1.4);
    ctx.restore();
  }),

  ring_jewel: F('Jewelled ring', P.teal, 22, 24, (ctx) => {
    circle(ctx, 0, -8, 7); ink(ctx, null, 2.6, P.gold);
    poly(ctx, [[0, -24], [5, -18], [0, -13], [-5, -18]]); ink(ctx, P.teal, 2);
    line(ctx, -2, -19, 1, -17, alpha('#ffffff', 0.8), 1.2);
  }),

  hairpin: F('Flower hairpin', P.magenta, 26, 22, (ctx) => {
    line(ctx, -11, -4, 11, -9, P.metal, 2.4);
    for (let p = 0; p < 5; p++) { const a = (p / 5) * Math.PI * 2; circle(ctx, -6 + Math.cos(a) * 4.6, -12 + Math.sin(a) * 4.6, 3.6); ink(ctx, P.magenta, 1.8); }
    circle(ctx, -6, -12, 2.6); ink(ctx, P.gold, 1.4);
  }),

  thimble: F('Thimble', '#c9cfd6', 20, 20, (ctx) => {
    ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-6, -10);
    ctx.quadraticCurveTo(0, -17, 6, -10); ctx.lineTo(7, 0); ctx.closePath();
    ink(ctx, '#c9cfd6', 2.4);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) circle(ctx, -3 + j * 3, -12 + i * 3, 0.8);
    ink(ctx, alpha(INK, 0.5), 0);
  }),

  postcard: F('Postcard', P.sky, 34, 24, (ctx) => {
    ctx.save(); ctx.rotate(0.12);
    rrect(ctx, -15, -20, 30, 20, 2); ink(ctx, P.paper, 2.4);
    rrect(ctx, -13, -18, 15, 16, 1.5); ink(ctx, '#9fd8ef', 1.8);
    poly(ctx, [[-13, -6], [-7, -14], [-1, -6]]); ink(ctx, '#6aa87a', 0);
    circle(ctx, -4, -14, 2.4); ink(ctx, P.gold, 0);
    for (let i = 0; i < 3; i++) line(ctx, 4, -15 + i * 4, 12, -15 + i * 4, alpha(INK, 0.45), 1.2);
    ctx.restore();
  }),

  marble: F('Glass marble', '#7fd4e8', 18, 18, (ctx) => {
    circle(ctx, 0, -8, 8); ink(ctx, alpha('#9fe4f2', 0.9), 2.4);
    curve(ctx, [[-4, -4], [0, -12], [4, -4], [0, -8]]); ink(ctx, P.magenta, 1.6);
    circle(ctx, -3, -11, 1.8); ink(ctx, alpha('#ffffff', 0.9), 0);
  }),

  origami: F('Paper crane', P.paper, 34, 26, (ctx) => {
    poly(ctx, [[-15, -6], [-2, -14], [4, -6], [-4, -2]]); ink(ctx, '#fff8ee', 2.2);
    poly(ctx, [[-2, -14], [10, -22], [8, -10], [4, -6]]); ink(ctx, '#ffe2ea', 2.2);
    poly(ctx, [[4, -6], [16, -10], [10, -1]]); ink(ctx, '#fff8ee', 2.2);
    line(ctx, -15, -6, -21, -12, INK, 2);
  }),

  magnifier: F('Magnifying glass', '#c8d2dc', 32, 34, (ctx) => {
    ctx.save(); ctx.rotate(0.5);
    circle(ctx, 0, -20, 10); ink(ctx, alpha('#cfeefb', 0.55), 2.8);
    rrect(ctx, -2.5, -11, 5, 15, 2.4); ink(ctx, '#a9713f', 2.4);
    sheen(ctx, -5, -25, 2.6, 8, 0.6);
    ctx.restore();
  }),

  snowglobe: F('Snow globe', '#bfe6f5', 32, 34, (ctx, o, t) => {
    rrect(ctx, -11, -9, 22, 9, 3); ink(ctx, '#8a5a35', 2.4);
    circle(ctx, 0, -21, 12); ink(ctx, alpha('#d7f0fa', 0.7), 2.8);
    poly(ctx, [[-4, -14], [0, -28], [4, -14]]); ink(ctx, '#4f9c5d', 1.8);
    for (let i = 0; i < 4; i++) {
      const ph = (t || 0) * 0.7 + i * 1.7;
      circle(ctx, Math.sin(ph) * 7, -30 + ((ph * 5) % 16), 1.4);
      ink(ctx, alpha('#ffffff', 0.9), 0);
    }
  }),

  bell: F('Little bell', P.gold, 24, 26, (ctx) => {
    ctx.beginPath(); ctx.moveTo(-9, -4); ctx.quadraticCurveTo(-9, -20, 0, -22);
    ctx.quadraticCurveTo(9, -20, 9, -4); ctx.closePath(); ink(ctx, P.gold, 2.6);
    rrect(ctx, -10, -5, 20, 4, 2); ink(ctx, darken(P.gold, 0.15), 2);
    circle(ctx, 0, 0, 2.4); ink(ctx, P.brass, 1.6);
    circle(ctx, 0, -24, 2.4); ink(ctx, P.brass, 1.6);
  }),

  whistle: F('Tin whistle', '#d5dce4', 32, 16, (ctx) => {
    ctx.save(); ctx.rotate(-0.12);
    rrect(ctx, -14, -10, 24, 8, 4); ink(ctx, '#d5dce4', 2.4);
    poly(ctx, [[10, -10], [16, -8], [10, -2]]); ink(ctx, '#b9c4cf', 2);
    circle(ctx, -8, -6, 2); ink(ctx, INK, 0);
    ctx.restore();
  }),

  notebook: F('Little notebook', P.indigo, 28, 28, (ctx) => {
    ctx.save(); ctx.rotate(-0.1);
    rrect(ctx, -11, -20, 22, 20, 2.4); ink(ctx, '#5158a8', 2.4);
    rrect(ctx, -8, -19, 17, 18, 1.6); ink(ctx, P.paper, 1.6);
    for (let i = 0; i < 3; i++) line(ctx, -5, -15 + i * 4, 6, -15 + i * 4, alpha(INK, 0.35), 1.2);
    rrect(ctx, -12, -20, 4, 20, 1.5); ink(ctx, darken('#5158a8', 0.2), 1.8);
    ctx.restore();
  }),

  odd_sock: F('Odd sock', P.mint, 28, 30, (ctx) => {
    const c = '#79c9b0';
    curve(ctx, [[-5, -26], [5, -26], [6, -10], [16, -6], [14, 0], [-6, -2]]); ink(ctx, c, 2.6);
    for (let i = 0; i < 3; i++) line(ctx, -5, -22 + i * 5, 5.4, -22 + i * 5, alpha('#fff8ee', 0.65), 1.8);
  }),

  star_charm: F('Star charm', P.gold, 26, 28, (ctx, o, t) => {
    const sp = Math.sin((t || 0) * 1.5) * 0.12;
    ctx.save(); ctx.translate(0, -14); ctx.rotate(sp);
    const pts = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i / 10) * Math.PI * 2; const r = i % 2 ? 4.4 : 10; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    poly(ctx, pts); ink(ctx, P.gold, 2.4);
    ctx.restore();
    line(ctx, 0, -24, 0, -28, P.brass, 1.8);
  }),

  fountain_pen: F('Fountain pen', '#2f6b8f', 34, 26, (ctx) => {
    ctx.save(); ctx.rotate(-0.55);
    rrect(ctx, -2.6, -24, 5.2, 20, 2.4); ink(ctx, '#2f6b8f', 2.2);
    poly(ctx, [[-2.6, -4], [2.6, -4], [0, 4]]); ink(ctx, P.gold, 1.8);
    line(ctx, 0, -2, 0, 2, INK, 1);
    rrect(ctx, 2.4, -20, 2.4, 8, 1); ink(ctx, P.gold, 1.4);
    ctx.restore();
  }),

  photo: F('Faded photo', P.bone, 30, 28, (ctx) => {
    ctx.save(); ctx.rotate(0.2);
    rrect(ctx, -13, -22, 26, 22, 1.8); ink(ctx, '#fff8ee', 2.4);
    rrect(ctx, -10, -19, 20, 13, 1.2); ink(ctx, '#d9c9a8', 1.6);
    circle(ctx, -3, -14, 3.4); ink(ctx, '#b79a72', 1.4);
    poly(ctx, [[1, -7], [6, -15], [10, -7]]); ink(ctx, '#a98d68', 0);
    ctx.restore();
  }),

  button_brass: F('Brass button', P.brass, 20, 18, (ctx) => {
    circle(ctx, 0, -8, 8); ink(ctx, P.brass, 2.4);
    circle(ctx, 0, -8, 5); ink(ctx, null, 1.4, alpha(INK, 0.5));
    circle(ctx, -2, -10, 1.4); ink(ctx, INK, 0);
    circle(ctx, 2, -10, 1.4); ink(ctx, INK, 0);
    circle(ctx, -2, -6, 1.4); ink(ctx, INK, 0);
    circle(ctx, 2, -6, 1.4); ink(ctx, INK, 0);
  }),

  toy_boat: F('Toy boat', P.red, 34, 26, (ctx) => {
    poly(ctx, [[-15, -6], [15, -6], [11, 0], [-11, 0]]); ink(ctx, '#e0514c', 2.4);
    line(ctx, 0, -6, 0, -24, '#a9713f', 2.2);
    poly(ctx, [[1, -23], [12, -10], [1, -10]]); ink(ctx, P.paper, 2.2);
    poly(ctx, [[-1, -21], [-9, -10], [-1, -10]]); ink(ctx, '#ffe6a0', 2.2);
  }),

  spinning_top: F('Spinning top', P.magenta, 26, 28, (ctx, o, t) => {
    const w = 1 + Math.sin((t || 0) * 3) * 0.06;
    ctx.save(); ctx.scale(w, 1);
    poly(ctx, [[-11, -16], [11, -16], [0, 0]]); ink(ctx, P.magenta, 2.4);
    oval(ctx, 0, -16, 11, 4); ink(ctx, lighten(P.magenta, 0.3), 2.2);
    rrect(ctx, -2, -24, 4, 8, 2); ink(ctx, '#a9713f', 2);
    ctx.restore();
  }),
};
