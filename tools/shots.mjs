/* Screenshot harness: boots the game headless and captures each scene so the
 * art can be reviewed without a browser in the loop. */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const OUT = process.env.SHOT_DIR || 'shots';
const BASE = process.env.BASE || 'http://localhost:8080';
const W = Number(process.env.W || 1440);
const H = Number(process.env.H || 860);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const shots = process.argv.slice(2);
const want = (name) => !shots.length || shots.includes(name);

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--force-device-scale-factor=1', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(BASE, { waitUntil: 'networkidle' });
await sleep(900);

if (want('title')) await page.screenshot({ path: `${OUT}/00-title.png` });

for (const [i, name] of ['cafe', 'market', 'greenhouse'].entries()) {
  if (!want(name)) continue;
  await page.evaluate((n) => window.__game.goto(n), i);
  await sleep(700);
  await page.screenshot({ path: `${OUT}/${i + 1}0-${name}-brief.png` });
  await page.click('[data-go]');
  await sleep(1400);
  await page.screenshot({ path: `${OUT}/${i + 1}1-${name}.png` });
  // zoomed in on the middle of the scene
  await page.evaluate(() => {
    const { camera, scene } = window.__game;
    camera.glideTo(scene.start.x, scene.start.y + 120, camera.minZoom * 2.1, 0.01);
  });
  await sleep(600);
  await page.screenshot({ path: `${OUT}/${i + 1}2-${name}-close.png` });
  await page.evaluate(() => window.__game.game.quit?.());
  await page.keyboard.press('Escape');
  await sleep(250);
  await page.click('[data-menu]').catch(() => {});
  await sleep(500);
}

if (errors.length) { console.log('PAGE ERRORS:'); errors.slice(0, 12).forEach((e) => console.log(' -', e)); }
else console.log('no page errors');
await browser.close();
