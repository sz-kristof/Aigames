/* One small particle pool for both celebration effects and scene ambience. */

import { circle, oval, poly, ink, alpha, text, curve } from './draw.js';

export class Particles {
  constructor() { this.items = []; }

  clear() { this.items.length = 0; }

  add(p) {
    this.items.push(Object.assign({
      kind: 'spark', x: 0, y: 0, vx: 0, vy: 0, life: 1, age: 0,
      size: 6, colour: '#ffd166', spin: 0, rot: 0, grav: 0, drag: 0.98,
    }, p));
  }

  /** Confetti-ish starburst when an item is found. */
  burst(x, y, colour = '#ffd166', count = 16) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const sp = 60 + Math.random() * 150;
      this.add({
        kind: Math.random() < 0.45 ? 'star' : 'confetti',
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40,
        life: 0.7 + Math.random() * 0.6, size: 4 + Math.random() * 7,
        colour: Math.random() < 0.4 ? '#fff3c4' : colour,
        spin: (Math.random() - 0.5) * 12, rot: Math.random() * 6, grav: 260,
      });
    }
    this.add({ kind: 'ring', x, y, life: 0.65, size: 14, colour });
  }

  ring(x, y, colour = '#8ad7ff', life = 1.1, size = 18) {
    this.add({ kind: 'ring', x, y, life, size, colour });
  }

  label(x, y, str, colour = '#fffaf2') {
    this.add({ kind: 'label', x, y, vy: -46, life: 1.5, size: 20, colour, str, drag: 0.94 });
  }

  emoteHeart(x, y) {
    for (let i = 0; i < 3; i++) {
      this.add({
        kind: 'heart', x: x + (Math.random() - 0.5) * 14, y,
        vx: (Math.random() - 0.5) * 24, vy: -40 - Math.random() * 30,
        life: 1.1 + Math.random() * 0.4, size: 7 + Math.random() * 5,
        colour: '#ff7d9c', rot: (Math.random() - 0.5) * 0.4,
      });
    }
  }

  emoteNote(x, y) {
    this.add({
      kind: 'note', x, y, vx: (Math.random() - 0.5) * 30, vy: -44,
      life: 1.3, size: 11, colour: '#6fd2c8', rot: (Math.random() - 0.5) * 0.5,
    });
  }

  puff(x, y, colour = '#ffffff') {
    for (let i = 0; i < 5; i++) {
      this.add({
        kind: 'puff', x, y, vx: (Math.random() - 0.5) * 40, vy: -20 - Math.random() * 30,
        life: 0.8, size: 5 + Math.random() * 6, colour, drag: 0.93,
      });
    }
  }

  update(dt) {
    const list = this.items;
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.age += dt;
      if (p.age >= p.life) { list.splice(i, 1); continue; }
      p.vy += p.grav * dt;
      p.vx *= Math.pow(p.drag, dt * 60);
      p.vy *= Math.pow(p.drag, dt * 60);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      if (p.wobble) p.x += Math.sin(p.age * p.wobble.f) * p.wobble.a * dt;
    }
  }

  draw(ctx) {
    for (const p of this.items) {
      const k = p.age / p.life;
      const fade = k < 0.15 ? k / 0.15 : 1 - Math.pow((k - 0.15) / 0.85, 2);
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, fade)) * (p.alpha ?? 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      switch (p.kind) {
        case 'star': drawStar(ctx, p.size * (1 - k * 0.3), p.colour); break;
        case 'confetti':
          ctx.beginPath();
          ctx.rect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
          ink(ctx, p.colour, 0);
          break;
        case 'ring': {
          const r = p.size + k * p.size * 5.2;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.lineWidth = 4 * (1 - k) + 1;
          ctx.strokeStyle = p.colour;
          ctx.stroke();
          break;
        }
        case 'label':
          text(ctx, p.str, 0, 1, p.size, 'rgba(51,38,63,0.55)', 700);
          text(ctx, p.str, 0, 0, p.size, p.colour, 700);
          break;
        case 'heart': drawHeart(ctx, p.size, p.colour); break;
        case 'note': drawNote(ctx, p.size, p.colour); break;
        case 'puff':
          circle(ctx, 0, 0, p.size * (1 + k));
          ink(ctx, alpha(p.colour, 0.6), 0);
          break;
        case 'mote':
          circle(ctx, 0, 0, p.size);
          ink(ctx, p.colour, 0);
          break;
        case 'petal':
          oval(ctx, 0, 0, p.size, p.size * 0.55, 0.4);
          ink(ctx, p.colour, 0);
          break;
        case 'rain':
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(p.vx * 0.02, p.vy * 0.02);
          ctx.strokeStyle = p.colour;
          ctx.lineWidth = p.size;
          ctx.stroke();
          break;
        default:
          circle(ctx, 0, 0, p.size);
          ink(ctx, p.colour, 0);
      }
      ctx.restore();
    }
  }
}

function drawStar(ctx, r, colour) {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rad = i % 2 ? r * 0.38 : r;
    pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
  }
  poly(ctx, pts);
  ink(ctx, colour, 0);
}

function drawHeart(ctx, s, colour) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.9);
  ctx.bezierCurveTo(-s * 1.4, -s * 0.2, -s * 0.55, -s * 1.1, 0, -s * 0.35);
  ctx.bezierCurveTo(s * 0.55, -s * 1.1, s * 1.4, -s * 0.2, 0, s * 0.9);
  ink(ctx, colour, 0);
}

function drawNote(ctx, s, colour) {
  circle(ctx, -s * 0.35, s * 0.55, s * 0.42);
  ink(ctx, colour, 0);
  ctx.beginPath();
  ctx.rect(s * 0.0, -s * 0.85, s * 0.22, s * 1.4);
  ink(ctx, colour, 0);
  curve(ctx, [[s * 0.2, -s * 0.85], [s * 0.75, -s * 0.7], [s * 0.2, -s * 0.4]]);
  ink(ctx, colour, 0);
}
