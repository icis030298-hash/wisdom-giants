const fs = require('fs');

// 1. Get slugs from new-giants-50.json
const g50 = JSON.parse(fs.readFileSync('scripts/new-giants-50.json', 'utf8'));
const slugs50 = Object.keys(g50);

// 2. Get current slugs in giants.ts
const giantsTsContent = fs.readFileSync('src/data/giants.ts', 'utf8');
const currentSlugs = [...giantsTsContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

// 3. Get narratives keys
let narrativesKeys = [];
try {
  const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
  narrativesKeys = Object.keys(narratives);
} catch (e) {
  console.log('Error final-narratives:', e.message);
}

console.log('Total new-giants-50.json slugs:', slugs50.length);
console.log('Total current slugs in giants.ts:', currentSlugs.length);

const missingInTs = slugs50.filter(s => !currentSlugs.includes(s));
console.log(`\nNew 50 slugs missing in giants.ts (${missingInTs.length}):`, missingInTs);

const missingInNarratives = slugs50.filter(s => !narrativesKeys.includes(s));
console.log(`\nNew 50 slugs missing in final-narratives.json (${missingInNarratives.length}):`, missingInNarratives);
