/* Boot, game loop, and the wiring between input, state and UI. */

import { Camera } from './core/camera.js';
import { attachInput } from './core/input.js';
import { Particles } from './core/particles.js';
import { prepare } from './core/draw.js';
import * as audio from './core/audio.js';
import { save, load } from './core/store.js';
import { Game, LEVELS } from './game/state.js';
import { Hud } from './ui/hud.js';
import { Bubbles } from './ui/bubbles.js';
import {
  showTitle, showLevelSelect, showBrief, showComplete, showPause, showShelf, hideOverlay,
} from './ui/overlays.js';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d', { alpha: false });

const game = new Game();
const camera = new Camera({ w: 2400, h: 1500 });
const fx = new Particles();
const ambient = new Particles();
const bubbles = new Bubbles();

let scene = null;
let mode = 'title';        // title | select | brief | play | paused | complete | shelf
let clock = 0;
let drift = 0;             // slow auto-pan used behind the menus
let shelfReturn = 'title';
let pendingResult = null;

/* ------------------------------------------------------------------ hud */

const hud = new Hud({
  onHint: useHint,
  onMenu: () => { if (mode === 'play') pause(); },
  onSound: () => {
    const on = audio.setEnabled(!audio.isEnabled());
    hud.setSound(on);
    save({ sound: on });
  },
  onCard: (item, card) => {
    hud.nudge(card);
    audio.tap();
    if (item.found) hud.toast(`<b>${item.label}</b> — ${item.where || 'safely behind the counter.'}`);
    else hud.toast(`Still looking for the <b>${item.label.toLowerCase()}</b>.`);
  },
});

/* -------------------------------------------------------------- sizing */

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  prepare(ctx);
  camera.resize(w, h);
}
window.addEventListener('resize', resize);

/* ------------------------------------------------------------- scene use */

function loadScene(i, { play = true } = {}) {
  scene = game.startLevel(i);
  camera.world = scene.world;
  resize();
  camera.x = scene.start.x;
  camera.y = scene.start.y;
  camera.zoom = Math.max(scene.start.zoom, camera.minZoom);
  camera.clamp();
  fx.clear();
  ambient.clear();
  bubbles.clear();
  hud.setScene(scene);
  hud.setWisps(game.wisps);
  hud.setProgress(0, scene.finds.length);
  hud.setTimer(0);
  if (!play) game.running = false;
}

/** The menus sit over a real, living scene rather than a flat colour. */
function loadMenuBackdrop() {
  loadScene(0, { play: false });
  game.running = false;
  camera.zoom = camera.minZoom * 1.25;
  camera.clamp();
}

/* --------------------------------------------------------------- flow */

function toTitle() {
  mode = 'title';
  hud.hide();
  bubbles.clear();
  showTitle(game, {
    onPlay: toSelect,
    onShelf: () => openShelf('title'),
  });
}

function toSelect() {
  mode = 'select';
  hud.hide();
  showLevelSelect(game, {
    onPick: (i) => brief(i),
    onBack: toTitle,
    onShelf: () => openShelf('select'),
  });
}

function brief(i) {
  mode = 'brief';
  loadScene(i, { play: false });
  hud.show();
  showBrief(scene, LEVELS[i], {
    onGo: () => {
      hideOverlay();
      mode = 'play';
      game.running = true;
      audio.unlock();
      camera.glideTo(scene.start.x, scene.start.y, Math.max(scene.start.zoom, camera.minZoom), 0.9);
    },
  });
}

function pause() {
  mode = 'paused';
  game.running = false;
  showPause(game, {
    onResume: () => { hideOverlay(); mode = 'play'; game.running = true; },
    onShelf: () => openShelf('paused'),
    onMenu: () => { hideOverlay(); loadMenuBackdrop(); toSelect(); },
  });
}

function openShelf(from) {
  shelfReturn = from;
  mode = 'shelf';
  showShelf(game, {
    onBack: () => {
      hideOverlay();
      if (shelfReturn === 'title') toTitle();
      else if (shelfReturn === 'select') toSelect();
      else if (shelfReturn === 'complete') showResult();
      else pause();
    },
  });
}

