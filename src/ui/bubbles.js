/* Speech bubbles pinned to a world position, so they track the camera and
 * follow characters as they walk. DOM, because text deserves real kerning. */

export class Bubbles {
  constructor() {
    this.layer = document.getElementById('bubble-layer');
    this.items = [];
  }

  /** anchor: an object with live x/y in world space (an actor works directly). */
  say(anchor, text, { dur = 4.2, offset = 0 } = {}) {
    this.items.filter((b) => b.anchor === anchor).forEach((b) => this.kill(b));
    const el = document.createElement('div');
    el.className = 'bubble';
    el.textContent = text;
    this.layer.appendChild(el);
    const item = { el, anchor, offset, life: dur };
    this.items.push(item);
    if (this.items.length > 3) this.kill(this.items[0]);
    return item;
  }

  kill(item) {
    const i = this.items.indexOf(item);
    if (i < 0) return;
    this.items.splice(i, 1);
    item.el.classList.add('fade');
    setTimeout(() => item.el.remove(), 420);
  }

  clear() {
    this.items.forEach((b) => b.el.remove());
    this.items.length = 0;
  }

  update(dt, camera) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const b = this.items[i];
      b.life -= dt;
      if (b.life <= 0) { this.kill(b); continue; }
      const p = camera.worldToScreen(b.anchor.x, b.anchor.y - (b.offset || 0));
      b.el.style.left = `${Math.round(p.x)}px`;
      b.el.style.top = `${Math.round(p.y - 18)}px`;
      const off = p.x < -120 || p.x > window.innerWidth + 120 || p.y < -80 || p.y > window.innerHeight + 120;
      b.el.style.visibility = off ? 'hidden' : 'visible';
    }
  }
}
