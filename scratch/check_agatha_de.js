const fs = require('fs');

const file = 'src/data/narratives/agatha-christie.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

console.log('=== (a) agatha-christie.json german fields ===');
console.log('epic_de (first 100 chars):', (data.epic_de || '').substring(0, 100));
console.log('trials_de (first 100 chars):', (data.trials_de || '').substring(0, 100));
console.log('overcoming_de (first 100 chars):', (data.overcoming_de || '').substring(0, 100));
console.log('era_de:', data.era_de);
console.log('fact_box_de:', data.fact_box_de);
console.log('fact_box:', data.fact_box);
