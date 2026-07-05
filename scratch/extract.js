const fs = require('fs');
const txt = fs.readFileSync('src/data/giants.ts', 'utf8');
const slugs = [...txt.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const lastIdx = slugs.indexOf('euclid');
console.log('lastIdx:', lastIdx);
console.log(slugs.slice(lastIdx + 1, lastIdx + 101));
