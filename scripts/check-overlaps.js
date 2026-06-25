const fs = require('fs');

// Read existing giants from src/data/giants.ts
const giantsTs = fs.readFileSync('src/data/giants.ts', 'utf8');
const existingSlugs = [];
const slugRegex = /slug:\s*"([^"]+)"/g;
let match;
while ((match = slugRegex.exec(giantsTs)) !== null) {
  existingSlugs.push(match[1]);
}

// Read candidates
const candidates = JSON.parse(fs.readFileSync('scripts/candidates-approval.json', 'utf8'));

// Filter out duplicates
const uniqueCandidates = candidates.filter(c => !existingSlugs.includes(c.slug));

console.log('Total unique candidates:', uniqueCandidates.length);

const regionCounts = {};
uniqueCandidates.forEach(c => {
  regionCounts[c.region] = (regionCounts[c.region] || 0) + 1;
});
console.log('Region distribution of unique candidates:', regionCounts);

