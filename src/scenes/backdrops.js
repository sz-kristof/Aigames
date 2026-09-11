/* Static backdrops. Each is rendered once into an offscreen canvas, so they
 * can afford to be detailed — tiles, grain, glazing bars and all. */

import {
  INK, rect, rrect, circle, oval, poly, curve, line, ink,
  lighten, darken, alpha, glow, pool, text,
} from '../core/draw.js';
import { hash01 } from '../core/rng.js';

/** Diamond tile floor, the classic café checker. */
function diamondFloor(ctx, x0, y0, x1, y1, a, b, tw = 128, th = 64) {
  const cols = Math.ceil((x1 - x0) / (tw / 2)) + 2;
  const rows = Math.ceil((y1 - y0) / (th / 2)) + 2;
  for (let j = -1; j < rows; j++) {
    for (let i = -1; i < cols; i++) {
      if ((i + j) & 1) continue;
      const cx = x0 + (i * tw) / 2;
      const cy = y0 + (j * th) / 2;
      poly(ctx, [[cx, cy - th / 2], [cx + tw / 2, cy], [cx, cy + th / 2], [cx - tw / 2, cy]]);
      ctx.fillStyle = i & 1 ? a : b;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = alpha(INK, 0.09);
      ctx.stroke();
    }
  }
}

/** Perspective-ish plank floor. */
function plankFloor(ctx, x0, y0, x1, y1, base, step = 46) {
  ctx.fillStyle = base;
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  let row = 0;
  for (let y = y0; y < y1; y += step) {
    const shade = row % 2 ? darken(base, 0.05) : lighten(base, 0.05);
    ctx.fillStyle = shade;
    ctx.fillRect(x0, y, x1 - x0, step / 2);
    const off = (row % 3) * 90;
    for (let x = x0 - off; x < x1; x += 260) {
      line(ctx, x, y, x, y + step, alpha(INK, 0.1), 1.4);
    }
    line(ctx, x0, y, x1, y, alpha(INK, 0.08), 1.4);
    row++;
  }
}

/** Cobbles for the night street. */
function cobbles(ctx, x0, y0, x1, y1, base) {
  ctx.fillStyle = base;
  ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  let row = 0;
  for (let y = y0; y < y1; y += 22) {
    const off = row % 2 ? 19 : 0;
    for (let x = x0 + off; x < x1; x += 38) {
      const k = hash01(row * 977 + x);
      rrect(ctx, x + 1.5, y + 1.5, 34, 18, 8);
      ctx.fillStyle = k > 0.5 ? lighten(base, 0.02 + k * 0.035) : darken(base, 0.02 + k * 0.04);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = alpha('#0e0a20', 0.22);
      ctx.stroke();
    }
    row++;
  }
}

