const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/narratives.json', 'utf8'));
const targets = ['시몬 볼리바르', '마가렛 대처', '존 D. 록펠러', '무스타파 케말 아타튀르크', '테오도르 루스벨트'];
const result = targets.map(t => ({name: t, ...data[t]}));
fs.writeFileSync('scratch/batch11_source.json', JSON.stringify(result, null, 2));
console.log('Batch 11 source written to scratch/batch11_source.json');
