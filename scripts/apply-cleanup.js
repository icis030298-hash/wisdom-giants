/**
 * STEP 3-D: 실제 마스터 데이터 정리 실행
 * - 정책 위반 12명 제거
 * - 중복 5개 slug 제거 (REMOVE 대상)
 */

const fs = require('fs');

const TO_REMOVE = [
  // 정책 위반 12명
  'jk-rowling', 'malala-yousafzai', 'rigoberta-menchu', 'margaret-thatcher',
  'steve-jobs', 'rosa-parks', 'mother-teresa', 'salvador-dali',
  'simone-de-beauvoir', 'agatha-christie', 'hannah-arendt', 'pablo-picasso',
  // 중복 5개 (REMOVE 대상)
  'avicenna-ibn-sina',   // ibn-sina 보존
  'averroes-ibn-rushd',  // ibn-rushd 보존
  'queen-elizabeth-i',   // elizabeth-i 보존
  'zarathushtra',        // zoroaster 보존
  'ataturk',             // mustafa-kemal-ataturk 보존
];

// ========== final-narratives.json 정리 ==========
const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const beforeCount = Object.keys(narratives).length;
const removedFromNarratives = [];

TO_REMOVE.forEach(slug => {
  if (slug in narratives) {
    delete narratives[slug];
    removedFromNarratives.push(slug);
  } else {
    console.log(`  [SKIP - 없음] ${slug} (final-narratives.json)`);
  }
});

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(narratives, null, 2), 'utf8');
const afterCount = Object.keys(narratives).length;
console.log(`final-narratives.json: ${beforeCount}명 → ${afterCount}명 (${beforeCount - afterCount}명 제거)`);

// ========== wikipedia-links.json 정리 ==========
const wikiLinks = JSON.parse(fs.readFileSync('src/data/wikipedia-links.json', 'utf8'));
const wikiBeforeCount = Object.keys(wikiLinks).length;
const removedFromWiki = [];

TO_REMOVE.forEach(slug => {
  if (slug in wikiLinks) {
    delete wikiLinks[slug];
    removedFromWiki.push(slug);
  }
});

fs.writeFileSync('src/data/wikipedia-links.json', JSON.stringify(wikiLinks, null, 2), 'utf8');
const wikiAfterCount = Object.keys(wikiLinks).length;
console.log(`wikipedia-links.json: ${wikiBeforeCount}개 → ${wikiAfterCount}개 (${wikiBeforeCount - wikiAfterCount}개 제거)`);

// ========== batch3-cleaned.json에서도 중복 제거 ==========
const batch3 = JSON.parse(fs.readFileSync('scratch/batch3-cleaned.json', 'utf8'));
const b3Before = batch3.length;
const batch3Final = batch3.filter(item => !TO_REMOVE.includes(item.slug));
fs.writeFileSync('scratch/batch3-final.json', JSON.stringify(batch3Final, null, 2), 'utf8');
console.log(`batch3: ${b3Before}명 → ${batch3Final.length}명`);

// ========== 최종 요약 ==========
console.log('\n===== 정리 완료 =====');
console.log('제거된 slug 목록:');
removedFromNarratives.forEach(s => console.log('  -', s));
console.log(`\n마스터 리스트 최종 인원: ${afterCount}명`);
console.log(`batch3 최종 확장 대상: ${batch3Final.length}명`);
