const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const slugs = Object.keys(data);

console.log(`Total Giants: ${slugs.length}`);

// 1. Missing Era / Wisdom in ko/en
let missingEraKo = 0;
let missingEraEn = 0;
let missingWisdom = 0;

slugs.forEach(slug => {
  const g = data[slug];
  if (!g.era_ko) missingEraKo++;
  if (!g.era_en) missingEraEn++;
  
  const wisdom = g.wisdom || [];
  const hasWisdomKo = wisdom.length > 0 && wisdom.some(w => w.quote_ko && w.quote_ko.trim() !== '');
  if (!hasWisdomKo) missingWisdom++;
});

console.log(`Missing era_ko: ${missingEraKo}`);
console.log(`Missing era_en: ${missingEraEn}`);
console.log(`Missing wisdom (ko/en): ${missingWisdom}`);

// 2. Scan Hebrew for reversals
let reversedHebrewCount = 0;
slugs.forEach(slug => {
  const g = data[slug];
  const t = g.trials_he || '';
  const o = g.overcoming_he || '';
  const e = g.era_he || '';
  
  const hasRtlTag = t.includes('[RTL') || o.includes('[RTL') || e.includes('[RTL');
  const isReversed = t.includes('.aneleH') || o.includes('.aneleH') || t.includes(' eht ') || o.includes(' eht ');
  
  if (hasRtlTag || isReversed) {
    reversedHebrewCount++;
  }
});
console.log(`Total Giants with Reversed Hebrew: ${reversedHebrewCount}`);

// 3. Scan 9 contaminated languages for [xx] tags
const contaminatedLangs = ['ha', 'id', 'nl', 'pl', 'sw', 'th', 'tr', 'uk', 'vi'];
contaminatedLangs.forEach(lang => {
  let count = 0;
  slugs.forEach(slug => {
    const g = data[slug];
    const t = g[`trials_${lang}`] || '';
    const o = g[`overcoming_${lang}`] || '';
    if (t.includes(`[${lang}]`) || o.includes(`[${lang}]`)) {
      count++;
    }
  });
  console.log(`Contaminated entries in ${lang}: ${count}`);
});
