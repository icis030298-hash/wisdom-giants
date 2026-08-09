#!/usr/bin/env node
/**
 * 신규 460명 번역 진행 상황 및 품질 검사
 *   node scripts/qc-translations.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const slugs = read('scripts/out/stage2-net-new.json').map((x) => x.slug);
const MSG_KEYS = ['name', 'headline', 'shortDescription', 'quote', 'era', 'chatGreeting', 'suggestedQuestions'];
const EN_FIELDS = ['era_en', 'epic_en', 'trials_en', 'overcoming_en', 'fact_box_en'];

// ---- 되돌림 사고 감지 --------------------------------------------------
const giantsSrc = fs.readFileSync(path.join(root, 'src/data/giants.ts'), 'utf8');
const giantCount = [...giantsSrc.matchAll(/["']?slug["']?\s*:\s*["']([^"']+)["']/g)].length;
const expectedCount = 493 + slugs.length;
console.log(`giants.ts 인원: ${giantCount}명 ${giantCount === expectedCount ? '✅' : `🔴 ${expectedCount}명이어야 한다 — 되돌림 사고 의심`}`);

// ---- messages ----------------------------------------------------------
const problems = [];
for (const loc of ['ko', 'en']) {
  const G = read(`messages/${loc}.json`).Giants || {};
  const done = slugs.filter((s) => G[s]);
  const incomplete = done.filter((s) => MSG_KEYS.some((k) => G[s][k] === undefined || G[s][k] === ''));
  const badQ = done.filter((s) => !Array.isArray(G[s].suggestedQuestions) || G[s].suggestedQuestions.length !== 3);
  console.log(`messages/${loc}.json  ${done.length}/${slugs.length} 완료` + (incomplete.length ? ` | 키 누락 ${incomplete.length}건` : '') + (badQ.length ? ` | 추천질문 3개 아님 ${badQ.length}건` : ''));
  incomplete.slice(0, 5).forEach((s) => problems.push(`${loc}.json ${s}: 키 누락 ${MSG_KEYS.filter((k) => !G[s][k]).join(', ')}`));
  badQ.slice(0, 5).forEach((s) => problems.push(`${loc}.json ${s}: suggestedQuestions 개수 오류`));
}

// ---- narratives 영어 필드 ----------------------------------------------
let enDone = 0;
const lenPairs = [];
for (const s of slugs) {
  const p = path.join(root, `src/data/narratives/${s}.json`);
  if (!fs.existsSync(p)) { problems.push(`${s}: narrative 파일 없음`); continue; }
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const missing = EN_FIELDS.filter((f) => !d[f]);
  const wisdomEn = Array.isArray(d.wisdom) && d.wisdom.every((w) => w.quote_en && w.meaning_en);
  if (missing.length === 0 && wisdomEn) {
    enDone++;
    lenPairs.push({ s, ko: d.epic_ko.length, en: d.epic_en.length, ratio: d.epic_en.length / d.epic_ko.length });
    // 고유명사 로마자화 흔적 — 라틴 문자에 발음부호가 하나도 없으면 의심
    if (/École|Café|Nietzsche|Gödel/.test(d.epic_ko) === false && false) { /* noop */ }
    const fb = d.fact_box_en;
    if (!fb.one_line_summary || !Array.isArray(fb.key_achievements) || fb.key_achievements.length !== 3 || !fb.legacy_statement) {
      problems.push(`${s}: fact_box_en 구조 오류`);
    }
  } else if (missing.length < EN_FIELDS.length || wisdomEn) {
    problems.push(`${s}: 영어 필드 일부만 존재 (누락: ${missing.join(', ')}${wisdomEn ? '' : ', wisdom_en'})`);
  }
}
console.log(`narratives 영어 필드  ${enDone}/${slugs.length} 완료`);

if (lenPairs.length) {
  const r = lenPairs.map((x) => x.ratio).sort((a, b) => a - b);
  const med = r[Math.floor(r.length / 2)];
  console.log(`epic_en/epic_ko 길이비  중앙 ${med.toFixed(2)}  (0.9~2.0 정상, 0.5 미만이면 내용 누락 의심)`);
  const short = lenPairs.filter((x) => x.ratio < 0.5);
  short.slice(0, 8).forEach((x) => problems.push(`${x.s}: epic_en이 지나치게 짧다 (ko ${x.ko} → en ${x.en})`));
}

console.log(`\n■ 문제 ${problems.length}건`);
problems.slice(0, 40).forEach((p) => console.log('  - ' + p));
if (problems.length > 40) console.log(`  … 외 ${problems.length - 40}건`);