/** Warm interior room: papered wall, wainscot, tiled floor. */
export function cafeBackdrop(ctx, scene) {
  const { w, h } = scene.world;
  const m = scene.mood;
  const wallY = 470;

  const g = ctx.createLinearGradient(0, 0, 0, wallY);
  g.addColorStop(0, m.wallTop);
  g.addColorStop(1, m.wall);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, wallY);

  // wallpaper sprigs
  for (let y = 40; y < wallY - 130; y += 74) {
    for (let x = 40 + ((y / 74) % 2) * 46; x < w; x += 92) {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = 0.3;
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i - 1) * 0.7;
        oval(ctx, Math.cos(a) * 8, Math.sin(a) * 8, 6, 3, a);
        ink(ctx, '#e3b98d', 0);
      }
      ctx.restore();
    }
  }

  // wainscot
  ctx.fillStyle = '#e6b98e';
  ctx.fillRect(0, wallY - 132, w, 132);
  for (let x = 20; x < w; x += 128) {
    rrect(ctx, x, wallY - 112, 92, 88, 6);
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = alpha('#a9713f', 0.55);
    ctx.stroke();
  }
  ctx.fillStyle = m.trim;
  ctx.fillRect(0, wallY - 140, w, 14);
  ctx.fillStyle = lighten(m.trim, 0.3);
  ctx.fillRect(0, wallY - 140, w, 5);

  diamondFloor(ctx, 0, wallY, w, h, m.floor, m.floorAlt);

  // skirting + floor shadow at the wall join
  ctx.fillStyle = m.trim;
  ctx.fillRect(0, wallY - 16, w, 20);
  ctx.fillStyle = lighten(m.trim, 0.35);
  ctx.fillRect(0, wallY - 16, w, 5);
  const sg = ctx.createLinearGradient(0, wallY, 0, wallY + 90);
  sg.addColorStop(0, 'rgba(90,50,20,0.24)');
  sg.addColorStop(1, 'rgba(90,50,20,0)');
  ctx.fillStyle = sg;
  ctx.fillRect(0, wallY, w, 90);

  // pools of daylight from the window wall
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const x of [1560, 1900]) {
    const lg = ctx.createLinearGradient(x, wallY, x + 90, h * 0.92);
    lg.addColorStop(0, 'rgba(255,226,160,0.20)');
    lg.addColorStop(0.55, 'rgba(255,226,160,0.08)');
    lg.addColorStop(1, 'rgba(255,226,160,0)');
    poly(ctx, [[x - 74, wallY], [x + 74, wallY], [x + 250, h], [x - 170, h]]);
    ctx.fillStyle = lg;
    ctx.fill();
  }
  ctx.restore();
  // a little floor grain so the tiles are not perfectly flat
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 1600; i++) {
    const x = hash01(i * 7 + 11) * w;
    const y = wallY + hash01(i * 13 + 5) * (h - wallY);
    circle(ctx, x, y, 1 + hash01(i * 3) * 2);
    ctx.fillStyle = hash01(i * 5) > 0.5 ? '#8a5a35' : '#fff3e0';
    ctx.fill();
  }
  ctx.restore();
}

/** Night street: sky, rooftops, lamplight, wet cobbles. */
export function marketBackdrop(ctx, scene) {
  const { w, h } = scene.world;
  const m = scene.mood;
  const horizon = 520;

  const g = ctx.createLinearGradient(0, 0, 0, horizon);
  g.addColorStop(0, '#171132');
  g.addColorStop(0.6, '#2a1d4c');
  g.addColorStop(1, '#4a2c5c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, horizon);

  for (let i = 0; i < 190; i++) {
    const x = hash01(i * 13 + 1) * w;
    const y = hash01(i * 31 + 5) * horizon * 0.85;
    const r = 0.7 + hash01(i * 7 + 3) * 1.7;
    circle(ctx, x, y, r);
    ctx.fillStyle = alpha('#ffffff', 0.35 + hash01(i * 5) * 0.55);
    ctx.fill();
  }

  circle(ctx, 1980, 150, 62);
  ctx.fillStyle = '#ffeec2';
  ctx.fill();
  glow(ctx, 1980, 150, 240, '#ffeec2', 0.22);
  circle(ctx, 2008, 132, 12); ctx.fillStyle = alpha('#e8d6a8', 0.6); ctx.fill();
  circle(ctx, 1962, 176, 8); ctx.fillStyle = alpha('#e8d6a8', 0.5); ctx.fill();

  // far rooftops
  for (let pass = 0; pass < 2; pass++) {
    const base = horizon - pass * 44;
    const col = pass ? '#1d1636' : '#2b2150';
    let x = -60;
    let i = 0;
    while (x < w + 60) {
      const bw = 150 + hash01(pass * 97 + i * 11) * 190;
      const bh = 110 + hash01(pass * 61 + i * 7) * 210;
      poly(ctx, [[x, base], [x, base - bh], [x + bw / 2, base - bh - 44], [x + bw, base - bh], [x + bw, base]]);
      ctx.fillStyle = col;
      ctx.fill();
      for (let wy = base - bh + 30; wy < base - 26; wy += 46) {
        for (let wx = x + 22; wx < x + bw - 26; wx += 42) {
          if (hash01(wx * 3 + wy) < 0.45) continue;
          rrect(ctx, wx, wy, 18, 22, 3);
          ctx.fillStyle = alpha('#ffcf7a', 0.35 + hash01(wx + wy) * 0.5);
          ctx.fill();
        }
      }
      x += bw + 6;
      i++;
    }
  }

  cobbles(ctx, 0, horizon, w, h, m.floor);

  // damp sheen: the street is wet, so it catches the lamps
  ctx.save();
  ctx.globalAlpha = 0.35;
  const wet = ctx.createLinearGradient(0, horizon, 0, h);
  wet.addColorStop(0, 'rgba(120,150,220,0.0)');
  wet.addColorStop(1, 'rgba(120,160,220,0.30)');
  ctx.fillStyle = wet;
  ctx.fillRect(0, horizon, w, h - horizon);
  ctx.restore();

  const sg = ctx.createLinearGradient(0, horizon, 0, horizon + 150);
  sg.addColorStop(0, 'rgba(10,6,26,0.55)');
  sg.addColorStop(1, 'rgba(10,6,26,0)');
  ctx.fillStyle = sg;
  ctx.fillRect(0, horizon, w, 150);

  // a broad warm key over the whole street, so nothing is pure shadow
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const key = ctx.createLinearGradient(0, horizon, 0, h);
  key.addColorStop(0, 'rgba(255,170,90,0.16)');
  key.addColorStop(0.45, 'rgba(255,150,90,0.10)');
  key.addColorStop(1, 'rgba(180,140,220,0.06)');
  ctx.fillStyle = key;
  ctx.fillRect(0, horizon, w, h - horizon);
  ctx.restore();

  // lamplight on the cobbles, painted in so the ground is readable
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, r, a, col] of [
    [360, 900, 380, 0.26, '#ffb35c'], [1000, 900, 380, 0.26, '#ffc06a'],
    [1660, 900, 380, 0.26, '#ffb35c'], [2230, 900, 340, 0.24, '#ffa9d0'],
    [700, 1120, 260, 0.20, '#ffc06a'], [1980, 1180, 240, 0.18, '#d0a0ff'],
    [120, 1000, 220, 0.18, '#ffb35c'], [2330, 1030, 220, 0.18, '#ff9a8c'],
    [1300, 1250, 300, 0.12, '#9fd0ff'],
    [840, 1030, 200, 0.26, '#ffb35c'], [1560, 1070, 200, 0.26, '#ffb35c'],
    [2120, 1030, 190, 0.24, '#ffb35c'], [300, 1070, 190, 0.24, '#ffb35c'],
  ]) pool(ctx, x, y, r, r * 0.46, col, a);
  ctx.restore();
}

