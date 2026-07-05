const fs = require('fs');

const txt1 = fs.readFileSync('src/data/giants.ts', 'utf-8');
const slugs1 = [...txt1.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

const txt2 = fs.readFileSync('src/lib/giants-data.ts', 'utf-8');
const slugs2 = [...txt2.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

console.log('src/data/giants.ts:', [...new Set(slugs1)].length);
console.log('src/lib/giants-data.ts:', [...new Set(slugs2)].length);