function showResult() {
  mode = 'complete';
  showComplete(game, pendingResult, {
    onNext: (i) => { hideOverlay(); brief(i); },
    onAgain: () => { hideOverlay(); brief(game.levelIndex); },
    onMenu: () => { hideOverlay(); loadMenuBackdrop(); toSelect(); },
    onShelf: () => openShelf('complete'),
  });
}

/* ------------------------------------------------------------ game hooks */

game.on('found', (item, streak) => {
  const def = { x: item.x, y: item.y - 20 };
  fx.burst(item.x, item.y - 14, item.tint, 18);
  fx.label(item.x, item.y - 42, item.label, '#fffaf2');
  audio.found(streak - 1);
  hud.markFound(item);
  hud.setProgress(scene.finds.length - scene.remaining(), scene.finds.length);
  if (streak >= 3) hud.toast(`${streak} in a row — sharp eyes.`, 1800);
});

game.on('hint', (item, left) => {
  hud.setWisps(left);
  audio.hint();
  camera.glideTo(item.x, item.y - 30, Math.max(1.05, camera.zoom), 0.85);
  fx.ring(item.x, item.y - 14, '#9be8ff', 1.3, 22);
  if (item.where) hud.toast(item.where, 3200);
});

game.on('poke', (thing) => {
  const line = thing.talk;
  if (!line) return;
  const isCat = String(thing.type).startsWith('cat');
  if (isCat) { audio.meow(); fx.emoteHeart(thing.x, thing.y - 58); }
  else if (thing.type === 'bird') { audio.chirp(); fx.emoteNote(thing.x, thing.y - 30); }
  else if (thing.type === 'radio') { audio.page(); fx.emoteNote(thing.x, thing.y - 40); fx.emoteNote(thing.x + 14, thing.y - 46); }
  else audio.page();
  bubbles.say(thing, line, { offset: (thing.bubbleY ?? 74) });
});

game.on('complete', (result) => {
  pendingResult = result;
  audio.fanfare();
  for (let i = 0; i < 7; i++) {
    setTimeout(() => {
      const b = camera.bounds(-60);
      fx.burst(b.x0 + Math.random() * (b.x1 - b.x0), b.y0 + Math.random() * (b.y1 - b.y0) * 0.7,
        ['#ffd166', '#7fc7a6', '#e8615a', '#8ad7ff', '#e35d9b'][i % 5], 20);
    }, i * 170);
  }
  hud.toast('Everything on the list — nice work.', 2400);
  setTimeout(() => { if (mode === 'play') showResult(); }, 1700);
});

/* ---------------------------------------------------------------- input */

function useHint() {
  if (mode !== 'play') return;
  if (game.wisps <= 0) { hud.toast('No wisps left — you are on your own now.', 2000); audio.miss(); return; }
  game.useHint();
}

attachInput(canvas, camera, {
  onDown: () => audio.unlock(),
  onTap: (p) => {
    if (mode !== 'play') return;
    const pt = camera.screenToWorld(p.x, p.y);
    const r = game.tap(pt, camera.zoom);
    if (r.kind === 'miss') {
      audio.miss();
      fx.ring(pt.x, pt.y, 'rgba(255,255,255,0.5)', 0.5, 9);
    }
  },
  onHover: (p) => {
    if (mode !== 'play' || !scene) { canvas.classList.remove('pointing'); return; }
    const pt = camera.screenToWorld(p.x, p.y);
    const hot = scene.hitFind(pt, camera.zoom) || scene.hitActor(pt, camera.zoom) || scene.hitProp(pt, camera.zoom);
    canvas.classList.toggle('pointing', !!hot);
  },
  onKey: (e) => {
    if (e.key === 'Escape') { if (mode === 'play') pause(); else if (mode === 'paused') { hideOverlay(); mode = 'play'; game.running = true; } }
    else if (e.key === 'h' || e.key === 'H') useHint();
  },
});

