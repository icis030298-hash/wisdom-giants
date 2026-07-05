const fs = require('fs');
const fn = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf-8'));

// 1-B: theodora와 tamar-of-georgia raw 텍스트 첫 500자 확인
console.log('=== THEODORA epic_ko (첫 500자) ===');
const thText = fn['theodora'].epic_ko;
console.log(thText.substring(0, 500));
console.log('\n--- 중복 체크 (첫 100자가 두 번 나오는지) ---');
const thFirst100 = thText.substring(0, 100);
const thSecondOccur = thText.indexOf(thFirst100, 10);
console.log('중복 위치:', thSecondOccur, '(없으면 -1)');

console.log('\n=== TAMAR epic_ko (첫 500자) ===');
const tmText = fn['tamar-of-georgia'].epic_ko;
console.log(tmText.substring(0, 500));
console.log('\n--- 중복 체크 ---');
const tmFirst100 = tmText.substring(0, 100);
const tmSecondOccur = tmText.indexOf(tmFirst100, 10);
console.log('중복 위치:', tmSecondOccur, '(없으면 -1)');

// 1-C: epic_ko 1000자 미만 위인 목록
console.log('\n\n=== STEP 1-C: epic_ko 1000자 미만 위인 목록 ===');
const shortOnes = Object.entries(fn)
  .filter(([k, v]) => v.epic_ko && v.epic_ko.length < 1000)
  .map(([k, v]) => ({ slug: k, len: v.epic_ko.length }))
  .sort((a, b) => a.len - b.len);

console.log(`총 ${shortOnes.length}명`);
shortOnes.forEach(({ slug, len }) => {
  console.log(`  ${len}자\t${slug}`);
});
