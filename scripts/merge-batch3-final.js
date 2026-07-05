/**
 * STEP 3-E: batch3-final.json → final-narratives.json 공식 반영
 * 이미 완료된 90명(Pilot+Batch1+Batch2) 서사는 유지하고,
 * 이번 batch3 326명의 새 서사를 덮어쓴다.
 */

const fs = require('fs');

const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const batch3 = JSON.parse(fs.readFileSync('scratch/batch3-final.json', 'utf8'));

let updated = 0;
let skipped = 0;
let notInMaster = 0;
const charLenCheck = [];

for (const item of batch3) {
  const { slug, new_text, fact_box } = item;

  if (!(slug in narratives)) {
    console.warn(`  [SKIP - 마스터에 없음] ${slug}`);
    notInMaster++;
    continue;
  }

  const newEpic = (new_text || '').trim();
  if (!newEpic || newEpic.length < 1000) {
    console.warn(`  [SKIP - 텍스트 불량] ${slug}: ${newEpic.length}자`);
    skipped++;
    continue;
  }

  // 서사 반영
  narratives[slug].epic_ko = newEpic;

  // fact_box 반영 (있는 경우)
  if (fact_box) {
    narratives[slug].fact_box = fact_box;
  }

  // 품질 플래그 기록
  if (item.fact_check_flags && item.fact_check_flags.length > 0) {
    narratives[slug].qa_flags = item.fact_check_flags;
  }

  charLenCheck.push({ slug, len: newEpic.length });
  updated++;
}

// 저장
fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(narratives, null, 2), 'utf8');

// 통계
const lens = charLenCheck.map(x => x.len);
const avg = Math.round(lens.reduce((a, b) => a + b, 0) / lens.length);
const min = Math.min(...lens);
const max = Math.max(...lens);
const under1800 = charLenCheck.filter(x => x.len < 1800);
const over2200 = charLenCheck.filter(x => x.len > 2200);

console.log('\n===== 병합 완료 =====');
console.log(`반영: ${updated}명`);
console.log(`스킵(텍스트 불량): ${skipped}명`);
console.log(`스킵(마스터 없음): ${notInMaster}명`);
console.log(`\n[서사 품질 통계]`);
console.log(`  평균: ${avg}자`);
console.log(`  최소: ${min}자`);
console.log(`  최대: ${max}자`);
console.log(`  1800자 미달: ${under1800.length}건`);
if (under1800.length > 0) under1800.forEach(x => console.log(`    - ${x.slug}: ${x.len}자`));
console.log(`  2200자 초과: ${over2200.length}건`);
if (over2200.length > 0) over2200.forEach(x => console.log(`    - ${x.slug}: ${x.len}자`));

// 전체 서사 완료율 확인
const total = Object.keys(narratives).length;
const done = Object.values(narratives).filter(v => (v.epic_ko || '').length >= 1800).length;
console.log(`\n[전체 완료율] ${done}/${total}명 서사 완성 (${Math.round(done/total*100)}%)`);
