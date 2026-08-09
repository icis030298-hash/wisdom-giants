const fs = require('fs');
const candidates = JSON.parse(fs.readFileSync('scratch/candidates_500_roster.json', 'utf8'));
const existingData = fs.readFileSync('./src/lib/giants-data.ts', 'utf8');
const slugs = [...existingData.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const existingSlugs = new Set(slugs);

let overlap = 0;
candidates.forEach(c => {
    if (existingSlugs.has(c.slug)) {
        overlap++;
    }
});

console.log('Candidates:', candidates.length);
console.log('Overlap:', overlap);
