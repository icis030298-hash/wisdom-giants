#!/usr/bin/env node
/**
 * era_en 표기 정규화
 *
 * 서브 에이전트 10개 × 10배치가 각자 다른 형식으로 써서 64종으로 파편화되었다.
 *   "19th Century Giant (1859~1891)" / "19th-Century Giant (1859–1891)"
 *   "Giant of the 19th Century (1859–1891)" / "19th Century (1859–1891)" …
 *
 * 정본 형식(한국어 era_ko와 대응):
 *   "19th Century Giant (1859~1891)"
 *   "5th Century BC Giant (480 BC~406 BC)"
 *
 *   node scripts/normalize-era-en.js          검사만
 *   node scripts/normalize-era-en.js --write  실제 기록
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const WRITE = process.argv.includes('--write');
const slugs = JSON.parse(fs.readFileSync(path.join(root, 'scripts/out/stage2-net-new.json'), 'utf8')).map((x) => x.slug);

const ord = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

function normalize(era) {
  if (!era) return null;

  // 세기 추출
  const cm = era.match(/(\d+)\s*(?:st|nd|rd|th)?[-\s]*Century/i);
  if (!cm) return null;
  const century = Number(cm[1]);

  // 연도 구간 추출 (괄호 안)
  const pm = era.match(/\(([^)]+)\)/);
  if (!pm) return null;
  const inner = pm[1].trim();

  // 구분자를 물결표로 통일. 엔대시/엠대시/하이픈/to 모두 허용
  const parts = inner.split(/\s*(?:~|–|—|-|to)\s*/i).map((x) => x.trim()).filter(Boolean);
  if (parts.length !== 2) return null;

  const isBC = /\bBC\b|\bB\.C\./i.test(era);
  const label = isBC ? `${ord(century)} Century BC Giant` : `${ord(century)} Century Giant`;
  return `${label} (${parts[0]}~${parts[1]})`;
}

const changes = [];
const failed = [];

for (const slug of slugs) {
  const p = path.join(root, `src/data/narratives/${slug}.json`);
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const before = d.era_en;
  const after = normalize(before);

  if (!after) { failed.push(`${slug}: "${before}"`); continue; }
  if (after === before) continue;

  changes.push({ slug, before, after });
  if (WRITE) {
    d.era_en = after;
    fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n', 'utf8');
  }
}

// messages/en.json 의 era 도 같은 값으로 맞춘다
const msgPath = path.join(root, 'messages/en.json');
const msg = JSON.parse(fs.readFileSync(msgPath, 'utf8'));
let msgFixed = 0;
for (const slug of slugs) {
  const d = JSON.parse(fs.readFileSync(path.join(root, `src/data/narratives/${slug}.json`), 'utf8'));
  const entry = msg.Giants?.[slug];
  if (entry && d.era_en && entry.era !== d.era_en) {
    msgFixed++;
    if (WRITE) entry.era = d.era_en;
  }
}
if (WRITE && msgFixed) fs.writeFileSync(msgPath, JSON.stringify(msg, null, 2) + '\n', 'utf8');

console.log(`정규화 대상 ${changes.length}건 / 파싱 실패 ${failed.length}건 / messages.en era 불일치 ${msgFixed}건`);
changes.slice(0, 8).forEach((c) => console.log(`  ${c.slug}\n    - ${c.before}\n    + ${c.after}`));
if (failed.length) {
  console.log('\n수동 확인 필요:');
  failed.slice(0, 15).forEach((f) => console.log('  ' + f));
}
if (!WRITE) console.log('\n검사만 수행했다. 실제로 쓰려면 --write');
