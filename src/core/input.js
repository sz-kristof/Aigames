/* Pointer handling: drag to pan, wheel/pinch to zoom, and a tap that is only
 * a tap if the pointer barely moved (so panning never mis-fires a "find"). */

const TAP_SLOP = 7;      // px of travel still counted as a tap
const TAP_TIME = 0.55;   // seconds

export function attachInput(canvas, camera, handlers = {}) {
  const pointers = new Map();
  let pinch = null;
  let moved = 0;
  let downAt = 0;
  let dragging = false;

  const local = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const hover = { x: 0, y: 0, inside: false };

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    const p = local(e);
    pointers.set(e.pointerId, p);
    if (pointers.size === 1) {
      moved = 0;
      downAt = performance.now();
      dragging = true;
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) };
      dragging = false;
    }
    handlers.onDown?.(p);
  });

  canvas.addEventListener('pointermove', (e) => {
    const p = local(e);
    hover.x = p.x; hover.y = p.y; hover.inside = true;
    const prev = pointers.get(e.pointerId);
    if (!prev) { handlers.onHover?.(p); return; }
    pointers.set(e.pointerId, p);

    if (pointers.size === 2 && pinch) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      if (pinch.dist > 0) camera.zoomAt(dist / pinch.dist, mid.x, mid.y);
      pinch.dist = dist;
      return;
    }

    const dx = p.x - prev.x, dy = p.y - prev.y;
    moved += Math.hypot(dx, dy);
    if (dragging) {
      camera.panBy(dx, dy);
      if (moved > TAP_SLOP) canvas.classList.add('grabbing');
    }
    handlers.onHover?.(p);
  });

  const release = (e) => {
    const p = pointers.get(e.pointerId) || local(e);
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    if (pointers.size === 0) {
      canvas.classList.remove('grabbing');
      const quick = (performance.now() - downAt) / 1000 < TAP_TIME;
      if (dragging && moved <= TAP_SLOP && quick) handlers.onTap?.(p);
      dragging = false;
      handlers.onUp?.(p);
    }
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => { hover.inside = false; });

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const p = local(e);
    const factor = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0016));
    camera.zoomAt(factor, p.x, p.y);
  }, { passive: false });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  window.addEventListener('keydown', (e) => {
    const step = 90;
    if (e.key === 'ArrowLeft') camera.panBy(step, 0);
    else if (e.key === 'ArrowRight') camera.panBy(-step, 0);
    else if (e.key === 'ArrowUp') camera.panBy(0, step);
    else if (e.key === 'ArrowDown') camera.panBy(0, -step);
    else if (e.key === '+' || e.key === '=') camera.zoomAt(1.18, camera.view.w / 2, camera.view.h / 2);
    else if (e.key === '-' || e.key === '_') camera.zoomAt(1 / 1.18, camera.view.w / 2, camera.view.h / 2);
    else { handlers.onKey?.(e); return; }
    e.preventDefault();
  });

  return { hover };
}
