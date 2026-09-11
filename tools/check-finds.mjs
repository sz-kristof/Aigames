/* Sanity check: every findable item must be clickable and on screen.
 * Flags anything drawn over a find, or a find that has drifted out of bounds. */

import { buildCafe } from '../src/scenes/cafe.js';
import { buildMarket } from '../src/scenes/market.js';
import { buildGreenhouse } from '../src/scenes/greenhouse.js';
import { getProp, propBounds } from '../src/art/props.js';

const scenes = [buildCafe(), buildMarket(), buildGreenhouse()];
let problems = 0;

for (const scene of scenes) {
  const all = [...scene.statics, ...scene.actors];
  console.log(`\n${scene.name} — ${scene.statics.length} props, ${scene.actors.length} actors, ${scene.finds.length} finds`);

  for (const f of scene.finds) {
    const def = getProp(f.type);
    const s = f.s || 1;
    const cx = f.x;
    const cy = f.y - (def.h * s) / 2;
    const fSort = f.sort ?? f.y;

    // The camera never scrolls past the world edge, so the world's bottom strip
    // always lands under the dock and its top strip under the title bar.
    const SAFE_BOTTOM = 210, SAFE_TOP = 130;
    if (cx < 60 || cx > scene.world.w - 60 || cy < SAFE_TOP || cy > scene.world.h - SAFE_BOTTOM) {
      console.log(`  ! ${f.type} sits in a HUD keep-out zone at ${Math.round(cx)},${Math.round(cy)}`);
      problems++;
    }

    const over = all.filter((o) => {
      if (o === f) return false;
      const oSort = o.sort ?? o.y;
      if (oSort <= fSort) return false;
      const b = propBounds(o);
      return cx > b.x0 + 6 && cx < b.x1 - 6 && cy > b.y0 + 6 && cy < b.y1 - 6;
    });
    if (over.length) {
      console.log(`  ! ${f.type} (${f.label}) may be hidden behind: ${over.map((o) => o.type).join(', ')}`);
      problems++;
    }

    // finds should not sit on top of each other either
    const near = scene.finds.filter((g) => g !== f && Math.hypot(g.x - f.x, g.y - f.y) < 70);
    if (near.length) {
      console.log(`  ! ${f.type} is crowded by ${near.map((g) => g.type).join(', ')}`);
      problems++;
    }
  }
}

console.log(problems ? `\n${problems} placement problem(s)` : '\nall finds clear');
process.exit(problems ? 1 : 0);
