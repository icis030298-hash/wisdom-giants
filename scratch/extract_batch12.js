const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/narratives.json', 'utf8'));
const targets = ['드와이트 D. 아이젠하워', '수잔 B. 앤서니', '빌리 그레이엄', '콘래드 아데나워', '앤드류 카네기'];
const result = targets.map(t => ({name: t, ...data[t]}));
fs.writeFileSync('scratch/batch12_source.json', JSON.stringify(result, null, 2));
console.log('Batch 12 source written to scratch/batch12_source.json');
