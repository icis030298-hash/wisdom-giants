const fs = require('fs');
const inFile = './scratch/t2-p2-chunk-6.json';
const outFile = './scratch/t2-p2-chunk-6-small.json';

const data = JSON.parse(fs.readFileSync(inFile, 'utf8'));

for (let t of data) {
  if (t.type === 'narrative' && Array.isArray(t.originalEn)) {
    // It's a wisdom array
    t.originalEn = t.originalEn.map(item => ({
      quote_en: item.quote_en,
      meaning_en: item.meaning_en
    }));
  }
}

fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
console.log('Stripped JSON created');
