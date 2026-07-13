const fs = require('fs');
const missing = JSON.parse(fs.readFileSync('scratch/missing-blogs-4.json', 'utf8'));
let patch = {};
try {
  patch = JSON.parse(fs.readFileSync('scratch/patch-agent4.json', 'utf8'));
} catch(e) {}
const next2 = missing.filter(m => !(patch[m.slug] && patch[m.slug][m.loc])).slice(0, 2);
fs.writeFileSync('scratch/next2.json', JSON.stringify(next2, null, 2));
