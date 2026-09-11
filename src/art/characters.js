/* Cats and people. These are the only props that move under their own steam,
 * so they carry their own pose/blink/step maths rather than being static art. */

import {
  INK, rrect, circle, oval, poly, curve, line, limb, ink, shadow,
  lighten, darken, alpha,
} from '../core/draw.js';
import { P } from './palette.js';
import { hash01 } from '../core/rng.js';

/* ------------------------------------------------------------------ cats */

const CAT_COATS = {
  ginger: { body: P.ginger, belly: '#ffd7a8', stripe: '#d97f3c' },
  tabby: { body: P.tabby, belly: '#e7d3bd', stripe: '#8d6a4e' },
  sooty: { body: P.sooty, belly: '#8f8898', stripe: '#453f52' },
  snow: { body: P.snow, belly: '#ffffff', stripe: '#e6d8c6' },
  tuxedo: { body: P.tuxedo, belly: '#fdf6ec', stripe: '#2b2536' },
  siamese: { body: P.siamese, belly: '#fff4e2', stripe: '#9c7b5d' },
  blue: { body: '#9fb0c4', belly: '#d9e3ec', stripe: '#7d8ea3' },
  calico: { body: '#f4e6d2', belly: '#fffaf2', stripe: '#e08a4a' },
};

function eyes(ctx, x, y, open, colour = INK, spacing = 7) {
  if (open > 0.25) {
    for (const s of [-1, 1]) {
      oval(ctx, x + s * spacing, y, 2.4, 2.6 * open);
      ink(ctx, colour, 0);
    }
  } else {
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.arc(x + s * spacing, y, 3.2, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.lineWidth = 1.8; ctx.strokeStyle = colour; ctx.stroke();
    }
  }
}

function catFace(ctx, x, y, coat, open, mood) {
  eyes(ctx, x, y, open);
  poly(ctx, [[x - 2.6, y + 4.5], [x + 2.6, y + 4.5], [x, y + 6.8]]);
  ink(ctx, '#e79ba6', 0);
  ctx.beginPath();
  ctx.moveTo(x - 3.6, y + 8.2); ctx.quadraticCurveTo(x, y + 6.4, x, y + 7);
  ctx.quadraticCurveTo(x, y + 6.4, x + 3.6, y + 8.2);
  ctx.lineWidth = 1.4; ctx.strokeStyle = INK; ctx.stroke();
  for (const s of [-1, 1]) for (let i = 0; i < 2; i++) {
    line(ctx, x + s * 6, y + 5 + i * 2.4, x + s * 15, y + 3 + i * 4, alpha(INK, 0.55), 1.1);
  }
  if (mood === 'happy') { circle(ctx, x - 11, y + 3, 2.6); ink(ctx, alpha('#ff9aa8', 0.5), 0); circle(ctx, x + 11, y + 3, 2.6); ink(ctx, alpha('#ff9aa8', 0.5), 0); }
}

function catEars(ctx, x, y, coat, twitch) {
  for (const s of [-1, 1]) {
    ctx.save(); ctx.translate(x + s * 9, y - 7); ctx.rotate(s * twitch);
    poly(ctx, [[-6, 2], [s * 2, -11], [6, 3]]); ink(ctx, coat.body, 2.4);
    poly(ctx, [[-3, 1], [s * 1.5, -6], [3, 1.5]]); ink(ctx, '#f0a6b0', 0);
    ctx.restore();
  }
}

