const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const needsRewrite = [];
for (const [k, v] of Object.entries(data)) {
  if (k === 'murasaki-shikibu') continue;
  if (!v.wisdom || v.wisdom.length === 0) continue;
  const meaning = v.wisdom[0].meaning_ko || '';
  if (meaning.endsWith('다.') || meaning.endsWith('니다.') || (v.epic_ko && v.epic_ko.includes('###'))) {
    needsRewrite.push(k);
  }
}
console.log(JSON.stringify(needsRewrite));
