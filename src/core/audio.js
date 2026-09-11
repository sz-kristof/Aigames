/* Tiny WebAudio synth. No asset files: every sound is a shaped oscillator,
 * tuned to a pentatonic scale so overlapping cues never clash. */

const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
const BASE = 523.25; // C5

let ctxA = null;
let master = null;
let enabled = true;
let ambientTimer = 0;

function ensure() {
  if (ctxA) return ctxA;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctxA = new AC();
  master = ctxA.createGain();
  master.gain.value = 0.5;
  master.connect(ctxA.destination);
  return ctxA;
}

export function unlock() {
  const a = ensure();
  if (a && a.state === 'suspended') a.resume();
}

export function setEnabled(on) {
  enabled = on;
  if (master) master.gain.setTargetAtTime(on ? 0.5 : 0, ctxA.currentTime, 0.05);
  return enabled;
}

export function isEnabled() { return enabled; }

function tone({ freq, dur = 0.4, type = 'sine', gain = 0.18, attack = 0.01, detune = 0, delay = 0, slide = 0 }) {
  const a = ensure();
  if (!a || !enabled) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), t0 + dur);
  osc.detune.value = detune;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noteOf(step) {
  const semis = SCALE[Math.min(step, SCALE.length - 1)];
  return BASE * Math.pow(2, semis / 12);
}

/** Rising chime — pitch climbs with the find streak. */
export function found(step = 0) {
  const f = noteOf(step);
  tone({ freq: f, dur: 0.55, type: 'triangle', gain: 0.2, attack: 0.005 });
  tone({ freq: f * 2, dur: 0.42, type: 'sine', gain: 0.09, delay: 0.04 });
  tone({ freq: f * 3, dur: 0.3, type: 'sine', gain: 0.035, delay: 0.08 });
}

export function miss() {
  tone({ freq: 190, dur: 0.14, type: 'sine', gain: 0.08, slide: 0.82 });
}

export function tap() {
  tone({ freq: 660, dur: 0.1, type: 'sine', gain: 0.06 });
}

export function hint() {
  [0, 0.07, 0.14].forEach((d, i) => tone({ freq: noteOf(4 + i), dur: 0.5, type: 'sine', gain: 0.09, delay: d }));
}

export function fanfare() {
  [0, 2, 4, 7].forEach((s, i) => {
    tone({ freq: noteOf(s), dur: 0.9, type: 'triangle', gain: 0.16, delay: i * 0.11 });
    tone({ freq: noteOf(s) * 2, dur: 0.7, type: 'sine', gain: 0.06, delay: i * 0.11 + 0.02 });
  });
}

export function meow() {
  const f = 520 + Math.random() * 140;
  tone({ freq: f, dur: 0.34, type: 'sawtooth', gain: 0.055, slide: 1.35 });
  tone({ freq: f * 0.5, dur: 0.36, type: 'sine', gain: 0.05, slide: 1.3 });
}

export function chirp() {
  tone({ freq: 900, dur: 0.1, type: 'sine', gain: 0.05, slide: 1.6 });
  tone({ freq: 1200, dur: 0.09, type: 'sine', gain: 0.04, delay: 0.09, slide: 0.8 });
}

export function page() {
  tone({ freq: 320, dur: 0.18, type: 'sine', gain: 0.07, slide: 1.25 });
}

/** Occasional distant wind-chime note, so quiet scenes still breathe. */
export function ambient(dt) {
  if (!enabled || !ctxA) return;
  ambientTimer -= dt;
  if (ambientTimer > 0) return;
  ambientTimer = 4 + Math.random() * 7;
  const step = Math.floor(Math.random() * 6);
  tone({ freq: noteOf(step) * 0.5, dur: 2.6, type: 'sine', gain: 0.028, attack: 0.35 });
}
