/**
 * Spread the bulk-generated blog publish dates over their original windows.
 *
 * 175 of the 195 posts sit on five timestamps, which reads as "60 articles
 * published in one day". Each cluster is moved inside a window around its own
 * original date, so nothing drifts away from when it was actually written and
 * nothing lands in the future.
 *
 * The mapping is a pure function of the slug. Nothing here may call
 * Math.random() or read the clock: the file this rewrites is committed, so a
 * second run has to produce a byte-identical result. (The bug that prompted
 * this work was a compiled copy of the data carrying a live
 * `new Date().toISOString()`, which re-stamped 40 posts on every module load.)
 *
 *   node scripts/redistribute-blog-dates.js --dry-run
 *   node scripts/redistribute-blog-dates.js
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(process.cwd(), 'src', 'data', 'blog-posts.ts');
const TODAY = '2026-08-15'; // hard-coded on purpose: see the note above

// Each cluster keeps to its own window, and the windows do not overlap.
const GROUPS = [
  { match: (v) => v === '2026-06-09', start: '2026-06-05', end: '2026-06-13' },
  { match: (v) => v === '2026-06-15', start: '2026-06-14', end: '2026-06-24' },
  { match: (v) => v === '2026-07-30' || v === '2026-07-31', start: '2026-07-26', end: '2026-08-02' },
  { match: (v) => v.startsWith('2026-08-08'), start: '2026-08-04', end: '2026-08-14' },
];

const DAY = 86400000;

/** FNV-1a, 32-bit. Small, stable, and dependency-free. */
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function assign(slug, group) {
  const start = Date.parse(group.start + 'T00:00:00.000Z');
  const days = Math.round((Date.parse(group.end + 'T00:00:00.000Z') - start) / DAY) + 1;
  const h = hash(slug);

  // Separate byte ranges of the same hash drive the day and the time, so two
  // posts landing on the same day still get different hours.
  const dayOffset = h % days;
  const hour = 9 + ((h >>> 8) % 12);   // 09:00 - 20:00
  const minute = (h >>> 16) % 60;
  const second = (h >>> 24) % 60;

  return new Date(start + dayOffset * DAY + ((hour * 60 + minute) * 60 + second) * 1000).toISOString();
}

const dryRun = process.argv.includes('--dry-run');
const source = fs.readFileSync(FILE, 'utf8');

// Walk the posts in order. `"slug"` cannot collide with `"giantSlug"` or
// `"giantSlugs"` because the leading quote is part of the pattern.
const SLUG = /"slug":\s*"([^"]+)"/g;
const PUBLISHED = /"publishedAt":\s*"([^"]*)"/g;

const edits = [];
let seen = 0;
let untouched = 0;
let match;

while ((match = SLUG.exec(source)) !== null) {
  const slug = match[1];
  PUBLISHED.lastIndex = match.index;
  const pub = PUBLISHED.exec(source);
  if (!pub) break;
  seen++;

  const current = pub[1];
  const group = GROUPS.find((g) => g.match(current));
  if (!group) {
    untouched++;
    continue;
  }
  edits.push({ slug, from: current, to: assign(slug, group), start: pub.index, end: pub.index + pub[0].length });
}

console.log('글 수: ' + seen + ' · 재배정 ' + edits.length + '건 · 유지 ' + untouched + '건');

// --- checks that must hold before anything is written -----------------------
const problems = [];
if (seen !== 195) problems.push('글 수가 195가 아닙니다: ' + seen);
if (edits.length + untouched !== seen) problems.push('재배정 + 유지 합계가 글 수와 다릅니다');

const todayEnd = Date.parse(TODAY + 'T23:59:59.999Z');
for (const e of edits) {
  const t = Date.parse(e.to);
  if (t > todayEnd) problems.push(e.slug + ' 가 미래입니다: ' + e.to);
  const g = GROUPS.find((x) => x.match(e.from));
  const lo = Date.parse(g.start + 'T00:00:00.000Z');
  const hi = Date.parse(g.end + 'T23:59:59.999Z');
  if (t < lo || t > hi) problems.push(e.slug + ' 가 범위 밖입니다: ' + e.to);
}

if (problems.length) {
  console.error('\n검증 실패 — 파일을 쓰지 않았습니다:');
  problems.slice(0, 10).forEach((p) => console.error('  ' + p));
  process.exit(1);
}

const byDay = {};
edits.forEach((e) => { const d = e.to.slice(0, 10); byDay[d] = (byDay[d] || 0) + 1; });
console.log('배정된 날짜 ' + Object.keys(byDay).length + '종, 하루 최대 ' + Math.max(...Object.values(byDay)) + '건');

if (dryRun) {
  console.log('\n--dry-run · 앞 8건:');
  edits.slice(0, 8).forEach((e) => console.log('  ' + e.slug.padEnd(34) + e.from + '  ->  ' + e.to));
  process.exit(0);
}

// Splice from the end so earlier offsets stay valid.
let out = source;
for (let i = edits.length - 1; i >= 0; i--) {
  const e = edits[i];
  out = out.slice(0, e.start) + '"publishedAt": "' + e.to + '"' + out.slice(e.end);
}
fs.writeFileSync(FILE, out);
console.log('기록 완료: ' + FILE);
