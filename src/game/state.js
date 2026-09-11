/* Game flow: which level is running, the find/hint rules, and what gets
 * written to the save. The UI subscribes through the callback hooks. */

import { load, save } from '../core/store.js';
import { buildCafe } from '../scenes/cafe.js';
import { buildMarket } from '../scenes/market.js';
import { buildGreenhouse } from '../scenes/greenhouse.js';

export const LEVELS = [
  { id: 'cafe', build: buildCafe, title: 'Mittens & Mochi', sub: 'The cat café on Bellrope Lane', par: 150, tint: '#f2b23e' },
  { id: 'market', build: buildMarket, title: 'Lantern Row', sub: 'Night market, last hour of trading', par: 190, tint: '#ff9d4d' },
  { id: 'greenhouse', build: buildGreenhouse, title: 'Fernbell Glasshouse', sub: 'Under the glass, after the rain', par: 190, tint: '#7fc7a6' },
];

export const WISPS_PER_LEVEL = 3;

let cachedCatalogue = null;
/** Every item type that is actually hidden somewhere, in level order. */
export function catalogue() {
  if (cachedCatalogue) return cachedCatalogue;
  const seen = [];
  for (const level of LEVELS) {
    for (const f of level.build().finds) if (!seen.includes(f.type)) seen.push(f.type);
  }
  cachedCatalogue = seen;
  return seen;
}

export class Game {
  constructor() {
    this.save = load();
    this.save.progress = this.save.progress || {};
    this.save.collection = this.save.collection || {};
    this.scene = null;
    this.levelIndex = -1;
    this.time = 0;
    this.wisps = WISPS_PER_LEVEL;
    this.streak = 0;
    this.lastFindAt = -99;
    this.running = false;
    this.hooks = {};
  }

  on(name, fn) { this.hooks[name] = fn; }
  emit(name, ...args) { this.hooks[name]?.(...args); }

  unlocked(i) {
    if (i === 0) return true;
    return !!this.save.progress[LEVELS[i - 1].id];
  }

  best(id) { return this.save.progress[id] || null; }

  totalStars() {
    return LEVELS.reduce((n, l) => n + (this.save.progress[l.id]?.stars || 0), 0);
  }

  collectionCount() { return Object.keys(this.save.collection).length; }

  startLevel(i) {
    this.levelIndex = i;
    const level = LEVELS[i];
    this.scene = level.build();
    this.scene.prepareBackdrop();
    this.time = 0;
    this.wisps = WISPS_PER_LEVEL;
    this.streak = 0;
    this.running = true;
    this.emit('levelStart', this.scene, level);
    return this.scene;
  }

  quit() {
    this.running = false;
    this.scene = null;
    this.levelIndex = -1;
  }

  update(dt) {
    if (!this.running || !this.scene) return;
    this.time += dt;
    if (this.time - this.lastFindAt > 6) this.streak = 0;
  }

  /** A world tap. Returns a descriptor so the caller can play effects. */
  tap(pt, zoom) {
    if (!this.running || !this.scene) return { kind: 'none' };
    const item = this.scene.hitFind(pt, zoom);
    if (item) {
      item.found = true;
      item.pulse = 0;
      this.streak = Math.min(this.streak + 1, 10);
      this.lastFindAt = this.time;
      this.save.collection[item.type] = (this.save.collection[item.type] || 0) + 1;
      save({ collection: this.save.collection });
      this.emit('found', item, this.streak);
      if (this.scene.remaining() === 0) this.finish();
      return { kind: 'find', item };
    }
    const actor = this.scene.hitActor(pt, zoom);
    if (actor) {
      actor.react = 1.6;
      this.emit('poke', actor);
      return { kind: 'actor', actor };
    }
    const prop = this.scene.hitProp(pt, zoom);
    if (prop) {
      this.emit('poke', prop);
      return { kind: 'prop', prop };
    }
    return { kind: 'miss' };
  }

  /** Spend a wisp: ring the nearest unfound item and glide the camera there. */
  useHint() {
    if (!this.running || !this.scene || this.wisps <= 0) return null;
    const left = this.scene.finds.filter((f) => !f.found);
    if (!left.length) return null;
    const item = left[Math.floor(Math.random() * left.length)];
    item.pulse = 2.2;
    this.wisps--;
    this.emit('hint', item, this.wisps);
    return item;
  }

  stars() {
    const par = LEVELS[this.levelIndex].par;
    if (this.time <= par && this.wisps >= 2) return 3;
    if (this.time <= par * 1.7 && this.wisps >= 1) return 2;
    return 1;
  }

  finish() {
    this.running = false;
    const level = LEVELS[this.levelIndex];
    const stars = this.stars();
    const prev = this.save.progress[level.id];
    const record = {
      stars: Math.max(stars, prev?.stars || 0),
      time: prev ? Math.min(prev.time, this.time) : this.time,
      done: true,
    };
    this.save.progress[level.id] = record;
    save({ progress: this.save.progress });
    this.emit('complete', {
      level, stars, time: this.time, wisps: this.wisps,
      best: record, isNewBest: !prev || this.time < (prev.time ?? Infinity),
    });
  }
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