/* -------------------------------------------------------------- ambience */

const AMBIENCE = {
  motes: (b) => ({
    kind: 'mote', x: b.x0 + Math.random() * (b.x1 - b.x0), y: b.y1 + 20,
    vy: -8 - Math.random() * 14, vx: (Math.random() - 0.5) * 10,
    size: 1.4 + Math.random() * 2.2, life: 7 + Math.random() * 5, drag: 1,
    colour: '#ffe3ad', alpha: 0.5, wobble: { f: 0.6 + Math.random(), a: 14 },
  }),
  embers: (b) => ({
    kind: 'mote', x: b.x0 + Math.random() * (b.x1 - b.x0), y: b.y1 + 20,
    vy: -18 - Math.random() * 24, vx: (Math.random() - 0.5) * 14,
    size: 1.2 + Math.random() * 2, life: 5 + Math.random() * 4, drag: 1,
    colour: Math.random() < 0.4 ? '#ffe6a0' : '#ffc97a', alpha: 0.75, wobble: { f: 1 + Math.random(), a: 20 },
  }),
  pollen: (b) => ({
    kind: 'petal', x: b.x0 + Math.random() * (b.x1 - b.x0), y: b.y0 - 20,
    vy: 10 + Math.random() * 14, vx: (Math.random() - 0.5) * 16,
    size: 2 + Math.random() * 3, life: 9 + Math.random() * 5, drag: 1, rot: Math.random() * 6,
    spin: (Math.random() - 0.5) * 1.2, colour: '#fff4c2', alpha: 0.6, wobble: { f: 0.5 + Math.random(), a: 22 },
  }),
};

let ambientAccum = 0;
function spawnAmbience(dt) {
  if (!scene?.ambience) return;
  const spec = AMBIENCE[scene.ambience.kind];
  if (!spec) return;
  const cap = scene.ambience.count || 30;
  ambientAccum += dt * cap * 0.5;
  const b = camera.bounds(60);
  while (ambientAccum >= 1) {
    ambientAccum -= 1;
    if (ambient.items.length < cap) ambient.add(spec(b));
  }
}

/* ------------------------------------------------------------------ loop */

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  clock += dt;

  camera.update(dt);
  if (mode !== 'play' && mode !== 'brief' && scene) {
    // gentle drift so the menus have something to look at
    drift += dt * 0.08;
    camera.x = scene.world.w / 2 + Math.sin(drift) * scene.world.w * 0.16;
    camera.y = scene.world.h * 0.56 + Math.cos(drift * 0.7) * 90;
    camera.clamp();
  }

  if (scene) {
    scene.update(dt, clock);
    game.update(dt);
    spawnAmbience(dt);
    ambient.update(dt);
    fx.update(dt);
    if (mode === 'play') hud.setTimer(game.time);
  }
  bubbles.update(dt, camera);
  audio.ambient(dt);

  const w = window.innerWidth, h = window.innerHeight;
  ctx.fillStyle = '#241c2e';
  ctx.fillRect(0, 0, w, h);

  if (scene) {
    ctx.save();
    camera.apply(ctx);
    scene.draw(ctx, clock, camera);
    ambient.draw(ctx);
    fx.draw(ctx);
    ctx.restore();
    scene.drawMood(ctx, w, h);
  }

  requestAnimationFrame(frame);
}

/* ------------------------------------------------------------------ boot */

async function boot() {
  resize();
  if (document.fonts?.ready) { try { await document.fonts.ready; } catch { /* ignore */ } }
  const prefs = load();
  const soundOn = prefs.sound !== false;
  audio.setEnabled(soundOn);
  hud.setSound(soundOn);
  loadMenuBackdrop();
  toTitle();
  requestAnimationFrame(frame);
}

boot();

// handy for the screenshot harness
window.__game = { game, camera, get scene() { return scene; }, goto: (i) => brief(i), state: () => mode };