export const CATS = {
  cat_sit: {
    w: 54, h: 62, actor: true,
    draw(ctx, o, t) {
      const coat = CAT_COATS[o.coat || 'ginger'];
      const ph = t + (o.seed || 0);
      const breathe = Math.sin(ph * 1.6) * 0.8;
      const open = o.asleep ? 0 : (Math.sin(ph * 0.9 + 1.3) > 0.965 ? 0 : 1);
      const twitch = Math.sin(ph * 2.2) > 0.94 ? 0.25 : 0;
      shadow(ctx, 0, -2, 20, 6);
      // tail
      ctx.beginPath();
      ctx.moveTo(12, -10);
      ctx.quadraticCurveTo(30 + Math.sin(ph * 1.4) * 8, -16 - Math.sin(ph * 1.4) * 6, 26 + Math.sin(ph * 1.4) * 6, -34);
      limb(ctx, coat.body, 7.5);
      // body
      ctx.beginPath();
      ctx.moveTo(-13, 0); ctx.quadraticCurveTo(-15, -26 + breathe, -6, -32 + breathe);
      ctx.lineTo(8, -32 + breathe); ctx.quadraticCurveTo(16, -24, 14, 0); ctx.closePath();
      ink(ctx, coat.body, 2.8);
      oval(ctx, 1, -10, 8, 11); ink(ctx, coat.belly, 0);
      oval(ctx, -8, -1, 6, 3.4); ink(ctx, coat.belly, 2);
      oval(ctx, 6, -1, 6, 3.4); ink(ctx, coat.belly, 2);
      if (o.stripes !== false) for (let i = 0; i < 3; i++) line(ctx, -12 + i * 2, -24 + i * 7, -4 + i * 2, -26 + i * 7, alpha(coat.stripe, 0.75), 2.4);
      // head
      const hy = -42 + breathe;
      catEars(ctx, 0, hy, coat, twitch);
      circle(ctx, 0, hy, 14); ink(ctx, coat.body, 2.8);
      oval(ctx, 0, hy + 5, 8, 6); ink(ctx, coat.belly, 0);
      catFace(ctx, 0, hy - 1, coat, open, o.mood);
      if (o.collar) { ctx.beginPath(); ctx.arc(0, hy + 11, 11, 0.25, Math.PI - 0.25); ctx.lineWidth = 3.4; ctx.strokeStyle = o.collar; ctx.stroke(); circle(ctx, 0, hy + 21, 2.8); ink(ctx, P.gold, 1.6); }
    },
  },

  cat_loaf: {
    w: 56, h: 38, actor: true,
    draw(ctx, o, t) {
      const coat = CAT_COATS[o.coat || 'tabby'];
      const ph = t + (o.seed || 0);
      const breathe = Math.sin(ph * 1.2) * 0.7;
      const open = o.asleep ? 0 : (Math.sin(ph * 0.7 + 2.1) > 0.96 ? 0 : 1);
      shadow(ctx, 0, -2, 24, 6);
      ctx.beginPath();
      ctx.moveTo(-24, 0); ctx.quadraticCurveTo(-26, -20 - breathe, -8, -22 - breathe);
      ctx.quadraticCurveTo(16, -23, 22, -10); ctx.lineTo(22, 0); ctx.closePath();
      ink(ctx, coat.body, 2.8);
      ctx.beginPath(); ctx.moveTo(20, -4);
      ctx.quadraticCurveTo(34, -2 + Math.sin(ph * 1.1) * 5, 26, 2);
      limb(ctx, coat.body, 6.5);
      const hx = -20, hy = -26 - breathe;
      catEars(ctx, hx, hy, coat, 0);
      circle(ctx, hx, hy, 12.5); ink(ctx, coat.body, 2.8);
      oval(ctx, hx, hy + 4, 7, 5.4); ink(ctx, coat.belly, 0);
      catFace(ctx, hx, hy - 1, coat, open, o.mood);
      if (o.stripes !== false) for (let i = 0; i < 3; i++) line(ctx, -2 + i * 7, -20, 2 + i * 7, -14, alpha(coat.stripe, 0.7), 2.4);
    },
  },

  cat_sleep: {
    w: 60, h: 32, actor: true,
    draw(ctx, o, t) {
      const coat = CAT_COATS[o.coat || 'snow'];
      const ph = t + (o.seed || 0);
      const breathe = Math.sin(ph * 0.9) * 1.1;
      shadow(ctx, 0, -2, 26, 6);
      circle(ctx, 0, -17 - breathe * 0.4, 20); ink(ctx, coat.body, 2.8);
      ctx.beginPath(); ctx.arc(0, -17, 24, 0.1, 1.5);
      limb(ctx, coat.body, 6.5);
      const hx = -13, hy = -22;
      catEars(ctx, hx, hy, coat, 0);
      circle(ctx, hx, hy, 11.5); ink(ctx, coat.body, 2.6);
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.arc(hx + s * 5.5, hy, 3, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
      }
      poly(ctx, [[hx - 2, hy + 4], [hx + 2, hy + 4], [hx, hy + 6]]); ink(ctx, '#e79ba6', 0);
      oval(ctx, 6, -8, 9, 6); ink(ctx, coat.belly, 0);
    },
  },

  cat_stand: {
    w: 66, h: 48, actor: true,
    draw(ctx, o, t) {
      const coat = CAT_COATS[o.coat || 'tuxedo'];
      const ph = t * 3 + (o.seed || 0);
      const walking = o.moving ? 1 : 0;
      const step = Math.sin(ph) * 5 * walking;
      shadow(ctx, 0, -2, 24, 6);
      for (let i = 0; i < 4; i++) {
        const lx = -16 + (i % 2) * 30 + (i > 1 ? 4 : 0);
        const sw = Math.sin(ph + i * 1.7) * 4 * walking;
        line(ctx, lx, -16, lx + sw, -1, coat.body, 5.5);
        line(ctx, lx, -16, lx + sw, -1, coat.body, 5.5);
      }
      ctx.beginPath(); ctx.moveTo(-22, -12);
      ctx.quadraticCurveTo(-34 - Math.sin(ph * 0.6) * 4, -24, -28, -38 + Math.sin(ph * 0.6) * 5);
      limb(ctx, coat.body, 7);
      rrect(ctx, -22, -32 + step * 0.1, 44, 22, 11); ink(ctx, coat.body, 2.8);
      oval(ctx, 0, -14, 13, 5); ink(ctx, coat.belly, 0);
      const hx = 24, hy = -36;
      catEars(ctx, hx, hy, coat, 0);
      circle(ctx, hx, hy, 12.5); ink(ctx, coat.body, 2.8);
      oval(ctx, hx, hy + 4, 7, 5.4); ink(ctx, coat.belly, 0);
      catFace(ctx, hx, hy - 1, coat, Math.sin(ph * 0.3) > 0.96 ? 0 : 1, o.mood);
    },
  },
};

