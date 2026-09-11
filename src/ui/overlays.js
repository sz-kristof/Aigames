/* Full-screen cards: title, level select, level complete, the found shelf. */

import { LEVELS, formatTime, WISPS_PER_LEVEL, catalogue } from '../game/state.js';
import { FINDS, getProp, renderIcon } from '../art/props.js';
import { prepare, alpha } from '../core/draw.js';

const root = () => document.getElementById('overlay');

export function hideOverlay() {
  const el = root();
  el.classList.remove('show');
  el.innerHTML = '';
}

function card(html) {
  const el = root();
  el.innerHTML = `<div class="card">${html}</div>`;
  el.classList.add('show');
  el.scrollTop = 0;
  return el;
}

function wire(el, map) {
  for (const [sel, fn] of Object.entries(map)) {
    el.querySelectorAll(sel).forEach((n) => n.addEventListener('click', (e) => fn(n, e)));
  }
}

function stars(n, size = 'stars') {
  return `<div class="${size}">${[0, 1, 2].map((i) => `<i class="${i < n ? 'on' : ''}">★</i>`).join('')}</div>`;
}

/* ------------------------------------------------------- level thumbnail */

/* cast entries are [type, x fraction, y fraction, height fraction] */
const THUMBS = {
  cafe: {
    sky: ['#ffe9cd', '#f3c795'],
    floor: '#e8c79c',
    cast: [
      ['lamp_pendant', 0.3, -0.02, 0.5], ['plant_monstera', 0.11, 1.06, 0.9],
      ['table_round', 0.45, 1.0, 0.6], ['cup', 0.45, 0.46, 0.13],
      ['chair', 0.67, 1.0, 0.58], ['cat_sit', 0.86, 1.0, 0.44],
    ],
  },
  market: {
    sky: ['#2a1d4c', '#4a2c5c'],
    floor: '#2b2547',
    cast: [
      ['lantern', 0.17, -0.02, 0.42], ['lantern', 0.83, -0.02, 0.36],
      ['stall', 0.5, 1.06, 0.82], ['crate', 0.13, 1.02, 0.26],
      ['person', 0.85, 1.02, 0.5],
    ],
  },
  greenhouse: {
    sky: ['#cfeaf5', '#e4f4e6'],
    floor: '#c7b7a2',
    cast: [
      ['palm', 0.13, 1.08, 1.0], ['plant_monstera', 0.44, 1.04, 0.7],
      ['work_bench', 0.79, 1.0, 0.46], ['watering_can', 0.79, 0.74, 0.2],
      ['butterfly', 0.62, 0.32, 0.16],
    ],
  },
};

