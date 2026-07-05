const fs = require('fs');
const txt = fs.readFileSync('src/data/giants.ts', 'utf8');
const slugs = [...txt.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const lastIdx = slugs.indexOf('alexander-pushkin');
console.log('lastIdx:', lastIdx);
console.log(slugs.slice(lastIdx + 1));
