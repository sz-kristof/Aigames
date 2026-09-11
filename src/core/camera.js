/* Pan/zoom camera over a fixed-size world, with easing for scripted moves. */

export class Camera {
  constructor(world) {
    this.world = world;              // { w, h }
    this.x = world.w / 2;
    this.y = world.h / 2;
    this.zoom = 1;
    this.minZoom = 0.4;
    this.maxZoom = 2.6;
    this.view = { w: 1, h: 1 };
    this.target = null;              // { x, y, zoom, t, dur, from }
  }

  /** Zoom at which the world exactly covers the viewport. */
  fitZoom() {
    return Math.max(this.view.w / this.world.w, this.view.h / this.world.h);
  }

  resize(w, h) {
    this.view.w = w;
    this.view.h = h;
    this.minZoom = this.fitZoom();
    this.maxZoom = Math.max(this.minZoom * 3.2, 2.4);
    this.zoom = Math.min(Math.max(this.zoom, this.minZoom), this.maxZoom);
    this.clamp();
  }

  clamp() {
    const hw = this.view.w / (2 * this.zoom);
    const hh = this.view.h / (2 * this.zoom);
    if (hw * 2 >= this.world.w) this.x = this.world.w / 2;
    else this.x = Math.min(Math.max(this.x, hw), this.world.w - hw);
    if (hh * 2 >= this.world.h) this.y = this.world.h / 2;
    else this.y = Math.min(Math.max(this.y, hh), this.world.h - hh);
  }

  panBy(dxScreen, dyScreen) {
    this.target = null;
    this.x -= dxScreen / this.zoom;
    this.y -= dyScreen / this.zoom;
    this.clamp();
  }

  /** Zoom keeping the world point under the given screen point pinned. */
  zoomAt(factor, sx, sy) {
    this.target = null;
    const before = this.screenToWorld(sx, sy);
    this.zoom = Math.min(Math.max(this.zoom * factor, this.minZoom), this.maxZoom);
    const after = this.screenToWorld(sx, sy);
    this.x += before.x - after.x;
    this.y += before.y - after.y;
    this.clamp();
  }

  /** Ease toward a world point — used by hints and the level intro sweep. */
  glideTo(x, y, zoom, dur = 0.8) {
    this.target = {
      x, y,
      zoom: Math.min(Math.max(zoom ?? this.zoom, this.minZoom), this.maxZoom),
      t: 0, dur,
      from: { x: this.x, y: this.y, zoom: this.zoom },
    };
  }

  update(dt) {
    const t = this.target;
    if (!t) return;
    t.t = Math.min(t.t + dt, t.dur);
    const k = t.t / t.dur;
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // easeInOutCubic
    this.x = t.from.x + (t.x - t.from.x) * e;
    this.y = t.from.y + (t.y - t.from.y) * e;
    this.zoom = t.from.zoom + (t.zoom - t.from.zoom) * e;
    this.clamp();
    if (t.t >= t.dur) this.target = null;
  }

  apply(ctx) {
    ctx.translate(this.view.w / 2, this.view.h / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
  }

  screenToWorld(sx, sy) {
    return {
      x: (sx - this.view.w / 2) / this.zoom + this.x,
      y: (sy - this.view.h / 2) / this.zoom + this.y,
    };
  }

  worldToScreen(wx, wy) {
    return {
      x: (wx - this.x) * this.zoom + this.view.w / 2,
      y: (wy - this.y) * this.zoom + this.view.h / 2,
    };
  }

  /** Visible world rect, padded, for culling. */
  bounds(pad = 120) {
    const hw = this.view.w / (2 * this.zoom) + pad;
    const hh = this.view.h / (2 * this.zoom) + pad;
    return { x0: this.x - hw, y0: this.y - hh, x1: this.x + hw, y1: this.y + hh };
  }
}