export function levelThumb(id, w = 220, h = 84) {
  const cv = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = w * dpr;
  cv.height = h * dpr;
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  prepare(ctx);
  const spec = THUMBS[id] || THUMBS.cafe;
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, spec.sky[0]);
  g.addColorStop(1, spec.sky[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = spec.floor;
  ctx.fillRect(0, h * 0.62, w, h * 0.38);
  ctx.fillStyle = alpha('#33263f', 0.08);
  ctx.fillRect(0, h * 0.62, w, 3);
  for (const [type, px, py, scale] of spec.cast) {
    const def = getProp(type);
    ctx.save();
    ctx.translate(px * w, py * h);
    const s = (h * scale) / def.h;
    ctx.scale(s, s);
    def.draw(ctx, { x: 0, y: 0, steam: false, seed: 3 }, 0.6);
    ctx.restore();
  }
  return cv;
}

/* ----------------------------------------------------------------- cards */

export function showTitle(game, handlers) {
  const started = game.totalStars() > 0 || game.collectionCount() > 0;
  const el = card(`
    <p class="kicker">Odds &amp; Endings</p>
    <h2>A cozy lost&nbsp;&amp;&nbsp;found</h2>
    <p>Three crowded little worlds, hand-drawn and full of things people dropped.
       Pan, zoom, and pick out everything on the list before the shop closes.</p>
    <div class="legend">
      <span><kbd>drag</kbd>look around</span>
      <span><kbd>scroll</kbd>zoom</span>
      <span><kbd>click</kbd>pick things up</span>
      <span><kbd>wisp</kbd>a nudge, if you're stuck</span>
    </div>
    <button class="cta" data-play>${started ? 'Keep looking' : 'Open the shop'}</button>
    <button class="cta ghost" data-shelf>The shelf (${game.collectionCount()})</button>
  `);
  wire(el, { '[data-play]': handlers.onPlay, '[data-shelf]': handlers.onShelf });
}

export function showLevelSelect(game, handlers) {
  const items = LEVELS.map((lv, i) => {
    const p = game.best(lv.id);
    const locked = !game.unlocked(i);
    return `
      <button class="level ${locked ? 'locked' : ''}" data-level="${i}" ${locked ? 'disabled' : ''}>
        <div class="thumb" data-thumb="${lv.id}"></div>
        <h3>${lv.title}</h3>
        <small>${locked ? 'Finish the previous job first' : lv.sub}</small>
        ${stars(p?.stars || 0)}
        <small>${p ? `best ${formatTime(p.time)}` : '&nbsp;'}</small>
      </button>`;
  }).join('');

  const el = card(`
    <p class="kicker">Today's jobs</p>
    <h2>Where to next?</h2>
    <div class="levels">${items}</div>
    <button class="cta ghost" data-shelf>The shelf (${game.collectionCount()})</button>
    <button class="cta ghost" data-back>Back</button>
  `);
  el.querySelectorAll('[data-thumb]').forEach((n) => n.appendChild(levelThumb(n.dataset.thumb)));
  wire(el, {
    '[data-level]': (n) => handlers.onPick(Number(n.dataset.level)),
    '[data-shelf]': handlers.onShelf,
    '[data-back]': handlers.onBack,
  });
}

export function showBrief(scene, level, handlers) {
  const el = card(`
    <p class="kicker">${level.sub}</p>
    <h2>${level.title}</h2>
    <p>${scene.blurb}</p>
    <div class="hintline">Ten things on the list. You have ${WISPS_PER_LEVEL} wisps —
      spend one and it will circle something you've missed.</div>
    <button class="cta" data-go>Start looking</button>
  `);
  wire(el, { '[data-go]': handlers.onGo });
}

export function showComplete(game, result, handlers) {
  const nextIndex = LEVELS.findIndex((l) => l.id === result.level.id) + 1;
  const hasNext = nextIndex < LEVELS.length;
  const el = card(`
    <p class="kicker">All found</p>
    <h2>${result.level.title}</h2>
    ${stars(result.stars, 'starrow')}
    <div class="score">
      <div><b>${formatTime(result.time)}</b><span>time</span></div>
      <div><b>${result.wisps}</b><span>wisps left</span></div>
      <div><b>${game.collectionCount()}</b><span>on the shelf</span></div>
    </div>
    <p>${result.isNewBest ? 'A new personal best — Auntie Sol is quietly impressed.'
      : 'Everything is back behind the counter, labelled and waiting.'}</p>
    ${hasNext ? '<button class="cta" data-next>Next job</button>' : '<button class="cta mint" data-shelf>See the shelf</button>'}
    <button class="cta ghost" data-again>Search again</button>
    <button class="cta ghost" data-menu>All jobs</button>
  `);
  wire(el, {
    '[data-next]': () => handlers.onNext(nextIndex),
    '[data-again]': handlers.onAgain,
    '[data-menu]': handlers.onMenu,
    '[data-shelf]': handlers.onShelf,
  });
}

export function showPause(game, handlers) {
  const el = card(`
    <p class="kicker">Paused</p>
    <h2>Take a breath</h2>
    <p>The cats will wait. They are extremely good at waiting.</p>
    <button class="cta" data-resume>Back to looking</button>
    <button class="cta ghost" data-shelf>The shelf</button>
    <button class="cta ghost" data-menu>Leave this job</button>
  `);
  wire(el, {
    '[data-resume]': handlers.onResume,
    '[data-shelf]': handlers.onShelf,
    '[data-menu]': handlers.onMenu,
  });
}

export function showShelf(game, handlers) {
  const all = catalogue();
  const slots = all.map((type) => {
    const n = game.save.collection[type] || 0;
    const def = FINDS[type];
    if (!n) return `<div class="slot empty"><div class="ghost-box">?</div><small>—</small></div>`;
    return `<div class="slot" data-icon="${type}"><small>${def.name}</small>${n > 1 ? `<b>×${n}</b>` : ''}</div>`;
  }).join('');

  const el = card(`
    <p class="kicker">Behind the counter</p>
    <h2>The shelf</h2>
    <p>${game.collectionCount()} of ${all.length} kinds of thing recovered, catalogued and waiting to be claimed.</p>
    <div class="shelf">${slots}</div>
    <button class="cta" data-back>Back</button>
  `);
  el.querySelectorAll('[data-icon]').forEach((n) => n.prepend(renderIcon(n.dataset.icon, 46)));
  wire(el, { '[data-back]': handlers.onBack });
}
