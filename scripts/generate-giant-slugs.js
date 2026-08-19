// Regenerates src/config/giant-slugs.json from src/data/giants.ts.
//
// middleware.ts needs to know which giant slugs are real so it can answer 404
// for anything else, but importing giants.ts into the edge runtime would pull
// ~600KB into every request. This keeps a slugs-only list instead, and running
// it from `prebuild` means the list can never drift from the roster.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src/data/giants.ts');
const OUT = path.join(ROOT, 'src/config/giant-slugs.json');

const src = fs.readFileSync(SRC, 'utf8');
const slugs = [...src.matchAll(/(?:"slug"|slug)\s*:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
const unique = [...new Set(slugs)].sort();

if (unique.length !== slugs.length) {
  console.warn(`[giant-slugs] 중복 slug ${slugs.length - unique.length}건 발견`);
}
if (unique.length === 0) {
  console.error('[giant-slugs] slug를 하나도 찾지 못했습니다. giants.ts 구조를 확인하세요.');
  process.exit(1);
}

const removedPath = path.join(ROOT, 'src/config/removed-giants.json');
if (fs.existsSync(removedPath)) {
  const removed = new Set(JSON.parse(fs.readFileSync(removedPath, 'utf8')));
  const conflict = unique.filter((s) => removed.has(s));
  if (conflict.length) {
    console.error(
      `[giant-slugs] 로스터와 removed-giants.json에 동시에 존재하는 slug ${conflict.length}건: ${conflict.join(', ')}\n` +
        '  middleware가 410을 반환하므로 페이지가 열리지 않습니다. 한쪽에서 제거하세요.'
    );
    process.exit(1);
  }
}

fs.writeFileSync(OUT, JSON.stringify(unique, null, 2) + '\n', 'utf8');
console.log(`[giant-slugs] ${unique.length}건 → src/config/giant-slugs.json`);
