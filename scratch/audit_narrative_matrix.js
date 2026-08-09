const fs = require('fs');
const path = require('path');

const dir = 'src/data/narratives';
const targetSlugs = [
  'agatha-christie', 'ataturk', 'averroes-ibn-rushd', 'avicenna-ibn-sina',
  'hannah-arendt', 'queen-elizabeth-i', 'rosa-parks', 'simone-de-beauvoir',
  'zarathushtra'
];

const allLocales = [
  'ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ru', 'zh',
  'ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'uk', 'id', 'he',
  'ha', 'sw', 'pl', 'el'
];

const fields = ['era', 'epic', 'trials', 'overcoming', 'fact_box'];

// (a) Matrix calculation
console.log('=== (a) 9명 × 24로케일 × 5필드 매트릭스 검사 ===');
let totalPossible = targetSlugs.length * allLocales.length * fields.length; // 9 * 24 * 5 = 1080
let totalPresent = 0;

targetSlugs.forEach(slug => {
  const file = path.join(dir, `${slug}.json`);
  if (!fs.existsSync(file)) return;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  let slugPresentCount = 0;
  allLocales.forEach(loc => {
    fields.forEach(field => {
      // Key can be field_loc or field (like fact_box if shared, or fact_box_loc)
      const key1 = `${field}_${loc}`;
      const key2 = field; // fallback if fact_box is non-locale or shared
      if ((data[key1] && String(data[key1]).trim()) || (loc === 'en' && data[key2] && typeof data[key2] === 'object')) {
        slugPresentCount++;
        totalPresent++;
      }
    });
  });
  console.log(`${slug}: 120개 중 ${slugPresentCount}개 필드 존재`);
});
console.log(`\n전체 1,080칸 중 채워진 칸: ${totalPresent} / ${totalPossible}`);

// (b) en 기준 era, fact_box 존재 여부
console.log('\n=== (b) en 기준 era, fact_box 존재 여부 ===');
targetSlugs.forEach(slug => {
  const file = path.join(dir, `${slug}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log(`${slug}: era_en = ${data.era_en || 'NO'}, fact_box_en = ${data.fact_box_en || 'NO'}, fact_box = ${data.fact_box ? 'YES (common)' : 'NO'}`);
});

// (c) 정상 위인의 fact_box 구조 원문 예시
console.log('\n=== (c) 정상 위인(john-d-rockefeller.json)의 fact_box 구조 ===');
const rockData = JSON.parse(fs.readFileSync(path.join(dir, 'john-d-rockefeller.json'), 'utf8'));
if (rockData.fact_box || rockData.fact_box_ko || rockData.fact_box_en) {
  console.log('rockefeller fact_box:', JSON.stringify(rockData.fact_box || rockData.fact_box_ko || rockData.fact_box_en, null, 2));
} else {
  // Find where fact_box is in rockefeller
  const fbKeys = Object.keys(rockData).filter(k => k.includes('fact_box'));
  console.log('rockefeller fact_box keys:', fbKeys);
  if (fbKeys.length > 0) {
    console.log('rockefeller ' + fbKeys[0] + ':', JSON.stringify(rockData[fbKeys[0]], null, 2));
  }
}

// (d) era 필드 형식과 예시
console.log('\n=== (d) era 필드의 형식과 예시 ===');
const eraKeys = Object.keys(rockData).filter(k => k.startsWith('era_'));
eraKeys.slice(0, 5).forEach(k => {
  console.log(`${k}: "${rockData[k]}"`);
});