/* ---------------------------------------------------------------- people */

const HAIR = {
  bun(ctx, c) {
    circle(ctx, 0, -6, 17); ink(ctx, c, 2.6);
    circle(ctx, 0, -26, 9); ink(ctx, c, 2.6);
    ctx.beginPath(); ctx.arc(0, -4, 17, Math.PI * 1.05, Math.PI * 1.95); ctx.lineWidth = 2.6; ctx.strokeStyle = INK; ctx.stroke();
  },
  bob(ctx, c) {
    ctx.beginPath();
    ctx.moveTo(-18, 10); ctx.lineTo(-18, -6);
    ctx.arc(0, -6, 18, Math.PI, 0); ctx.lineTo(18, 10);
    ctx.quadraticCurveTo(10, 4, 8, -6); ctx.quadraticCurveTo(0, 2, -8, -6);
    ctx.quadraticCurveTo(-10, 4, -18, 10); ctx.closePath();
    ink(ctx, c, 2.6);
  },
  curls(ctx, c) {
    for (let i = 0; i < 7; i++) { const a = Math.PI + (i / 6) * Math.PI; circle(ctx, Math.cos(a) * 17, -4 + Math.sin(a) * 15, 8); ink(ctx, c, 2.4); }
  },
  short(ctx, c) {
    ctx.beginPath(); ctx.arc(0, -4, 18, Math.PI * 1.02, Math.PI * 1.98);
    ctx.quadraticCurveTo(12, -6, 16, 2); ctx.lineTo(-16, 2);
    ctx.quadraticCurveTo(-13, -7, -17.6, -4); ctx.closePath();
    ink(ctx, c, 2.6);
  },
  long(ctx, c) {
    rrect(ctx, -19, -8, 38, 46, 14); ink(ctx, c, 2.6);
    ctx.beginPath(); ctx.arc(0, -5, 18.5, Math.PI, 0); ctx.closePath(); ink(ctx, c, 2.6);
  },
  cap(ctx, c) {
    ctx.beginPath(); ctx.arc(0, -4, 18, Math.PI, 0); ctx.closePath(); ink(ctx, c, 2.6);
    rrect(ctx, -20, -6, 34, 6, 3); ink(ctx, darken(c, 0.2), 2.4);
  },
};

