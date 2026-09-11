/* Builds the Artifact entry page: the same game, but as body-only HTML with
 * the stylesheet inlined, since the Artifact host supplies the document shell. */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.cwd();

async function walk(dir) {
  const out = [];
  for (const e of await readdir(join(root, dir), { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(p));
    else if (e.name.endsWith('.js')) out.push(p.split('\\').join('/'));
  }
  return out;
}

const html = await readFile('index.html', 'utf8');
const css = await readFile('src/style.css', 'utf8');

const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1].trim();
const title = html.match(/<title>([\s\S]*?)<\/title>/)[1];
const fonts = html.match(/<link href="https:\/\/fonts[^>]*>/)[0];

const page = `<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
${fonts}
<style>
${css}
/* The Artifact host owns the document shell, so the app pins itself to it. */
html, body { height: 100%; }
</style>
${body}
`;

await mkdir('build', { recursive: true });
await writeFile('build/artifact.html', page);

const files = await walk('src');
await writeFile('build/artifact-files.json', JSON.stringify(
  Object.fromEntries(files.map((f) => [f, f])), null, 2));

console.log(`build/artifact.html  (${(page.length / 1024).toFixed(1)} kB)`);
console.log(`${files.length} script files:`);
console.log(JSON.stringify(Object.fromEntries(files.map((f) => [f, f]))));
