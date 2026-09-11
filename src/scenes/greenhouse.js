/* Level 3 — Fernbell Glasshouse, under the glass after the rain. */

import { Scene } from '../game/scene.js';
import { greenhouseBackdrop } from './backdrops.js';
import { P } from '../art/palette.js';

const BENCH = (y) => y - 94;
const CABINET = (y) => y - 116;
const CRATE = (y) => y - 60;
const STAND = (y) => y - 78;
const BARREL = (y) => y - 74;

export function buildGreenhouse() {
  const s = new Scene({
    id: 'greenhouse',
    name: 'Fernbell Glasshouse',
    sub: 'Under the glass, after the rain',
    blurb: 'Every visitor puts something down to touch a leaf, and half of them never pick it up again.',
    world: { w: 2400, h: 1500 },
    mood: 'greenhouse',
    seed: 3301,
    backdrop: greenhouseBackdrop,
    start: { x: 1140, y: 990, zoom: 0.95 },
    ambience: { kind: 'pollen', colour: '#fff4c2', count: 40 },
  });

  const put = (type, x, y, ownerY, opts = {}) =>
    s.add(type, x, y, Object.assign({ sort: ownerY + 0.5 }, opts));

  /* ------------------------------------------------------------- hanging */
  for (const [x, seed, c] of [[210, 3, '#5fb36a'], [560, 7, '#6bbd74'], [980, 11, '#4fa96a'],
    [1400, 5, '#6bbd74'], [1820, 9, '#5fb36a'], [2200, 13, '#4fa96a'], [2380, 17, '#6bbd74']]) {
    s.add('plant_hanging', x, 0, { drop: 120 + (seed % 4) * 44, seed, c });
  }
  s.add('vine_wall', 400, 200, { len: 270, seed: 2 });
  s.add('vine_wall', 1240, 180, { len: 310, seed: 6 });
  s.add('vine_wall', 2060, 210, { len: 250, seed: 9 });
  s.add('vine_wall', 760, 230, { len: 230, seed: 14 });
  s.add('vine_wall', 1700, 190, { len: 290, seed: 21 });
  s.add('string_lights', 160, 300, { x2: 1200, y2: 282, sag: 40, c: '#fff4c2', light: '#ffe6a0' });
  s.add('string_lights', 1240, 282, { x2: 2300, y2: 312, sag: 42, c: '#fff4c2', light: '#ffe6a0' });
  s.add('bunting', 520, 400, { x2: 1100, y2: 396, sag: 20, cols: ['#7fc7a6', '#ffe6a0', '#f4a2b4'] });

  /* ------------------------------------------------------ the big greens */
  s.add('palm', 190, 740, { seed: 5, h: 215 });
  s.add('palm', 2250, 780, { seed: 9, h: 195, flip: true });
  s.add('palm', 1640, 690, { seed: 14, h: 155, s: 0.88 });
  s.add('palm', 880, 700, { seed: 31, h: 140, s: 0.8, flip: true });
  s.add('tree_round', 570, 720, { seed: 4, h: 155, c: '#57a468' });
  s.add('tree_round', 1980, 700, { seed: 8, h: 128, c: '#4e9b5a', s: 0.92 });
  s.add('tree_round', 1160, 730, { seed: 26, h: 112, c: '#4a9a5e', s: 0.82 });
  s.add('bush', 760, 800, { w: 132, seed: 6, berries: P.red });
  s.add('bush', 1420, 790, { w: 118, seed: 11 });
  s.add('bush', 2110, 920, { w: 150, seed: 3, berries: P.gold });
  s.add('bush', 300, 980, { w: 128, seed: 19 });
  s.add('bush', 1560, 900, { w: 110, seed: 23, berries: P.rose });
  s.add('plant_monstera', 1080, 740, { seed: 7 });
  s.add('plant_monstera', 420, 920, { seed: 12, s: 1.1 });
  s.add('plant_monstera', 2340, 1120, { seed: 29, s: 0.94 });
  s.add('plant_fern', 1480, 800, { seed: 2 });
  s.add('plant_fern', 700, 880, { seed: 18 });
  s.add('plant_fern', 2310, 1000, { seed: 22, s: 1.1 });
  s.add('plant_fern', 1760, 860, { seed: 37, s: 0.86 });
  s.add('cactus', 250, 1140, { flower: true });
  s.add('cactus', 330, 1196, { s: 0.82 });
  s.add('cactus', 186, 1230, { s: 0.7, flower: true });

  /* ----------------------------------------------------- potting benches */
  s.add('work_bench', 660, 1080, { w: 320, c: '#c99a5e' });
  put('seed_tray', 550, BENCH(1080), 1080);
  put('seed_tray', 622, BENCH(1080) + 2, 1080, { s: 0.9 });
  put('pot_plain', 700, BENCH(1080) + 2, 1080, { w: 42, h: 34 });
  put('succulent', 700, BENCH(1080), 1080);
  put('watering_can', 772, BENCH(1080) + 2, 1080, { c: '#7fb0c7' });
  put('clipboard', 506, BENCH(1080) + 2, 1080);
  put('jar', 744, BENCH(1080) + 3, 1080, { fill: '#9ac47a', lid: '#8a5a35' });
  put('bell_jar', 812, BENCH(1080) + 2, 1080, { inside: '#7fc7a6', s: 0.85 });
  s.add('stool', 560, 1150, { c: '#a98a5e' });
  s.add('sack', 850, 1136, { c: '#b7a077', spill: '#5b4433', sort: 1137 });

  s.add('work_bench', 1740, 1040, { w: 300, c: '#c99a5e' });
  put('pot_plain', 1636, BENCH(1040), 1040, { w: 46, h: 38, c: '#c9733f' });
  put('succulent', 1636, BENCH(1040) - 4, 1040);
  put('pot_plain', 1694, BENCH(1040) + 2, 1040, { w: 40, h: 32, c: '#b8663f' });
  put('seed_tray', 1760, BENCH(1040) + 2, 1040);
  put('bell_jar', 1828, BENCH(1040), 1040, { inside: '#7fc7a6' });
  put('jar', 1868, BENCH(1040) + 2, 1040, { fill: '#9ac47a', lid: '#8a5a35' });
  put('watering_can', 1600, BENCH(1040) + 2, 1040, { c: '#a8bfa0' });
  s.add('stool', 1880, 1104, { c: '#a98a5e' });

  s.add('work_bench', 1150, 1440, { w: 280, c: '#c99a5e' });
  put('seed_tray', 1060, BENCH(1440), 1440);
  put('pot_plain', 1140, BENCH(1440) + 2, 1440, { w: 44, h: 36 });
  put('plant_fern', 1140, BENCH(1440) + 2, 1440, { s: 0.5, seed: 44 });
  put('watering_can', 1230, BENCH(1440) + 2, 1440, { c: '#7fb0c7', s: 0.9 });

  s.add('cabinet', 980, 940, { c: '#9fc4ae', w: 140, h: 116 });
  put('watering_can', 944, CABINET(940), 940, { c: '#a8bfa0' });
  put('pot_plain', 1014, CABINET(940) + 2, 940, { w: 36, h: 28 });
  put('succulent', 1014, CABINET(940), 940, { s: 0.85 });
  s.add('shelf_unit', 2290, 960, { rows: 3, h: 190, w: 136, seed: 8 });
  s.add('ladder', 1380, 1030, { h: 215 });
  s.add('wheelbarrow', 1060, 1300, { c: '#8aa79a', fill: '#5b4433' });

  /* --------------------------------------------------------- ground kit */
  s.add('sack', 520, 1260, { c: '#b7a077', spill: '#5b4433' });
  s.add('sack', 578, 1296, { c: '#a89268', s: 0.92 });
  s.add('crate', 880, 1252, { w: 90, c: '#c99a5e' });
  put('pot_plain', 880, CRATE(1252), 1252, { w: 40, h: 32, c: '#b8663f' });
  s.add('crate', 956, 1300, { w: 76, c: '#b98a4e' });
  s.add('basket', 1490, 1240, { handle: true, c: '#cfa06a' });
  s.add('basket', 1560, 1286, { c: '#c09257' });
  s.add('barrel', 2140, 1290, { c: '#8aa79a' });
  put('watering_can', 2140, BARREL(1290), 1290, { c: '#7fb0c7', s: 0.85 });
  s.add('bin', 330, 1306, { c: '#9fb0c4' });
  s.add('box', 1900, 1330, { tape: true, c: '#c9a97a' });
  s.add('crate', 1820, 1380, { w: 80, c: '#b98a4e' });
  s.add('plant_stand', 1300, 1180, { c: '#a98a5e' });
  put('pot_plain', 1300, STAND(1180), 1180, { w: 44, h: 36, c: '#c9733f' });
  put('plant_fern', 1300, STAND(1180), 1180, { s: 0.6, seed: 51 });
  s.add('plant_stand', 620, 960, { c: '#a98a5e', h: 72 });
  put('succulent', 620, 960 - 70, 960);
  s.add('bench', 1980, 1200, { w: 176, c: '#a98a5e' });
  s.add('bench', 480, 1300, { w: 170, c: '#a98a5e' });


  /* ------------------------------------------- the centre of the house */
  // a plant theatre: tiered staging crowded with pots
  s.add('work_bench', 1180, 960, { w: 260, c: '#b98a4e' });
  for (const [dx, sc] of [[-100, 0.8], [-56, 0.9], [-10, 0.75], [40, 0.95], [92, 0.8]]) {
    put('pot_plain', 1180 + dx, BENCH(960) + 2, 960, { w: 40 * sc + 14, h: 32 * sc + 8, c: dx % 3 ? '#c9733f' : '#b8663f' });
    put(dx % 2 ? 'succulent' : 'plant_fern', 1180 + dx, BENCH(960), 960, { s: 0.5 * sc + 0.2, seed: 60 + dx });
  }

  // a specimen palm in a big tub, right of centre
  s.add('barrel', 1520, 1010, { c: '#a9866a' });
  put('palm', 1520, BARREL(1010) + 4, 1010, { s: 0.62, seed: 47, h: 150 });

  // stacks of empty pots and a trolley on the path
  s.add('crate', 1000, 1130, { w: 84, c: '#c99a5e' });
  put('pot_plain', 980, CRATE(1130), 1130, { w: 44, h: 36, c: '#c9733f' });
  put('pot_plain', 1026, CRATE(1130) + 2, 1130, { w: 38, h: 30, c: '#b8663f', s: 0.9 });
  s.add('pot_plain', 1120, 1160, { w: 56, h: 46, c: '#c9733f' });
  s.add('pot_plain', 1160, 1188, { w: 48, h: 40, c: '#b8663f' });
  s.add('pot_plain', 1088, 1200, { w: 42, h: 34, c: '#c9733f' });
  s.add('sack', 1260, 1090, { c: '#b7a077' });
  s.add('watering_can', 1240, 1140, { c: '#7fb0c7' });
  s.add('basket', 940, 1210, { handle: true, c: '#cfa06a' });
  s.add('seed_tray', 1340, 1280, { s: 0.95 });
  s.add('grass_tuft', 1060, 1060, { seed: 71 });
  s.add('flower_cluster', 1420, 1090, { cols: [P.butter, P.rose] });
  s.add('stone', 900, 1160, { w: 48 });

  /* ----------------------------------------------------------- the pond */
  s.add('pond', 1290, 1330, { w: 470, h: 205, c: '#b6aa96' });
  s.add('stone', 1030, 1300, { w: 60 });
  s.add('stone', 1560, 1288, { w: 48 });
  s.add('stone', 1180, 1432, { w: 54 });
  s.add('stone', 1420, 1224, { w: 44 });
  s.add('grass_tuft', 1000, 1330, { seed: 3 });
  s.add('grass_tuft', 1600, 1340, { seed: 8 });
  s.add('grass_tuft', 1100, 1250, { seed: 16 });
  s.add('flower_cluster', 950, 1362, { cols: [P.rose, P.butter] });
  s.add('flower_cluster', 1650, 1382, { cols: [P.lilac, P.coral] });
  s.add('lily', 1210, 1352);
  s.add('lily', 1370, 1378);

  /* ------------------------------------------------------- pots and beds */
  s.add('planter_box', 290, 1430, { w: 175, c: '#b9754a' });
  put('flower_cluster', 254, 1380, 1430, { cols: [P.rose, P.magenta] });
  put('flower_cluster', 322, 1382, 1430, { cols: [P.butter, P.coral] });
  s.add('planter_box', 2000, 1440, { w: 155, c: '#b9754a' });
  put('flower_cluster', 1976, 1392, 1440, { cols: [P.lilac, P.sky] });
  s.add('planter_box', 1580, 1120, { w: 140, c: '#b9754a' });
  put('grass_tuft', 1548, 1074, 1120, { seed: 29 });
  put('flower_cluster', 1608, 1076, 1120, { cols: [P.butter, P.rose] });

  s.scatter(['pot_plain', 'succulent'], { x: 150, y: 1060, w: 320, h: 320 }, 6, { sMin: 0.7, sMax: 1 });
  s.scatter(['pot_plain', 'succulent', 'grass_tuft'], { x: 1680, y: 1140, w: 620, h: 280 }, 10, { sMin: 0.7, sMax: 1.05 });
  s.scatter(['grass_tuft', 'stone', 'pot_plain'], { x: 120, y: 1400, w: 2200, h: 90 }, 12, { sMin: 0.7, sMax: 1 });
  s.scatter(['pot_plain', 'succulent'], { x: 440, y: 740, w: 1500, h: 70 }, 7, { sMin: 0.62, sMax: 0.9 });
  s.scatter(['seed_tray', 'clipboard', 'watering_can', 'basket', 'crate'],
    { x: 380, y: 950, w: 1700, h: 420 }, 10, { sMin: 0.72, sMax: 0.95 });

  /* -------------------------------------------------------------- living */
  s.actor('person', 900, 1030, { skin: '#d9a06b', hair: 'cap', hairCol: '#4a3b4f', shirt: '#9ac47a', trousers: '#6b5a4a', apron: '#e8dcc2',
    name: 'Gardener', dwell: true, speed: 24,
    talk: '"Mind the seed trays. And if you find my little magnifying glass, I would be in your debt."',
    route: [{ x: 900, y: 1030 }, { x: 1280, y: 1120, wait: 2.6 }, { x: 1680, y: 1160 }, { x: 1150, y: 1040, wait: 2 }] });
  s.actor('sol', 1960, 1260, { name: 'Auntie Sol',
    talk: 'Auntie Sol: "People come here to look at leaves. They leave with fewer possessions than they arrived with."' });
  s.actor('person', 480, 1276, { pose: 'sit', sort: 1301, skin: '#8a5a3c', hair: 'long', hairCol: '#2a2230', shirt: P.sky,
    name: 'Sketcher', talk: '"I have drawn this fern four times. I have lost three pencils doing it."' });
  s.actor('person', 2040, 1176, { pose: 'sit', sort: 1201, skin: '#f0c29a', hair: 'bun', hairCol: '#6e4a3a', shirt: P.coral,
    name: 'Visitor', talk: '"It rained all morning. In here you would never know."' });
  s.actor('pip', 1420, 1160, { name: 'Pip', dwell: true, speed: 26,
    talk: 'Pip: "Ten on the list. The gardener swears the birds take half of them."',
    route: [{ x: 1420, y: 1160 }, { x: 1720, y: 1240, wait: 2.4 }, { x: 1500, y: 1300 }, { x: 1250, y: 1180, wait: 2 }] });
  s.actor('cat_loaf', 690, 982, { coat: 'calico', sort: 1081, s: 0.9, name: 'Sorrel', talk: 'Sorrel has found the warmest square of glass in the county.' });
  s.actor('cat_sleep', 2170, 1216, { coat: 'siamese', sort: 1291, name: 'Thyme', talk: 'Thyme is asleep in a sunbeam and cannot be reasoned with.' });
  s.actor('cat_sit', 1490, 1196, { coat: 'blue', s: 0.9, sort: 1241, name: 'Bramble', talk: 'Bramble is watching the fish. The fish are unbothered.' });

  s.actor('butterfly', 760, 780, { c: '#f5c26b', float: { a: 14, f: 1.3 }, speed: 34,
    route: [{ x: 760, y: 780 }, { x: 1000, y: 700 }, { x: 1240, y: 790 }, { x: 980, y: 860 }] });
  s.actor('butterfly', 1720, 880, { c: '#e8a0c8', float: { a: 12, f: 1.7 }, speed: 30,
    route: [{ x: 1720, y: 880 }, { x: 1980, y: 820 }, { x: 2140, y: 920 }, { x: 1860, y: 960 }] });
  s.actor('butterfly', 420, 1060, { c: '#9fd8ef', float: { a: 10, f: 2.1 }, speed: 26,
    route: [{ x: 420, y: 1060 }, { x: 620, y: 1000 }, { x: 520, y: 1140 }] });
  s.actor('butterfly', 1280, 1000, { c: '#c8e8a0', float: { a: 11, f: 1.5 }, speed: 28,
    route: [{ x: 1280, y: 1000 }, { x: 1120, y: 940 }, { x: 1340, y: 920 }] });
  s.actor('bird', 1420, 940, { c: '#8fb4d9', dwell: true, speed: 40, name: 'Sparrow', talk: 'The sparrow considers you, then goes back to the seed tray.',
    route: [{ x: 1420, y: 940 }, { x: 1560, y: 990, wait: 2.2 }, { x: 1300, y: 1010, wait: 1.8 }] });
  s.actor('bird', 640, 1200, { c: '#c9a86a', dwell: true, speed: 36, name: 'Finch', talk: 'A finch, entirely unimpressed by you.',
    route: [{ x: 640, y: 1200 }, { x: 780, y: 1240, wait: 2 }, { x: 560, y: 1250, wait: 2.4 }] });
  s.actor('fish', 1230, 1330, { c: '#f08a4a', float: { a: 5, f: 1.1 }, speed: 22, sort: 1331,
    route: [{ x: 1230, y: 1330 }, { x: 1410, y: 1360 }, { x: 1290, y: 1300 }] });
  s.actor('fish', 1370, 1300, { c: '#f0c24a', float: { a: 4, f: 1.5 }, speed: 18, sort: 1331,
    route: [{ x: 1370, y: 1300 }, { x: 1190, y: 1370 }, { x: 1390, y: 1380 }] });

  /* --------------------------------------------------------------- finds */
  s.find('magnifier', 772, BENCH(1080) + 6, { sort: 1081, where: 'On the first potting bench, near the trays.' });
  s.find('thimble', 1790, BENCH(1040) + 8, { sort: 1041, where: 'On the second bench, by the bell jar.' });
  s.find('paintbrush', 552, 1276, { sort: 1301, where: 'Dropped beside the sketcher.' });
  s.find('seashell', 1560, 1266, { sort: 1289, where: 'On a stone at the pond edge.' });
  s.find('snowglobe', 2284, 852, { sort: 961, where: 'On the tall shelf.' });
  s.find('hairpin', 1492, 1198, { sort: 1241, where: 'In the basket by the ladder.' });
  s.find('postcard', 1418, 1240, { where: 'At the water’s edge, going soft.' });
  s.find('star_charm', 1084, 1250, { sort: 1301, where: 'In the wheelbarrow.' });
  s.find('photo', 362, 1282, { where: 'Blown against the bin.' });
  s.find('notebook', 878, 1196, { sort: 1253, where: 'Left on a crate near the middle.' });

  return s;
}