/** A small round-headed person. o: {skin, hair, hairCol, shirt, trousers, pose} */
export const PEOPLE = {
  person: {
    w: 62, h: 106, actor: true,
    draw(ctx, o, t) {
      const seed = o.seed || 0;
      const ph = t * 1.5 + seed;
      const walking = o.moving ? 1 : 0;
      const bob = walking ? Math.abs(Math.sin(ph * 2.4)) * 3 : Math.sin(ph * 0.9) * 1.2;
      const skin = o.skin || '#f0c29a';
      const shirt = o.shirt || P.teal;
      const trousers = o.trousers || '#4d5b7c';
      const hairCol = o.hairCol || '#3d2e35';
      const sit = o.pose === 'sit';
      const legLen = sit ? 17 : 26;
      if (!sit) shadow(ctx, 0, -2, 17, 6);

      // legs — seated ones splay outward so the chair behind reads as a seat
      for (let i = 0; i < 2; i++) {
        const s = i ? 1 : -1;
        const sw = walking ? Math.sin(ph * 2.4 + i * Math.PI) * 7 : 0;
        ctx.save();
        ctx.translate(s * (sit ? 9 : 7), -legLen - bob);
        if (sit) ctx.rotate(s * 0.22);
        rrect(ctx, -5, 0, 10, legLen, 5); ink(ctx, trousers, 2.6);
        rrect(ctx, -6 + sw * 0.4, legLen - 5, 13, 7, 3.4); ink(ctx, o.shoes || '#4a4258', 2.4);
        ctx.restore();
      }
      // torso
      const ty = -legLen - 36 - bob;
      rrect(ctx, -15, ty, 30, 40, 11); ink(ctx, shirt, 2.8);
      if (o.apron) {
        rrect(ctx, -12, ty + 10, 24, 30, 6); ink(ctx, o.apron, 2.4);
        line(ctx, -8, ty + 10, -4, ty + 1, o.apron, 2.4);
        line(ctx, 8, ty + 10, 4, ty + 1, o.apron, 2.4);
      }
      // arms
      for (let i = 0; i < 2; i++) {
        const s = i ? 1 : -1;
        const sw = walking ? Math.sin(ph * 2.4 + (i ? 0 : Math.PI)) * 0.55 : Math.sin(ph * 0.8 + i) * 0.07;
        ctx.save(); ctx.translate(s * 14, ty + 8); ctx.rotate(s * 0.16 + sw * s * 0.5);
        rrect(ctx, -4.5, 0, 9, 26, 4.5); ink(ctx, shirt, 2.6);
        circle(ctx, 0, 28, 5); ink(ctx, skin, 2.4);
        ctx.restore();
      }
      // head
      const hy = ty - 20;
      ctx.save(); ctx.translate(0, hy);
      circle(ctx, 0, 0, 18); ink(ctx, skin, 2.8);
      const blink = Math.sin(ph * 0.7 + seed * 3) > 0.955 ? 0.1 : 1;
      eyes(ctx, 0, 2, blink, INK, 7);
      ctx.beginPath(); ctx.arc(0, 4, 6, 0.25 * Math.PI, 0.75 * Math.PI);
      ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
      circle(ctx, -11, 5, 3.4); ink(ctx, alpha('#ff9aa8', 0.45), 0);
      circle(ctx, 11, 5, 3.4); ink(ctx, alpha('#ff9aa8', 0.45), 0);
      (HAIR[o.hair] || HAIR.short)(ctx, hairCol);
      ctx.restore();
      if (o.holds === 'tray') {
        ctx.save(); ctx.translate(18, ty + 34);
        oval(ctx, 0, 0, 15, 5); ink(ctx, '#c9884f', 2.4);
        circle(ctx, -4, -5, 4.4); ink(ctx, P.cream, 2);
        ctx.restore();
      }
    },
  },

  /* The two staff of the shop — same body, fixed palettes, small extras. */
  pip: {
    w: 66, h: 112, actor: true,
    draw(ctx, o, t) {
      PEOPLE.person.draw(ctx, Object.assign({
        skin: '#f7d3ae', hair: 'bun', hairCol: '#6e4a3a', shirt: '#8fd0c4',
        trousers: '#5a6f9e', apron: '#fff2df', seed: 0.4,
      }, o), t);
      // paper-crane hairpin, the mark of the shop
      const ph = t * 1.5 + 0.4;
      const bob = o.moving ? Math.abs(Math.sin(ph * 2.4)) * 3 : Math.sin(ph * 0.9) * 1.2;
      ctx.save(); ctx.translate(13, -26 - 36 - 20 - bob - 6); ctx.rotate(-0.2); ctx.scale(0.55, 0.55);
      poly(ctx, [[-15, -6], [-2, -14], [4, -6], [-4, -2]]); ink(ctx, '#fff8ee', 2.6);
      poly(ctx, [[-2, -14], [10, -22], [8, -10], [4, -6]]); ink(ctx, '#ffd8e2', 2.6);
      ctx.restore();
    },
  },

  sol: {
    w: 70, h: 118, actor: true,
    draw(ctx, o, t) {
      PEOPLE.person.draw(ctx, Object.assign({
        skin: '#d9a06b', hair: 'curls', hairCol: '#4a3b4f', shirt: '#e0846b',
        trousers: '#6b5a7d', seed: 1.7,
      }, o), t);
      const ph = t * 1.5 + 1.7;
      const bob = Math.sin(ph * 0.9) * 1.2;
      // pair of spectacles pushed up into the hair
      ctx.save(); ctx.translate(0, -26 - 36 - 20 - bob - 12);
      for (const dx of [-7, 7]) { circle(ctx, dx, 0, 5.4); ink(ctx, alpha('#cfeefb', 0.5), 2); }
      line(ctx, -2, 0, 2, 0, P.brass, 1.8);
      ctx.restore();
    },
  },
};

