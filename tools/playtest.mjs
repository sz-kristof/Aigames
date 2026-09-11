/* Plays a level for real: clicks every hidden object through the canvas, then
 * checks the completion flow. Catches hit-testing and camera bugs that
 * screenshots alone would not. */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const OUT = process.env.SHOT_DIR || 'shots';
const BASE = process.env.BASE || 'http://localhost:8080';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--force-device-scale-factor=1', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });

await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await sleep(800);

const fails = [];
const check = (ok, msg) => { console.log(`${ok ? 'ok  ' : 'FAIL'}  ${msg}`); if (!ok) fails.push(msg); };

check(await page.isVisible('[data-play]'), 'title card is shown');
await page.click('[data-play]');
await sleep(400);
check(await page.isVisible('[data-level="0"]'), 'level select lists the first job');
check(await page.isVisible('.level.locked'), 'later jobs start locked');

for (const level of [0, 1, 2]) {
  if (level > 0) {
    // unlocked by finishing the previous one
    await page.evaluate((i) => window.__game.goto(i), level);
  } else {
    await page.click('[data-level="0"]');
  }
  await sleep(400);
  check(await page.isVisible('[data-go]'), `level ${level}: brief card shown`);
  await page.click('[data-go]');
  await sleep(900);

  const total = await page.evaluate(() => window.__game.scene.finds.length);
  check(total === 10, `level ${level}: ten things on the list`);

  for (let i = 0; i < total; i++) {
    const target = await page.evaluate((idx) => {
      const { scene, camera } = window.__game;
      const f = scene.finds.filter((x) => !x.found)[0];
      if (!f) return null;
      camera.x = f.x; camera.y = f.y; camera.zoom = 1.2; camera.target = null; camera.clamp();
      const defH = f.h || 0;
      return { id: f.id, type: f.type, x: f.x, y: f.y };
    }, i);
    if (!target) break;
    await sleep(90);
    const pt = await page.evaluate((t) => {
      const { camera, scene } = window.__game;
      const f = scene.finds.find((x) => x.id === t.id);
      const h = (window.__propHeight || ((ty) => 0))(f.type);
      return camera.worldToScreen(f.x, f.y - 12);
    }, target);
    await page.mouse.click(pt.x, pt.y);
    await sleep(120);
  }

  const left = await page.evaluate(() => window.__game.scene.remaining());
  check(left === 0, `level ${level}: every item found by clicking (${left} left)`);
  await sleep(2200);
  check(await page.isVisible('.starrow'), `level ${level}: results card appears`);
  if (level === 0) await page.screenshot({ path: `${OUT}/40-complete.png` });
  await page.click('[data-menu]');
  await sleep(500);
}

check(await page.isVisible('[data-shelf]'), 'shelf button available');
await page.click('[data-shelf]');
await sleep(500);
await page.screenshot({ path: `${OUT}/41-shelf.png` });
const collected = await page.evaluate(() => window.__game.game.collectionCount());
check(collected === 30, `shelf holds every recovered item (${collected})`);

await page.click('[data-back]');
await sleep(400);
const unlocked = await page.evaluate(() => [0, 1, 2].map((i) => window.__game.game.unlocked(i)));
check(unlocked.every(Boolean), 'all jobs unlocked after finishing them');
await page.screenshot({ path: `${OUT}/42-levels.png` });

if (errors.length) { console.log('\nPAGE ERRORS:'); errors.slice(0, 10).forEach((e) => console.log(' -', e)); }
await browser.close();
console.log(fails.length ? `\n${fails.length} failing check(s)` : '\nall checks passed');
process.exit(fails.length || errors.length ? 1 : 0);
