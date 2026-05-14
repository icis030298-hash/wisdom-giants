const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/narratives.json', 'utf8'));
const targets = ['조지 워싱턴', '이순신', '엘리자베스 1세', '광개토대왕'];
const result = targets.map(t => ({name: t, ...data[t]}));
fs.writeFileSync('scratch/batch9_source.json', JSON.stringify(result, null, 2));
console.log('Batch 9 source written to scratch/batch9_source.json');