/* ------------------------------------------------------------- critters */

export const CRITTERS = {
  butterfly: {
    w: 26, h: 20, actor: true, floats: true,
    draw(ctx, o, t) {
      const ph = t * 8 + (o.seed || 0);
      const flap = Math.abs(Math.sin(ph)) * 0.85 + 0.15;
      const c = o.c || '#f5c26b';
      for (const s of [-1, 1]) {
        ctx.save(); ctx.scale(s * flap, 1);
        oval(ctx, 6, -4, 7, 5.5, -0.4); ink(ctx, c, 1.8);
        oval(ctx, 5, 2, 5, 4, 0.3); ink(ctx, darken(c, 0.12), 1.8);
        ctx.restore();
      }
      rrect(ctx, -1.4, -5, 2.8, 11, 1.4); ink(ctx, INK, 0);
      line(ctx, 0, -5, -3, -10, INK, 1.2);
      line(ctx, 0, -5, 3, -10, INK, 1.2);
    },
  },

  bird: {
    w: 30, h: 24, actor: true,
    draw(ctx, o, t) {
      const ph = t * 2 + (o.seed || 0);
      const hop = o.moving ? Math.abs(Math.sin(ph * 3)) * 3 : 0;
      const c = o.c || '#8fb4d9';
      ctx.save(); ctx.translate(0, -hop);
      shadow(ctx, 0, hop, 9, 3.4);
      oval(ctx, 0, -9, 11, 8.6); ink(ctx, c, 2.4);
      circle(ctx, 8, -17, 7); ink(ctx, lighten(c, 0.12), 2.4);
      poly(ctx, [[14, -17], [21, -15], [14, -13]]); ink(ctx, P.amber, 1.8);
      circle(ctx, 9.5, -18.5, 1.6); ink(ctx, INK, 0);
      poly(ctx, [[-9, -12], [-20, -6 + Math.sin(ph) * 2], [-8, -5]]); ink(ctx, darken(c, 0.18), 2.2);
      line(ctx, -2, -1, -2, hop === 0 ? -1 : -1, P.amber, 2);
      line(ctx, 2, -2, 2, 0, P.amber, 2);
      line(ctx, -3, -2, -3, 0, P.amber, 2);
      ctx.restore();
    },
  },

  fish: {
    w: 34, h: 18, actor: true, floats: true,
    draw(ctx, o, t) {
      const ph = t * 3 + (o.seed || 0);
      const c = o.c || '#f08a4a';
      oval(ctx, 0, 0, 12, 7); ink(ctx, c, 2.2);
      ctx.save(); ctx.translate(-11, 0); ctx.rotate(Math.sin(ph) * 0.3);
      poly(ctx, [[0, 0], [-10, -6], [-10, 6]]); ink(ctx, lighten(c, 0.2), 2);
      ctx.restore();
      circle(ctx, 6, -2, 1.6); ink(ctx, INK, 0);
      oval(ctx, 0, -6, 5, 2.6); ink(ctx, lighten(c, 0.25), 1.6);
    },
  },
};

export const ACTORS = { ...CATS, ...PEOPLE, ...CRITTERS };
export { CAT_COATS };