/** Conservatory: glazed walls, sun shafts, stone floor. */
export function greenhouseBackdrop(ctx, scene) {
  const { w, h } = scene.world;
  const m = scene.mood;
  const wallY = 520;

  const g = ctx.createLinearGradient(0, 0, 0, wallY);
  g.addColorStop(0, '#bfe6f5');
  g.addColorStop(0.55, '#d8f0ef');
  g.addColorStop(1, '#e9f7ea');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, wallY);

  // soft greenery beyond the glass
  for (let i = 0; i < 20; i++) {
    const x = hash01(i * 17 + 2) * w;
    const r = 70 + hash01(i * 29) * 110;
    circle(ctx, x, wallY - 10 - hash01(i * 5) * 40, r);
    ctx.fillStyle = alpha('#9ed0a8', 0.22 + hash01(i * 3) * 0.12);
    ctx.fill();
  }

  // glazing bars
  ctx.lineWidth = 9;
  ctx.strokeStyle = '#f4fbf6';
  for (let x = 0; x <= w; x += 190) line(ctx, x, 0, x, wallY, '#f4fbf6', 9);
  for (let y = 90; y < wallY; y += 150) line(ctx, 0, y, w, y, '#f4fbf6', 7);
  // arched ribs along the top
  for (let x = -95; x <= w; x += 380) {
    ctx.beginPath();
    ctx.moveTo(x, 150);
    ctx.quadraticCurveTo(x + 190, -30, x + 380, 150);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#f4fbf6';
    ctx.stroke();
  }
  ctx.lineWidth = 3;
  ctx.strokeStyle = alpha('#8aa79a', 0.5);
  for (let x = 0; x <= w; x += 190) line(ctx, x + 4, 0, x + 4, wallY, alpha('#8aa79a', 0.35), 2);

  // low brick plinth
  ctx.fillStyle = '#c98b6a';
  ctx.fillRect(0, wallY - 96, w, 96);
  for (let y = wallY - 92; y < wallY; y += 24) {
    const off = ((y / 24) % 2) * 46;
    for (let x = -off; x < w; x += 92) {
      rrect(ctx, x + 3, y + 2, 86, 19, 3);
      ctx.fillStyle = hash01(x + y) > 0.5 ? '#d1957a' : '#c07f5f';
      ctx.fill();
    }
  }
  ctx.fillStyle = '#a9cbb6';
  ctx.fillRect(0, wallY - 106, w, 14);

  // encaustic tiles, the way a real glasshouse floor is laid
  const TW = 96, TH = 48;
  ctx.fillStyle = m.floor;
  ctx.fillRect(0, wallY, w, h - wallY);
  for (let j = 0, y = wallY; y < h; y += TH, j++) {
    for (let i = 0, x = 0; x < w; x += TW, i++) {
      const odd = (i + j) & 1;
      ctx.fillStyle = odd ? '#b39b83' : '#e0d2bd';
      ctx.fillRect(x, y, TW, TH);
      if (odd) {
        // a little quatrefoil motif on the dark tiles
        ctx.save();
        ctx.globalAlpha = 0.4;
        for (let k = 0; k < 4; k++) {
          const a = (k / 4) * Math.PI * 2;
          oval(ctx, x + TW / 2 + Math.cos(a) * 15, y + TH / 2 + Math.sin(a) * 8, 10, 5, a);
          ctx.fillStyle = '#c9b49a';
          ctx.fill();
        }
        ctx.restore();
      }
    }
  }
  ctx.strokeStyle = alpha('#6d5c4a', 0.28);
  ctx.lineWidth = 1.6;
  for (let y = wallY; y <= h; y += TH) line(ctx, 0, y, w, y, alpha('#6d5c4a', 0.28), 1.6);
  for (let x = 0; x <= w; x += TW) line(ctx, x, wallY, x, h, alpha('#6d5c4a', 0.22), 1.6);

  // gravel path down the middle, edged with bricks
  ctx.save();
  poly(ctx, [[w * 0.28, h], [w * 0.42, wallY], [w * 0.58, wallY], [w * 0.80, h]]);
  ctx.fillStyle = '#ded2bb';
  ctx.fill();
  ctx.strokeStyle = '#a9866a';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.clip();
  for (let i = 0; i < 1400; i++) {
    const x = hash01(i * 7 + 1) * w;
    const y = wallY + hash01(i * 13 + 3) * (h - wallY);
    circle(ctx, x, y, 1.4 + hash01(i * 3) * 2.6);
    ctx.fillStyle = alpha(hash01(i) > 0.5 ? '#ab9c85' : '#f4ecdd', 0.85);
    ctx.fill();
  }
  ctx.restore();

  // sun shafts — barely there, just enough to feel the glass overhead
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 5; i++) {
    const x = 240 + i * 520;
    const lg = ctx.createLinearGradient(x, 0, x + 160, h * 0.9);
    lg.addColorStop(0, 'rgba(255,250,200,0.13)');
    lg.addColorStop(0.5, 'rgba(255,250,200,0.05)');
    lg.addColorStop(1, 'rgba(255,250,200,0)');
    poly(ctx, [[x - 46, 0], [x + 52, 0], [x + 210, h], [x - 110, h]]);
    ctx.fillStyle = lg;
    ctx.fill();
  }
  ctx.restore();

  // damp patches left by the rain
  ctx.save();
  ctx.globalAlpha = 0.14;
  for (let i = 0; i < 26; i++) {
    const x = hash01(i * 23 + 7) * w;
    const y = wallY + 60 + hash01(i * 41 + 3) * (h - wallY - 80);
    oval(ctx, x, y, 40 + hash01(i * 5) * 70, 16 + hash01(i * 11) * 22);
    ctx.fillStyle = '#6f9fb8';
    ctx.fill();
  }
  ctx.restore();

  const sg = ctx.createLinearGradient(0, wallY, 0, wallY + 80);
  sg.addColorStop(0, 'rgba(60,80,60,0.2)');
  sg.addColorStop(1, 'rgba(60,80,60,0)');
  ctx.fillStyle = sg;
  ctx.fillRect(0, wallY, w, 80);
}
