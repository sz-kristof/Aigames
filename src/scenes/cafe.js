/* Level 1 — Mittens & Mochi, the cat café on Bellrope Lane.
 *
 * Surface heights are worked out from each prop's drawing, so anything placed
 * with put() sits on the furniture instead of hovering behind it. */

import { Scene } from '../game/scene.js';
import { cafeBackdrop } from './backdrops.js';
import { P } from '../art/palette.js';

const ROUND = (y) => y - 68;     // top of a round café table
const SQUARE = (y) => y - 72;    // top of a four-legged table
const COUNTER = (y) => y - 112;
const SEAT = (y) => y - 44;      // bench seat
const CRATE = (y) => y - 60;
const CABINET = (y) => y - 116;
const STAND = (y) => y - 78;
const CASE = (y) => y - 100;

export function buildCafe() {
  const s = new Scene({
    id: 'cafe',
    name: 'Mittens & Mochi',
    sub: 'The cat café on Bellrope Lane',
    blurb: 'Closing time, and the regulars have left half their lives behind. Eight cats, one lost-and-found box.',
    world: { w: 2400, h: 1500 },
    mood: 'cafe',
    seed: 1207,
    backdrop: cafeBackdrop,
    start: { x: 1080, y: 900, zoom: 0.95 },
    ambience: { kind: 'motes', colour: '#ffe3ad', count: 34 },
  });

  /** Place something on a surface: y is where it stands, ownerY is what it stands on. */
  const put = (type, x, y, ownerY, opts = {}) =>
    s.add(type, x, y, Object.assign({ sort: ownerY + 0.5 }, opts));

  /* ------------------------------------------------------------- ceiling */
  for (const x of [430, 900, 1380, 1860, 2280]) {
    s.add('lamp_pendant', x, 0, { drop: 240 + (x % 3) * 22, r: 32, c: x % 2 ? P.amber : P.mint });
  }
  s.add('plant_hanging', 1180, 0, { drop: 180, seed: 3 });
  s.add('plant_hanging', 2120, 0, { drop: 140, seed: 8, c: '#6bbd74' });
  s.add('plant_hanging', 250, 0, { drop: 165, seed: 12 });
  s.add('plant_hanging', 1650, 0, { drop: 120, seed: 21, c: '#57a45e' });
  s.add('string_lights', 100, 130, { x2: 1180, y2: 150, sag: 40 });
  s.add('string_lights', 1220, 150, { x2: 2320, y2: 120, sag: 44 });
  s.add('bunting', 420, 310, { x2: 1000, y2: 305, sag: 20 });

  /* ---------------------------------------------------------- back wall */
  s.add('shelf_unit', 180, 466, { rows: 4, seed: 2, h: 220 });
  s.add('shelf_unit', 350, 466, { rows: 4, seed: 5, h: 190, w: 140 });
  s.add('wall_shelf', 560, 320, { seed: 7 });
  s.add('wall_shelf', 660, 244, { seed: 11, w: 96 });
  s.add('wall_frame', 800, 330, { v: 0, art2: P.mint });
  s.add('wall_frame', 884, 296, { v: 1, w: 58, h: 70 });
  s.add('wall_frame', 842, 412, { v: 2, w: 74, h: 58 });
  s.add('wall_clock', 990, 272, { c: P.red });
  s.add('sign_hanging', 1170, 336, { label: 'Mittens & Mochi', c: P.mint, fs: 17, w: 244 });
  s.add('wall_shelf', 1330, 300, { seed: 3, w: 104 });
  s.add('window_arch', 1580, 466, { curtain: '#f0a9a0', sky: '#bfe6f5' });
  s.add('window_arch', 1920, 466, { curtain: '#f0a9a0', sky: '#bfe6f5' });
  s.add('vine_wall', 1760, 190, { len: 220, seed: 4 });
  s.add('door_arch', 2250, 466, { c: '#4f9c8b' });
  s.add('wall_frame', 2090, 336, { v: 1, w: 62, h: 76, art2: P.rose });
  s.add('wall_frame', 2110, 430, { v: 2, w: 58, h: 46 });

  /* ------------------------------------------------------------ counter */
  const cy = 650;
  s.add('counter', 640, cy, { w: 520, c: '#8a5233', top: '#f0dcc0' });
  const ct = COUNTER(cy);
  put('espresso_machine', 462, ct + 2, cy);
  put('register', 826, ct + 2, cy);
  put('pastry_case', 640, ct + 4, cy, { w: 150, seed: 4, s: 0.78 });
  put('stack_cups', 736, ct + 2, cy);
  put('stack_cups', 758, ct + 4, cy, { c: P.mint, s: 0.9 });
  put('tip_jar', 878, ct + 2, cy);
  put('jar', 540, ct + 2, cy, { fill: '#e3a15a', lid: P.mint });
  put('jar', 564, ct + 4, cy, { fill: P.rose, lid: P.amber, s: 0.86 });
  put('teapot', 392, ct + 4, cy, { c: '#e0846b' });
  put('cup', 706, ct + 2, cy, { steam: true });
  put('cup', 688, ct + 5, cy, { c: P.mint, fill: '#c98b53' });
  put('menu_card', 900, ct + 4, cy);
  put('napkin_holder', 800, ct + 4, cy);
  put('radio', 350, ct + 4, cy, { talk: 'The little radio hums a tune from three summers ago.' });
  put('vase_flowers', 596, ct + 2, cy, { seed: 6, c: P.sky, s: 0.8 });

  /* ------------------------------------------------------- counter front */
  s.add('stool', 430, 742, { c: '#8a5233' });
  s.add('stool', 520, 748, { c: '#8a5233' });
  s.add('stool', 610, 742, { c: '#8a5233' });
  s.add('stool', 700, 748, { c: '#8a5233' });
  s.add('cabinet', 150, 760, { c: '#6fbfa8', w: 150 });
  put('stack_books', 120, CABINET(760), 760, { n: 3, seed: 9 });
  put('vase_flowers', 186, CABINET(760), 760, { seed: 2, c: P.coral });
  s.add('chalkboard', 1230, 760, { label: 'TODAY' });
  s.add('pastry_case', 1010, 742, { seed: 9, w: 176 });
  put('cake', 970, CASE(742), 742, { icing: P.mint });
  put('cake', 1046, CASE(742), 742, { icing: P.butter });
  s.add('bin', 1140, 660, { c: '#9fb0c4' });
  s.add('plant_monstera', 1400, 660, { seed: 5, s: 0.9 });
  s.add('plant_fern', 900, 640, { seed: 14, s: 0.74 });
  s.add('magazine_rack', 1320, 690);
  s.add('coat_rack', 2370, 820, { coat: '#5a8fd6', hat: '#c9884f' });
  s.add('umbrella_stand', 2310, 900);
  s.add('cat_tower', 2140, 960);

  /* -------------------------------------------------------- seating plan */
  s.add('rug', 1120, 1200, { c: '#d9705f', w: 470, h: 236 });
  s.add('mat', 2250, 620, { c: '#c98b53', w: 170 });

  // 1 — window-side round table
  s.add('table_round', 430, 900, { w: 132, c: '#c98b53' });
  s.add('chair', 344, 916, { c: P.red });
  s.add('chair', 516, 916, { c: P.mint, flip: true });
  put('cup', 408, ROUND(900), 900, { steam: true });
  put('cup', 450, ROUND(900) + 4, 900, { c: '#f4a2b4', fill: '#7a4a2c' });
  put('plate', 472, ROUND(900) + 6, 900);
  put('cake', 472, ROUND(900) + 5, 900, { icing: P.rose });
  put('napkin_holder', 386, ROUND(900) + 5, 900);
  put('menu_card', 430, ROUND(900) - 2, 900);

  // 2 — the laptop table
  s.add('table_square', 860, 856, { w: 154, c: '#d9a76c' });
  s.add('chair', 762, 874, { c: P.amber });
  s.add('chair', 958, 874, { c: P.sky, flip: true });
  put('laptop', 876, SQUARE(856), 856, { screen: '#a8e6d4' });
  put('mug', 806, SQUARE(856) + 3, 856, { c: P.teal });
  put('book_open', 926, SQUARE(856) + 4, 856);
  put('croissant', 800, SQUARE(856) + 6, 856);
  put('paper_stack', 940, SQUARE(856) + 7, 856);
  put('succulent', 866, SQUARE(856) - 4, 856, { s: 0.8 });

  // 3 — tea for two
  s.add('table_round', 1260, 1000, { w: 140, c: '#c98b53' });
  s.add('chair', 1172, 1018, { c: P.lilac });
  s.add('chair', 1350, 1018, { c: P.coral, flip: true });
  put('teapot', 1250, ROUND(1000), 1000, { c: P.sky });
  put('cup', 1296, ROUND(1000) + 5, 1000, { c: '#fff2df' });
  put('cup', 1212, ROUND(1000) + 6, 1000, { c: '#fff2df', steam: false });
  put('macaron', 1272, ROUND(1000) + 8, 1000, { c: P.mint });
  put('macaron', 1284, ROUND(1000) + 9, 1000, { c: P.rose });
  put('plate', 1278, ROUND(1000) + 10, 1000);

  // 4 — the flower table
  s.add('table_round', 640, 1190, { w: 128, c: '#b9754a' });
  s.add('chair', 554, 1206, { c: P.mint });
  s.add('chair', 726, 1206, { c: P.amber, flip: true });
  put('vase_flowers', 636, ROUND(1190) - 2, 1190, { seed: 6, c: P.sky });
  put('menu_card', 680, ROUND(1190) + 4, 1190);
  put('donut', 598, ROUND(1190) + 6, 1190, { icing: P.rose });
  put('cup', 674, ROUND(1190) + 8, 1190, { c: P.butter });

  // 5 — the long table
  s.add('table_square', 1580, 1170, { w: 168, c: '#d9a76c' });
  s.add('chair', 1472, 1188, { c: P.red });
  s.add('chair', 1688, 1188, { c: P.teal, flip: true });
  put('bowl', 1540, SQUARE(1170) + 4, 1170, { fill: '#f0c27a' });
  put('stack_books', 1636, SQUARE(1170) + 2, 1170, { n: 3, seed: 2 });
  put('cup', 1586, SQUARE(1170) + 6, 1170, { c: P.butter });
  put('plate', 1610, SQUARE(1170) + 8, 1170);
  put('croissant', 1610, SQUARE(1170) + 7, 1170);
  put('lamp_table', 1520, SQUARE(1170) - 2, 1170, { c: '#ffe6a0' });

  // 6 — window bench nook
  s.add('bench', 1740, 700, { w: 300, c: '#a9713f' });
  s.add('cushion', 1650, SEAT(700) + 4, { c: P.rose, sort: 701 });
  s.add('cushion', 1840, SEAT(700) + 4, { c: P.mint, sort: 701 });
  s.add('table_round', 1990, 748, { w: 104, c: '#b9754a' });
  put('cup', 1968, ROUND(748) + 2, 748, { c: P.coral });
  put('plate', 2012, ROUND(748) + 6, 748);
  put('croissant', 2012, ROUND(748) + 5, 748);
  put('book_open', 1962, ROUND(748) + 8, 748);

  // 7 — the corner two-top
  s.add('table_round', 1010, 1330, { w: 120, c: '#c98b53' });
  s.add('chair', 930, 1346, { c: P.sky });
  s.add('chair', 1090, 1346, { c: P.rose, flip: true });
  put('mug', 990, ROUND(1330) + 2, 1330, { c: P.coral });
  put('mug', 1032, ROUND(1330) + 5, 1330, { c: P.mint });
  put('stack_books', 1006, ROUND(1330) - 2, 1330, { n: 2, seed: 15 });

  // 8 — the sofa corner
  s.add('sofa', 2120, 1240, { w: 190, c: '#d98b6a' });
  s.add('cushion', 2060, 1190, { c: P.butter, sort: 1241 });
  s.add('cushion', 2180, 1194, { c: P.teal, sort: 1241 });
  s.add('table_round', 1930, 1300, { w: 104, c: '#b9754a' });
  put('teapot', 1918, ROUND(1300) + 2, 1300, { c: P.mint });
  put('cup', 1958, ROUND(1300) + 6, 1300, { c: P.paper });
  s.add('floor_lamp', 2330, 1240, { c: '#ffe0a8' });


  // 9 — the long communal table down the middle of the room
  s.add('table_square', 1180, 790, { w: 300, d: 58, c: '#c08a52' });
  for (const x of [1060, 1180, 1300]) s.add('stool', x, 852, { c: '#8a5233' });
  s.add('chair', 1050, 748, { c: P.butter });
  s.add('chair', 1310, 748, { c: P.lilac, flip: true });
  put('stack_books', 1090, SQUARE(790) + 2, 790, { n: 3, seed: 31 });
  put('vase_flowers', 1180, SQUARE(790) - 4, 790, { seed: 17, c: P.mint });
  put('cup', 1130, SQUARE(790) + 6, 790, { c: P.coral, steam: true });
  put('cup', 1236, SQUARE(790) + 7, 790, { c: P.sky });
  put('plate', 1262, SQUARE(790) + 8, 790);
  put('donut', 1262, SQUARE(790) + 7, 790, { icing: P.butter });
  put('bowl', 1300, SQUARE(790) + 6, 790, { fill: '#f0c27a' });
  put('napkin_holder', 1076, SQUARE(790) + 8, 790);

  // 10 — low table on the rug, so the middle of the room has a centre
  s.add('table_round', 1120, 1160, { w: 118, c: '#a9713f' });
  put('stack_books', 1098, ROUND(1160), 1160, { n: 4, seed: 23 });
  put('mug', 1152, ROUND(1160) + 6, 1160, { c: P.teal });
  put('cat_toy', 1132, ROUND(1160) + 9, 1160, { c: P.coral });
  s.add('cushion', 1010, 1120, { c: P.lilac, sort: 1121 });
  s.add('cushion', 1240, 1128, { c: P.butter, sort: 1129 });

  // greenery breaking up the open floor
  s.add('plant_monstera', 1720, 880, { seed: 27, s: 0.92 });
  s.add('plant_fern', 830, 1060, { seed: 33, s: 0.9 });
  s.add('plant_fern', 1900, 1040, { seed: 41, s: 0.84 });
  s.add('plant_stand', 500, 1020, { c: '#8a5233', h: 74 });
  put('pot_plain', 500, 1020 - 72, 1020, { w: 42, h: 34, c: '#b8663f' });
  put('succulent', 500, 1020 - 72, 1020, { s: 0.9 });
  s.add('pot_plain', 2020, 880, { w: 58, h: 48, c: '#c9733f' });
  put('plant_fern', 2020, 880, 880, { s: 0.66, seed: 12 });
  s.add('cactus', 690, 1420, { s: 0.86 });

  // bags and bits left under chairs
  s.add('suitcase', 1000, 916, { c: '#7a4a6c', s: 0.8, sort: 917 });
  s.add('basket', 1420, 1080, { handle: true, c: '#cfa06a', s: 0.9 });
  s.add('box', 1780, 1310, { c: '#c99a5e', s: 0.9 });
  s.add('crate', 560, 1330, { w: 72, c: '#b98a4e' });
  put('basket', 560, CRATE(1330), 1330, { c: '#dcae72', s: 0.7 });
  s.add('bin', 1990, 940, { c: '#b9c4cf', s: 0.85 });
  s.add('magazine_rack', 300, 940);
  s.add('mat', 1700, 1400, { c: '#9fc4ae', w: 160 });
  s.add('rug', 480, 1100, { c: '#d9a76c', w: 300, h: 150 });

  /* ------------------------------------------------------- floor clutter */
  s.add('plant_stand', 1470, 1020, { c: '#8a5233' });
  put('pot_plain', 1470, STAND(1020), 1020, { w: 44, h: 36 });
  put('plant_fern', 1470, STAND(1020), 1020, { s: 0.62, seed: 19 });
  s.add('plant_stand', 260, 1060, { c: '#8a5233', h: 70 });
  put('succulent', 260, 1060 - 68, 1060);
  s.add('plant_monstera', 100, 1020, { seed: 9 });
  s.add('cactus', 2040, 1390, { flower: true });
  s.add('cat_bed', 1400, 1330, { c: '#e0846b' });
  s.add('cat_bed', 330, 1410, { c: '#8fd0c4' });
  s.add('basket', 880, 1430, { handle: true, c: '#dcae72' });
  s.add('basket', 300, 1220, { c: '#cfa06a', w: 64 });
  s.add('crate', 2300, 1090, { w: 84, c: '#c99a5e' });
  put('stack_books', 2294, CRATE(1090), 1090, { n: 3, seed: 11 });
  s.add('box', 2210, 1160, { tape: true });
  s.add('suitcase', 190, 1330, { c: '#a9713f' });
  s.add('stacked_chairs', 1860, 1430, { c: P.mint });
  s.add('stool', 1300, 1420, { c: '#8a5233' });
  s.add('yarn_ball', 1180, 1260, { c: P.magenta, sort: 1261 });
  s.add('yarn_ball', 1466, 1372, { c: P.sky });
  s.add('cat_toy', 760, 1380, { c: '#5a8fd6' });
  s.add('cat_toy', 2000, 1120, { c: P.coral });
  s.add('bell_jar', 190, 786, { inside: P.rose, sort: 787 });

  s.scatter(['basket', 'box', 'crate', 'cushion'],
    { x: 380, y: 1430, w: 1500, h: 60 }, 7, { sMin: 0.72, sMax: 0.95 });
  s.scatter(['succulent', 'pot_plain'], { x: 120, y: 1440, w: 2160, h: 50 }, 6, { sMin: 0.7, sMax: 0.95 });
  s.scatter(['cushion', 'yarn_ball', 'cat_toy'], { x: 300, y: 1260, w: 1800, h: 200 }, 7, { sMin: 0.8, sMax: 1 });
  s.scatter(['stool'], { x: 1740, y: 960, w: 560, h: 180 }, 3, { sMin: 0.85, sMax: 1 });
  s.scatter(['yarn_ball', 'cat_toy', 'book_open', 'paper_stack', 'cushion'],
    { x: 240, y: 920, w: 1960, h: 540 }, 8, { sMin: 0.8, sMax: 1 });
  s.scatter(['pot_plain', 'succulent', 'basket', 'box', 'cushion', 'stool'],
    { x: 200, y: 940, w: 2050, h: 480 }, 13, { sMin: 0.72, sMax: 0.98 });

  /* --------------------------------------------------------------- cats */
  s.actor('cat_sit', 1150, 1170, { coat: 'ginger', collar: P.red, name: 'Mochi', talk: 'Mochi blinks slowly at you. That is cat for hello.' });
  s.actor('cat_loaf', 1040, 1226, { coat: 'tabby', name: 'Biscuit', talk: 'Biscuit is a loaf. Biscuit will not be moved.' });
  s.actor('cat_sleep', 1400, 1322, { coat: 'snow', sort: 1331, name: 'Sugar', talk: 'Sugar snores. It is a very small snore.' });
  s.actor('cat_sit', 2140, 748, { coat: 'tuxedo', s: 0.92, sort: 961, name: 'Domino', talk: 'Domino surveys the café from the high shelf, as is his right.' });
  s.actor('cat_loaf', 700, 534, { coat: 'calico', s: 0.9, sort: 651, name: 'Pickle', talk: 'Pickle is on the counter again. Pickle knows.' });
  s.actor('cat_sit', 1712, 660, { coat: 'blue', s: 0.95, sort: 701, name: 'Juniper', talk: 'Juniper has claimed the window bench and all light within it.' });
  s.actor('cat_sleep', 330, 1400, { coat: 'siamese', s: 0.9, sort: 1411, name: 'Custard', talk: 'Custard sleeps in the bed. Custard is the bed now.' });
  s.actor('cat_stand', 1540, 900, { coat: 'sooty', name: 'Smudge', dwell: true, speed: 30, talk: 'Smudge trots past on important business.',
    route: [{ x: 1540, y: 900 }, { x: 1880, y: 1000, wait: 2.4 }, { x: 2010, y: 880 }, { x: 1700, y: 860, wait: 3 }] });

  /* -------------------------------------------------------------- people */
  s.actor('sol', 560, 566, { sort: 651, name: 'Auntie Sol',
    talk: 'Auntie Sol: "Eight cats, and every one of them a professional thief. Check under the cushions."' });
  s.actor('person', 762, 880, { pose: 'sit', sort: 881, skin: '#c98d5f', hair: 'long', hairCol: '#2f2531', shirt: P.lilac, trousers: '#4d5b7c',
    name: 'Reader', talk: '"Two hundred pages in and I have lost my spectacles. Again."' });
  s.actor('person', 1350, 1024, { pose: 'sit', sort: 1025, skin: '#f0c29a', hair: 'cap', hairCol: '#3d6e8f', shirt: P.coral,
    name: 'Regular', talk: '"The lemon cake. Always the lemon cake."' });
  s.actor('person', 520, 720, { pose: 'sit', sort: 749, skin: '#8a5a3c', hair: 'bun', hairCol: '#2a2230', shirt: '#e0846b',
    name: 'At the bar', talk: '"One more coffee and then I really am going home."' });
  s.actor('person', 1650, 682, { pose: 'sit', sort: 705, skin: '#f0c29a', hair: 'curls', hairCol: '#6e4a3a', shirt: P.mint,
    name: 'By the window', talk: '"It is the good kind of quiet in here."' });
  s.actor('person', 300, 1140, { skin: '#8a5a3c', hair: 'curls', hairCol: '#2a2230', shirt: P.mint, trousers: '#5b4f77', dwell: true, speed: 34,
    name: 'Wanderer', talk: '"Have you seen a small brass button? It was on my coat this morning."',
    route: [{ x: 300, y: 1140 }, { x: 640, y: 1420, wait: 2 }, { x: 1300, y: 1450 }, { x: 1560, y: 1320, wait: 3 }, { x: 700, y: 1180 }] });
  s.actor('pip', 1720, 1120, { name: 'Pip', dwell: true, speed: 28,
    talk: 'Pip: "Ten things on the list. Auntie Sol says the cats know where all of them are."',
    route: [{ x: 1720, y: 1120 }, { x: 2020, y: 1060, wait: 2.6 }, { x: 1820, y: 980 }, { x: 1560, y: 1080, wait: 2 }] });

  /* --------------------------------------------------------------- finds */
  s.find('pocket_watch', 842, SQUARE(856) + 10, { sort: 857, where: 'Someone left it beside a laptop.' });
  s.find('spectacles', 1802, SEAT(700) + 8, { sort: 701, where: 'Slipped down the window bench, of course.' });
  s.find('mitten', 2074, 1104, { where: 'Down by the cat tower.' });
  s.find('keyring', 856, COUNTER(650) + 6, { sort: 651, where: 'On the counter, next to the till.' });
  s.find('teddy', 1240, 1264, { where: 'Sat on the rug, waiting to be collected.' });
  s.find('bell', 2266, 668, { sort: 621, where: 'By the door mat.' });
  s.find('odd_sock', 862, 1288, { where: 'Under the far table. Naturally.' });
  s.find('ticket', 948, 754, { sort: 743, where: 'Tucked against the pastry case.' });
  s.find('button_brass', 700, ROUND(1190) + 10, { sort: 1191, where: 'On the flower table.' });
  s.find('spinning_top', 1336, 1282, { where: 'It rolled out from under the big table.' });

  return s;
}
