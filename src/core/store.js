/* localStorage wrapper that never throws — private windows, blocked storage,
 * and screenshot runs all just fall back to an in-memory copy. */

const KEY = 'odds-and-endings.save.v1';
let memory = null;

export function load() {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? JSON.parse(raw) : {};
  } catch { memory = {}; }
  return memory;
}

export function save(patch) {
  const data = Object.assign(load(), patch);
  memory = data;
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* ignore */ }
  return data;
}

export function reset() {
  memory = {};
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
