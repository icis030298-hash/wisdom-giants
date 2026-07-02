const fs = require('fs');
const fn = JSON.parse(fs.readFileSync('src/data/final-narratives.json'));
const giants = fs.readFileSync('src/data/giants.ts', 'utf-8');
const slugsInGiants = [...giants.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const fnKeys = Object.keys(fn);
const missing = fnKeys.filter(k => !slugsInGiants.includes(k));
console.log('Missing in giants.ts:', missing);
