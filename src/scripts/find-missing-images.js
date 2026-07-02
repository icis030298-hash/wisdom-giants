const fs = require('fs');
const txt = fs.readFileSync('src/data/giants.ts', 'utf-8');
const matches = [...txt.matchAll(/name:\s*['"]([^'"]+)['"].*?slug:\s*['"]([^'"]+)['"]/gs)];
const existing = fs.existsSync('public/images/giants') ? fs.readdirSync('public/images/giants') : [];
const missing = matches.filter(m => !existing.some(f => f.includes(m[2].replace(/-/g, '_'))));
console.log(missing.slice(0,10).map(m => m[1] + '|' + m[2]));
