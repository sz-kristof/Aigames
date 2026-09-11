/* Level 2 — Lantern Row, the night market in its last hour of trading.
 * Everything here is lit from above by paper lanterns, so the scene leans on
 * pools of warm light to keep the cobbles readable. */

import { Scene } from '../game/scene.js';
import { marketBackdrop } from './backdrops.js';
import { P } from '../art/palette.js';

const STALL = (y) => y - 106;
const CART = (y) => y - 106;
const SEAT = (y) => y - 44;
const CRATE = (y) => y - 60;
const BARREL = (y) => y - 74;

export function buildMarket() {
  const s = new Scene({
    id: 'market',
    name: 'Lantern Row',
    sub: 'Night market, last hour of trading',
    blurb: 'Stalls are packing up and the lantern light is doing nobody any favours. Ten things to find before the lamps go out.',
    world: { w: 2400, h: 1500 },
    mood: 'market',
    seed: 5511,
    backdrop: marketBackdrop,
    start: { x: 1140, y: 1010, zoom: 0.95 },
    ambience: { kind: 'embers', colour: '#ffc97a', count: 30 },
  });

  const put = (type, x, y, ownerY, opts = {}) =>
    s.add(type, x, y, Object.assign({ sort: ownerY + 0.5 }, opts));

  /* ------------------------------------------------- lanterns and wires */
  s.add('string_lights', 40, 200, { x2: 1160, y2: 180, sag: 46, c: '#ffd08a', light: '#ffb35c' });
  s.add('string_lights', 1200, 180, { x2: 2360, y2: 214, sag: 50, c: '#ffd08a', light: '#ffb35c' });
  s.add('string_lights', 60, 400, { x2: 1180, y2: 386, sag: 30, c: '#ffcf9a', light: '#ff9d6a' });
  s.add('bunting', 300, 320, { x2: 1060, y2: 330, sag: 24, cols: ['#e8615a', '#f2b23e', '#3ec5c0', '#e35d9b'] });
  s.add('bunting', 1400, 330, { x2: 2150, y2: 320, sag: 24, cols: ['#f2b23e', '#8f5ba8', '#e8615a', '#3ec5c0'] });

  const lanternX = [140, 330, 520, 720, 930, 1140, 1350, 1560, 1770, 1990, 2210, 2350];
  lanternX.forEach((x, i) => {
    s.add('lantern', x, 226 + (i % 3) * 28, {
      r: 17 + (i % 4) * 3, drop: 26 + (i % 3) * 18,
      c: ['#ef6b5e', '#f2a13e', '#e35d9b', '#f2b23e'][i % 4],
    });
  });
  s.add('lantern', 660, 500, { r: 22, drop: 40, c: '#ef6b5e' });
  s.add('lantern', 1930, 486, { r: 20, drop: 36, c: '#f2a13e' });
  s.add('lantern', 1260, 520, { r: 18, drop: 30, c: '#f2b23e' });


  /* ------------------------------------------------------------- stalls */
  const stallDefs = [
    { x: 360, c: '#6d4a63', awn: '#e35d9b', label: 'Dumplings' },
    { x: 1000, c: '#45536f', awn: '#3ec5c0', label: 'Noodles' },
    { x: 1660, c: '#6d5638', awn: '#f2b23e', label: 'Fruit' },
    { x: 2230, c: '#57497a', awn: '#8f5ba8', label: 'Trinkets' },
  ];
  const stalls = {};
  for (const d of stallDefs) {
    stalls[d.label] = s.add('stall', d.x, 760, { w: 300, c: d.c, top: '#d9b48a' });
    s.add('awning', d.x, 620, { w: 316, c: d.awn, c2: '#f7e3c8', sort: 700 });
    s.add('sign_hanging', d.x, 588, { label: d.label, c: '#f0dcc0', fs: 17, w: 176, sort: 699 });
    s.add('lantern', d.x - 150, 600, { r: 14, drop: 14, c: d.awn, sort: 701 });
    s.add('lantern', d.x + 150, 600, { r: 14, drop: 14, c: d.awn, sort: 701 });
  }
  const T = STALL(760);

  // dumplings
  put('steamer', 290, T, 760);
  put('steamer', 370, T, 760, { s: 0.85 });
  put('steamer', 330, T - 2, 760, { s: 0.7 });
  put('bowl', 438, T + 2, 760, { fill: '#f0c27a' });
  put('bowl', 466, T + 4, 760, { noodles: true, s: 0.9 });
  put('bottle', 480, T, 760, { c: '#6b8f5a', lid: P.red });
  put('skewers', 238, T, 760);
  put('jar', 262, T + 3, 760, { fill: '#c96a4a', lid: P.amber, s: 0.9 });
  put('stack_cups', 410, T + 2, 760, { c: '#f0dcc0' });

  // noodles
  put('bowl', 916, T, 760, { noodles: true });
  put('bowl', 966, T + 2, 760, { noodles: true, s: 0.92 });
  put('bowl', 1018, T + 4, 760, { fill: '#e8c07a' });
  put('jar', 1074, T, 760, { fill: '#c96a4a', lid: P.amber });
  put('jar', 1100, T - 2, 760, { fill: '#e0a94e', lid: P.mint, s: 0.86 });
  put('bottle', 1128, T, 760, { c: '#8f5ba8' });
  put('steamer', 872, T - 2, 760, { s: 0.8 });
  put('lamp_table', 1148, T - 2, 760, { c: '#ffd08a' });

  // fruit
  put('fruit_crate', 1570, T, 760, { seed: 3 });
  put('fruit_crate', 1660, T, 760, { seed: 8, fruit: ['#e8615a', '#f2b23e', '#e35d9b'] });
  put('fruit_crate', 1750, T, 760, { seed: 12, fruit: ['#7fc7a6', '#f2b23e', '#c9d94e'] });
  put('basket', 1518, T + 2, 760, { c: '#dab887', s: 0.8 });
  put('jar', 1798, T, 760, { fill: '#e0a94e', lid: P.red, s: 0.9 });

  // trinkets
  put('bell_jar', 2146, T, 760, { inside: P.teal });
  put('stack_books', 2200, T, 760, { n: 3, seed: 4 });
  put('jar', 2254, T, 760, { fill: P.lilac, lid: P.gold });
  put('parcel', 2304, T + 2, 760);
  put('music_box', 2346, T + 2, 760);
  put('bell_jar', 2104, T + 2, 760, { inside: P.rose, s: 0.8 });

  /* -------------------------------------------------------------- carts */
  s.add('cart', 700, 1020, { c: '#3e8f8a', w: 190 });
  put('steamer', 654, CART(1020), 1020, { s: 0.9 });
  put('bowl', 726, CART(1020) + 2, 1020, { noodles: true, s: 0.9 });
  put('lamp_table', 776, CART(1020), 1020, { c: '#ffd08a' });
  put('stack_cups', 620, CART(1020) + 2, 1020, { c: '#e8dcc2', s: 0.9 });
  s.add('lantern', 700, 856, { r: 15, drop: 20, c: '#f2b23e', sort: 1019 });

  s.add('cart', 1980, 1100, { c: '#7a4f9c', w: 170 });
  put('fruit_crate', 1944, CART(1100), 1100, { seed: 21, s: 0.9 });
  put('jar', 2014, CART(1100), 1100, { fill: P.rose, lid: P.mint });
  put('candle', 2046, CART(1100), 1100);
  s.add('lantern', 1980, 940, { r: 15, drop: 18, c: '#e35d9b', sort: 1099 });

  s.add('cart', 1320, 1230, { c: '#9c5a3e', w: 160 });
  put('fruit_crate', 1284, CART(1230), 1230, { seed: 44, s: 0.85, fruit: ['#e8615a', '#f2b23e'] });
  put('bottle', 1352, CART(1230), 1230, { c: '#5a8f6a' });
  put('bottle', 1368, CART(1230) + 2, 1230, { c: '#8f5ba8', s: 0.9 });

  /* ---------------------------------------------------- street furniture */
  s.add('post', 120, 900, { h: 300 });
  s.add('post', 2340, 930, { h: 300 });
  s.add('lantern', 120, 604, { r: 19, drop: 12, c: '#f2a13e', sort: 899 });
  s.add('lantern', 2340, 634, { r: 19, drop: 12, c: '#ef6b5e', sort: 929 });
  s.add('bench', 1180, 1080, { w: 190, c: '#8a6248' });
  s.add('bench', 380, 1180, { w: 176, c: '#8a6248' });
  s.add('bench', 1780, 1000, { w: 170, c: '#8a6248' });
  s.add('bin', 1450, 980, { c: '#5c6b7a' });
  s.add('bin', 880, 1320, { c: '#5c6b7a', s: 0.9 });
  s.add('fence', 2150, 870, { w: 150, c: '#87715c' });
  s.add('fence', 2290, 870, { w: 130, c: '#87715c' });
  s.add('chalkboard', 560, 940, { label: 'HOT', c: '#8a6248' });
  s.add('chalkboard', 1520, 1120, { label: 'FRESH', c: '#8a6248', s: 0.9 });
  s.add('stacked_chairs', 2080, 880, { c: '#5a7f8f' });
  s.add('coat_rack', 460, 800, { coat: '#c9884f', hat: '#8f5ba8', h: 180 });

  /* ----------------------------------------------------- crates and sacks */
  s.add('barrel', 900, 1180, { c: '#96693f' });
  put('lantern', 900, 1080, 1180, { r: 13, drop: 0, c: '#f2b23e' });
  s.add('barrel', 962, 1228, { c: '#8a6240' });
  s.add('barrel', 1616, 1330, { c: '#96693f', s: 0.9 });
  s.add('crate', 1500, 1250, { w: 92, c: '#a8794c' });
  put('fruit_crate', 1500, CRATE(1250), 1250, { seed: 51, s: 0.85 });
  s.add('crate', 1582, 1296, { w: 78, c: '#9a7047' });
  s.add('crate', 240, 1300, { w: 88, c: '#a8794c' });
  put('basket', 240, CRATE(1300), 1300, { c: '#c4a271', handle: true, s: 0.8 });
  s.add('box', 330, 1348, { tape: true, c: '#c4a271' });
  s.add('sack', 1100, 1300, { c: '#cdb68c' });
  s.add('sack', 1158, 1332, { c: '#c0aa80', s: 0.9 });
  s.add('sack', 640, 1250, { c: '#cdb68c', s: 0.92, spill: '#e0c07a' });
  s.add('basket', 1740, 1140, { handle: true, c: '#c4a271' });
  s.add('basket', 1816, 1188, { c: '#b89467' });
  s.add('fruit_crate', 2060, 1290, { seed: 33 });
  s.add('fruit_crate', 1200, 1400, { seed: 61, fruit: ['#e8615a', '#c9d94e'] });
  s.add('crate', 2280, 1180, { w: 84, c: '#a8794c' });
  s.add('wheelbarrow', 460, 1000, { c: '#9a4a3a', fill: '#8a6240' });
  s.add('suitcase', 1690, 950, { c: '#96693f' });
  s.add('umbrella_stand', 1050, 1150);

  /* ------------------------------------------------------- green and wet */
  s.add('planter_box', 1000, 1420, { w: 150, c: '#96693f' });
  put('flower_cluster', 980, 1374, 1420, { cols: [P.magenta, P.gold, P.coral] });
  put('flower_cluster', 1026, 1376, 1420, { cols: [P.lilac, P.rose] });
  s.add('pot_plain', 2300, 1230, { w: 52, c: '#a57054' });
  put('plant_fern', 2300, 1230, 1230, { s: 0.8, c: '#3f7f52' });
  s.add('pot_plain', 180, 1120, { w: 48, c: '#a57054' });
  put('plant_fern', 180, 1120, 1120, { s: 0.72, c: '#3f7f52' });
  s.add('bush', 2380, 1000, { w: 120, seed: 9, c: '#3d7a52' });
  s.add('puddle', 820, 1292, { c: '#6a9fc4' });
  s.add('puddle', 1420, 1440, { c: '#6a9fc4' });
  s.add('puddle', 2010, 1300, { c: '#6a9fc4' });
  s.add('puddle', 300, 1440, { c: '#6a9fc4' });
  s.add('mat', 1000, 838, { c: '#c98b53', w: 170 });
  s.add('mat', 360, 838, { c: '#b9754a', w: 165 });

  s.scatter(['crate', 'box', 'basket', 'sack'], { x: 100, y: 1380, w: 2200, h: 80 }, 9,
    { sMin: 0.7, sMax: 0.95, props: () => ({ c: '#9a7047' }) });
  s.scatter(['bottle', 'jar', 'lantern'], { x: 200, y: 1150, w: 2000, h: 280 }, 6, { sMin: 0.8, sMax: 1 });
  s.scatter(['pot_plain', 'stone', 'basket'], { x: 160, y: 950, w: 2100, h: 420 }, 9, { sMin: 0.7, sMax: 0.95 });


  /* --------------------------------------------------- the middle of the row */
  // lantern poles marching down the street
  for (const [x, y] of [[840, 1000], [1560, 1040], [2120, 1000], [300, 1040]]) {
    s.add('post', x, y, { h: 240, c: '#8a6248' });
    s.add('lantern', x, y - 250, { r: 17, drop: 10, c: '#f2b23e', sort: y - 1 });
  }
  s.add('string_lights', 300, 800, { x2: 840, y2: 760, sag: 26, c: '#ffd08a', light: '#ffb35c' });
  s.add('string_lights', 1560, 800, { x2: 2120, y2: 760, sag: 26, c: '#ffd08a', light: '#ffb35c' });

  // two small trestle stalls facing the other way
  s.add('work_bench', 1040, 1180, { w: 240, c: '#a8794c' });
  put('fruit_crate', 960, 1180 - 94, 1180, { seed: 71, s: 0.9 });
  put('fruit_crate', 1040, 1180 - 94, 1180, { seed: 72, s: 0.9, fruit: ['#e8615a', '#c9d94e'] });
  put('jar', 1116, 1180 - 94, 1180, { fill: '#e0a94e', lid: P.mint });
  put('lamp_table', 1146, 1180 - 94, 1180, { c: '#ffd08a' });
  s.add('awning', 1040, 1060, { w: 250, c: '#3ec5c0', c2: '#f7e3c8', sort: 1140 });

  s.add('work_bench', 1860, 1240, { w: 220, c: '#a8794c' });
  put('bell_jar', 1790, 1240 - 94, 1240, { inside: P.lilac, s: 0.9 });
  put('stack_books', 1860, 1240 - 94, 1240, { n: 3, seed: 27 });
  put('parcel', 1920, 1240 - 92, 1240, { s: 0.9 });
  put('candle', 1952, 1240 - 92, 1240);
  s.add('awning', 1860, 1120, { w: 232, c: '#e35d9b', c2: '#f7e3c8', sort: 1200 });

  s.add('table_round', 560, 1360, { w: 120, c: '#8a6248' });
  put('bowl', 540, 1360 - 68, 1360, { noodles: true });
  put('bowl', 584, 1360 - 64, 1360, { noodles: true, s: 0.9 });
  put('candle', 562, 1360 - 72, 1360);
  s.add('stool', 470, 1378, { c: '#8a6248' });
  s.add('stool', 650, 1378, { c: '#8a6248' });


  /* ------------------------------------------------- the near foreground */
  s.add('barrel', 180, 1400, { c: '#96693f' });
  s.add('barrel', 246, 1442, { c: '#8a6240' });
  s.add('crate', 700, 1440, { w: 96, c: '#a8794c' });
  s.add('crate', 790, 1478, { w: 82, c: '#9a7047' });
  s.add('sack', 1480, 1452, { c: '#cdb68c' });
  s.add('sack', 1540, 1478, { c: '#c0aa80', s: 0.92 });
  s.add('fruit_crate', 2180, 1440, { seed: 81, fruit: ['#e8615a', '#f2b23e'] });
  s.add('basket', 960, 1460, { handle: true, c: '#c4a271' });
  s.add('planter_box', 1720, 1460, { w: 160, c: '#96693f' });
  put('flower_cluster', 1690, 1414, 1460, { cols: [P.magenta, P.gold] });
  put('flower_cluster', 1750, 1416, 1460, { cols: [P.coral, P.lilac] });
  s.add('bench', 380, 1470, { w: 160, c: '#8a6248' });
  s.add('bin', 2380, 1420, { c: '#5c6b7a' });
  s.add('stacked_chairs', 1180, 1470, { c: '#7a6f8f' });
  s.add('post', 620, 1480, { h: 200, c: '#8a6248' });
  s.add('lantern', 620, 1250, { r: 16, drop: 12, c: '#ef6b5e', sort: 1479 });

  // more goods behind the counters
  put('basket', 260, T + 4, 760, { c: '#c4a271', s: 0.8, handle: true });
  put('parcel', 1912, T + 4, 760, { s: 0.85 });
  put('stack_books', 1560, T + 2, 760, { n: 2, seed: 63 });
  s.add('crate', 1330, 900, { w: 88, c: '#a8794c' });
  put('fruit_crate', 1330, CRATE(900), 900, { seed: 91, s: 0.9 });
  s.add('crate', 1408, 940, { w: 74, c: '#96693f' });
  s.add('barrel', 2340, 1140, { c: '#96693f' });
  s.add('sack', 760, 1400, { c: '#cdb68c', s: 0.95, spill: '#e0c07a' });
  s.add('umbrella_stand', 1620, 1180);
  s.add('coat_rack', 2200, 1420, { coat: '#3ec5c0', hat: '#e35d9b', h: 170 });
  s.add('magazine_rack', 1000, 1090);
  s.add('pot_plain', 1240, 950, { w: 50, c: '#a57054' });
  put('plant_fern', 1240, 950, 950, { s: 0.74, c: '#3f7f52' });
  s.add('bush', 60, 1220, { w: 110, seed: 17, c: '#3d7a52' });

  /* -------------------------------------------------------------- people */
  s.actor('pip', 1140, 980, { name: 'Pip',
    talk: 'Pip: "Ten tickets in the book tonight. Auntie Sol says the market always eats the small things."' });
  s.actor('person', 620, 880, { skin: '#8a5a3c', hair: 'bun', hairCol: '#2a2230', shirt: '#e0846b', trousers: '#3d4a6b', dwell: true, speed: 30,
    name: 'Stallholder', talk: '"Last of the dumplings, half price. Mind the crates."',
    route: [{ x: 620, y: 880 }, { x: 880, y: 940, wait: 2.5 }, { x: 1180, y: 900 }, { x: 820, y: 860, wait: 2 }] });
  s.actor('person', 1560, 940, { pose: 'sit', sort: 941, skin: '#f0c29a', hair: 'cap', hairCol: '#4a3b4f', shirt: P.teal,
    name: 'Fruit seller', talk: '"Peaches were sweet today. My reading glasses were not so lucky."' });
  s.actor('person', 2120, 1200, { skin: '#c98d5f', hair: 'long', hairCol: '#3d2e35', shirt: P.lilac, trousers: '#4d5b7c', dwell: true, speed: 26,
    name: 'Late shopper', talk: '"I had a little brass compass when I came in. I am fairly sure of it."',
    route: [{ x: 2120, y: 1200 }, { x: 1700, y: 1340, wait: 2 }, { x: 1160, y: 1300 }, { x: 1600, y: 1180, wait: 2.5 }] });
  s.actor('person', 320, 1148, { pose: 'sit', sort: 1149, skin: '#d9a06b', hair: 'short', hairCol: '#5a4436', shirt: '#c9884f',
    name: 'Old hand', talk: '"Been trading this row forty years. Still lose my keys weekly."' });
  s.actor('person', 1240, 1048, { pose: 'sit', sort: 1081, skin: '#8a5a3c', hair: 'curls', hairCol: '#2a2230', shirt: P.mint,
    name: 'Resting', talk: '"Five minutes. Then I carry the rest of the crates."' });
  s.actor('person', 1900, 820, { skin: '#f0c29a', hair: 'cap', hairCol: '#2f2531', shirt: '#5a8fd6', trousers: '#3d4a6b', dwell: true, speed: 22,
    name: 'Browser', talk: '"Just looking. That is what I always say, and it is never true."',
    route: [{ x: 1900, y: 820 }, { x: 2160, y: 880, wait: 3 }, { x: 1660, y: 900, wait: 2.4 }] });

  s.actor('cat_sit', 900, 1106, { coat: 'sooty', sort: 1181, s: 0.92, name: 'Stray', talk: 'A market cat. It is not lost. It is exactly where it means to be.' });
  s.actor('cat_loaf', 1780, 956, { coat: 'ginger', sort: 1001, s: 0.9, name: 'Bench cat', talk: 'This one has been on the bench since the lamps were lit.' });
  s.actor('cat_stand', 1850, 1420, { coat: 'tuxedo', dwell: true, speed: 34, name: 'Patrol',
    talk: 'The patrol is out, looking for dropped dumplings.',
    route: [{ x: 1850, y: 1420 }, { x: 1300, y: 1450, wait: 2 }, { x: 860, y: 1420 }, { x: 1500, y: 1390, wait: 2.6 }] });

  /* --------------------------------------------------------------- finds */
  s.find('camera', 1230, SEAT(1080) + 6, { sort: 1081, where: 'Left on the bench by the noodle stall.' });
  s.find('locket', 1046, T + 6, { sort: 761, where: 'On the noodle counter, near the jars.' });
  s.find('compass', 1540, 1300, { where: 'It rolled between the crates.' });
  s.find('harmonica', 352, T + 6, { sort: 761, where: 'On the dumpling counter.' });
  s.find('marble', 798, 1288, { where: 'In the puddle, catching the lamplight.' });
  s.find('origami', 2166, T + 6, { sort: 761, where: 'On the trinket stall, of course.' });
  s.find('whistle', 494, 952, { sort: 1001, where: 'In the wheelbarrow.' });
  s.find('toy_boat', 2034, 1296, { where: 'Near the far puddle.' });
  s.find('fountain_pen', 1716, 902, { sort: 951, where: 'Beside the suitcase.' });
  s.find('ring_jewel', 1146, 1268, { where: 'Half under a sack of rice.' });

  return s;
}
