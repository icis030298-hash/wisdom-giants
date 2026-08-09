#!/usr/bin/env node
/**
 * Sitemap integrity check (run in CI, see .github/workflows/typecheck.yml).
 *
 * Guards three invariants that have broken in production before:
 *   1. Every duplicate slug excluded from the sitemap has a 301 redirect in next.config.mjs.
 *   2. No excluded slug (incomplete or duplicate) can leak into a sitemap chunk.
 *   3. sitemap.xml declares enough giants-N chunks to cover every valid giant.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

let failed = 0;
const fail = (msg) => { console.error(`  FAIL  ${msg}`); failed++; };
const pass = (msg) => console.log(`  ok    ${msg}`);

// --- inputs -----------------------------------------------------------------
const giantsSrc = read('src/data/giants.ts');
const slugs = [...giantsSrc.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]);

const routeSrc = read('src/app/sitemap/[id]/route.ts');
const indexSrc = read('src/app/sitemap.xml/route.ts');
const configSrc = read('next.config.mjs');

const perChunk = Number((routeSrc.match(/GIANTS_PER_CHUNK\s*=\s*(\d+)/) || [])[1]);
const incomplete = JSON.parse(read('src/config/incomplete-giants.json'));

const dupBlock = (routeSrc.match(/duplicateGiantsSet\s*=\s*new Set\(\[([\s\S]*?)\]\)/) || [])[1] || '';
const duplicates = [...dupBlock.matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);

const declaredChunks = [...indexSrc.matchAll(/["']giants-(\d+)["']/g)].map((m) => Number(m[1]));

// --- 0. sanity --------------------------------------------------------------
if (!slugs.length) fail('could not parse any slugs out of src/data/giants.ts');
if (!perChunk) fail('could not parse GIANTS_PER_CHUNK');
if (!duplicates.length) fail('duplicateGiantsSet is empty or unparseable in sitemap/[id]/route.ts');

const dupeSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupeSlugs.length) fail(`duplicate slugs inside giants.ts: ${dupeSlugs.join(', ')}`);
else pass(`${slugs.length} unique giant slugs`);

// --- 1. every excluded duplicate must have a 301 redirect -------------------
for (const slug of duplicates) {
  const pair = new RegExp(`from:\\s*['"]${slug}['"]\\s*,\\s*to:\\s*['"]([^'"]+)['"]`).exec(configSrc);
  if (!pair) {
    fail(`"${slug}" is excluded from the sitemap but has no redirect in next.config.mjs`);
    continue;
  }
  if (!slugs.includes(pair[1])) {
    fail(`"${slug}" redirects to "${pair[1]}", which does not exist in giants.ts`);
  }
}
if (!failed) pass(`${duplicates.length} duplicate slugs all redirect to a live canonical slug`);

if (!/permanent:\s*true/.test(configSrc)) {
  fail('no `permanent: true` found in next.config.mjs — duplicate redirects must be 301');
} else {
  pass('duplicate redirects are permanent (301)');
}

// --- 2 & 3. chunk coverage --------------------------------------------------
const excluded = new Set([...incomplete, ...duplicates]);
const valid = slugs.filter((s) => !excluded.has(s));

const emitted = new Set();
for (const i of declaredChunks) {
  for (const g of valid.slice(i * perChunk, i * perChunk + perChunk)) emitted.add(g);
}

const leaked = [...emitted].filter((s) => excluded.has(s));
if (leaked.length) fail(`excluded slugs present in sitemap output: ${leaked.join(', ')}`);
else pass(`no excluded slug leaks into the sitemap (${excluded.size} excluded)`);

const missing = valid.filter((s) => !emitted.has(s));
if (missing.length) {
  const needed = Math.ceil(valid.length / perChunk);
  fail(
    `${missing.length} valid giants are in no chunk — sitemap.xml declares ` +
      `${declaredChunks.length} chunks, needs ${needed} (first missing: ${missing[0]})`
  );
} else {
  pass(`all ${valid.length} valid giants covered by ${declaredChunks.length} chunks`);
}

// --- result -----------------------------------------------------------------
if (failed) {
  console.error(`\nSitemap integrity check FAILED (${failed} problem${failed > 1 ? 's' : ''}).`);
  process.exit(1);
}
console.log(`\nSitemap integrity check passed. ${valid.length} indexable giants.`);
