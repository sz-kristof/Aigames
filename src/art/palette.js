/* Flat, saturated colours with a single violet ink for every outline —
 * that shared outline is what makes the props read as one hand. */

export const INK = '#33263f';

export const P = {
  // woods & neutrals
  wood: '#c98b53', woodDark: '#9a6136', woodLight: '#e6b483',
  walnut: '#7a4a2c', oak: '#d9a76c',
  cream: '#fff2df', paper: '#fff8ee', bone: '#f0e2cc',
  stone: '#cfc6bd', stoneDark: '#a79d95',
  metal: '#b9c4cf', metalDark: '#7f8c9b', brass: '#e0a94e',

  // accents
  red: '#e8615a', rose: '#f4a2b4', coral: '#ff8a6b',
  amber: '#f2b23e', gold: '#ffd166', butter: '#ffe6a0',
  mint: '#7fc7a6', jade: '#4fa96a', pine: '#2f7d4e',
  teal: '#3ec5c0', sky: '#8ad7ff', blue: '#5a8fd6', indigo: '#4b4a8f',
  plum: '#8f5ba8', magenta: '#e35d9b', lilac: '#c9a6e8',
  charcoal: '#4a4258', ash: '#6f6880',

  // cats & critters
  ginger: '#f0a05a', tabby: '#b08a6a', sooty: '#5b5566', snow: '#fdf6ec',
  tuxedo: '#3b3446', siamese: '#e6d3bb',
};

/** Per-scene mood: ground tones, light wash, and ambience defaults. */
export const MOODS = {
  cafe: {
    floor: '#e8c79c', floorAlt: '#dcb488', wall: '#f7d9b5', wallTop: '#ffeccf',
    trim: '#b9754a', wash: null, vignette: 'rgba(80,40,20,0.20)',
  },
  market: {
    floor: '#2b2547', floorAlt: '#262042', wall: '#241a3a', wallTop: '#1a1330',
    trim: '#4a3f6b', wash: null, vignette: 'rgba(10,6,28,0.42)',
  },
  greenhouse: {
    floor: '#c7b7a2', floorAlt: '#b9a791', wall: '#dff0e6', wallTop: '#eef8f1',
    trim: '#8aa79a', wash: null, vignette: 'rgba(40,70,50,0.26)',
  },
};
