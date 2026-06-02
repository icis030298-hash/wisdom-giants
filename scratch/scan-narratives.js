const fs = require('fs');
const path = require('path');

const NARRATIVES_PATH = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');

if (!fs.existsSync(NARRATIVES_PATH)) {
  console.log(`File not found: ${NARRATIVES_PATH}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(NARRATIVES_PATH, 'utf8'));
const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

console.log('==========================================');
console.log('Auditing final-narratives.json for Korean Pollution...');
console.log('==========================================');

let totalPolluted = 0;

Object.keys(data).forEach((slug) => {
  const giant = data[slug];
  const name = giant.name || slug;
  
  for (const key in giant) {
    // Audit fields that represent translations in other languages, e.g. suffix _en, _ja, _es, _fr, _it, _pt, _de
    const isTranslation = /_(en|ja|es|fr|it|pt|de)$/.test(key);
    if (isTranslation) {
      const val = giant[key];
      if (typeof val === 'string' && koreanRegex.test(val)) {
        console.log(`  [POLLUTED] Giant: "${name}" | Key: "${key}"`);
        console.log(`             Val snippet: "${val.substring(0, 100)}..."`);
        totalPolluted++;
      }
    } else if (key === 'wisdom' && Array.isArray(giant.wisdom)) {
      // Audit nested wisdom arrays
      giant.wisdom.forEach((w, wIndex) => {
        for (const wKey in w) {
          const isWTranslation = /_(en|ja|es|fr|it|pt|de)$/.test(wKey);
          if (isWTranslation) {
            const wVal = w[wKey];
            if (typeof wVal === 'string' && koreanRegex.test(wVal)) {
              console.log(`  [POLLUTED] Giant: "${name}" | Key: "wisdom[${wIndex}].${wKey}"`);
              console.log(`             Val snippet: "${wVal.substring(0, 100)}..."`);
              totalPolluted++;
            }
          }
        }
      });
    }
  }
});

console.log('==========================================');
console.log(`Audit Complete. Found ${totalPolluted} polluted entries.`);
console.log('==========================================');
