/* The in-game chrome: title bar, wisp button, find strip, progress ring. */

import { renderIcon } from '../art/props.js';
import { formatTime } from '../game/state.js';

export class Hud {
  constructor(handlers = {}) {
    this.root = document.getElementById('hud');
    this.strip = document.getElementById('findstrip');
    this.timer = document.getElementById('timer');
    this.hintCount = document.getElementById('hint-count');
    this.hintBtn = document.getElementById('btn-hint');
    this.ring = document.getElementById('progress-ring');
    this.ringText = document.getElementById('progress-text');
    this.name = document.getElementById('scene-name');
    this.sub = document.getElementById('scene-sub');
    this.soundBtn = document.getElementById('btn-sound');
    this.toastEl = document.getElementById('toast');
    this.cards = new Map();
    this.toastTimer = null;

    this.hintBtn.addEventListener('click', () => handlers.onHint?.());
    document.getElementById('btn-menu').addEventListener('click', () => handlers.onMenu?.());
    this.soundBtn.addEventListener('click', () => handlers.onSound?.());
    this.onCard = handlers.onCard;
  }

  show() { this.root.hidden = false; }
  hide() { this.root.hidden = true; }

  setScene(scene) {
    this.name.textContent = scene.name;
    this.sub.textContent = scene.sub;
    this.strip.innerHTML = '';
    this.cards.clear();
    for (const item of scene.finds) {
      const card = document.createElement('button');
      card.className = 'find-card';
      card.type = 'button';
      card.title = item.label;
      card.appendChild(renderIcon(item.type, 46, { c: item.c }));
      const span = document.createElement('span');
      span.textContent = item.label;
      card.appendChild(span);
      card.addEventListener('click', () => this.onCard?.(item, card));
      this.strip.appendChild(card);
      this.cards.set(item.id, card);
    }
    this.setProgress(0, scene.finds.length);
  }

  markFound(item) {
    const card = this.cards.get(item.id);
    if (!card) return;
    card.classList.add('found');
    // slide the next unfound card into view so the list stays useful
    const next = [...this.strip.children].find((c) => !c.classList.contains('found'));
    next?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  nudge(card) {
    card.classList.remove('nudge');
    void card.offsetWidth;
    card.classList.add('nudge');
  }

  setWisps(n) {
    this.hintCount.textContent = n;
    this.hintBtn.disabled = n <= 0;
  }

  setTimer(sec) { this.timer.textContent = formatTime(sec); }

  setProgress(found, total) {
    this.ringText.textContent = `${found}/${total}`;
    this.ring.style.setProperty('--p', `${(found / Math.max(1, total)) * 360}deg`);
  }

  setSound(on) {
    this.soundBtn.classList.toggle('off', !on);
    this.soundBtn.innerHTML = on ? '&#9834;' : '&#9834;&#824;';
  }

  toast(html, ms = 2600) {
    this.toastEl.innerHTML = html;
    this.toastEl.hidden = false;
    this.toastEl.classList.remove('out');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastEl.classList.add('out');
      setTimeout(() => { this.toastEl.hidden = true; }, 450);
    }, ms);
  }
}
