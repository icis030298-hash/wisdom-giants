const fs = require('fs');
const txt = fs.readFileSync('src/data/giants.ts', 'utf-8');
const slugs = [...txt.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log(slugs.filter(s => s.includes('hurrem')));
console.log(slugs.filter(s => s === 'hurrem-sultan'));
