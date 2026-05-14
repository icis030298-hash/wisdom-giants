const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/narratives.json', 'utf8'));
const targets = ['윈스턴 처칠', '진시황', '아우구스투스', '오토 폰 비스마르크', '표트르 대제'];
const result = targets.map(t => ({name: t, ...data[t]}));
fs.writeFileSync('scratch/batch10_source.json', JSON.stringify(result, null, 2));
console.log('Batch 10 source written to scratch/batch10_source.json');
