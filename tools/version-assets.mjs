// Tag CSS and JS links with a short hash of each file, so browsers fetch a fresh
// copy only when the file changes. Run before every push:  node tools/version-assets.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'photography.html', '404.html'];
// href="css/style.css", src="/js/main.js?v=abc123", ...
const ref = /((?:href|src)=")(\/?)((?:css|js)\/[\w.-]+\.(?:css|js))(?:\?v=[\w]+)?(")/g;
const hashes = new Map();

const hashOf = (file) => {
  if (!hashes.has(file)) {
    hashes.set(file, createHash('sha1').update(readFileSync(join(root, file))).digest('hex').slice(0, 8));
  }
  return hashes.get(file);
};

for (const page of pages) {
  const path = join(root, page);
  const before = readFileSync(path, 'utf8');
  const after = before.replace(ref, (_, attr, slash, file, quote) => `${attr}${slash}${file}?v=${hashOf(file)}${quote}`);
  if (after !== before) writeFileSync(path, after);
  console.log(`${page}: ${after === before ? 'unchanged' : 'updated'}`);
}
for (const [file, hash] of hashes) console.log(`  ${file} -> ${hash}`);
