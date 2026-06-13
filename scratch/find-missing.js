const fs = require('fs');

// 1. Get GIANTS_TO_ADD from scripts/add-59-giants.ts
const add59Content = fs.readFileSync('scripts/add-59-giants.ts', 'utf8');
const candidateSlugs = [...add59Content.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);

// 2. Get current slugs in giants.ts
const giantsTsContent = fs.readFileSync('src/data/giants.ts', 'utf8');
const currentSlugs = [...giantsTsContent.matchAll(/slug:\s*['"]([^'"]+)['']/g)].map(m => m[1]);

// 3. Get narratives keys
let narrativesKeys = [];
try {
  const narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
  narrativesKeys = Object.keys(narratives);
} catch (e) {
  console.log('Error final-narratives:', e.message);
}

console.log('Total candidate slugs:', candidateSlugs.length);
console.log('Total current slugs in giants.ts:', currentSlugs.length);
console.log('Total keys in final-narratives.json:', narrativesKeys.length);

const inCandidatesNotTs = candidateSlugs.filter(s => !currentSlugs.includes(s));
console.log(`\nCandidates not in giants.ts (${inCandidatesNotTs.length}):`, inCandidatesNotTs);

const inCandidatesInTs = candidateSlugs.filter(s => currentSlugs.includes(s));
console.log(`\nCandidates ALREADY in giants.ts (${inCandidatesInTs.length}):`, inCandidatesInTs);

const inCandidatesNotNarratives = candidateSlugs.filter(s => !narrativesKeys.includes(s));
console.log(`\nCandidates not in final-narratives.json (${inCandidatesNotNarratives.length}):`, inCandidatesNotNarratives);

const inTsNotNarratives = currentSlugs.filter(s => !narrativesKeys.includes(s));
console.log(`\nSlugs in giants.ts but not in final-narratives.json (${inTsNotNarratives.length}):`, inTsNotNarratives);

const inNarrativesNotTs = narrativesKeys.filter(s => !currentSlugs.includes(s));
console.log(`\nSlugs in final-narratives.json but not in giants.ts (${inNarrativesNotTs.length}):`, inNarrativesNotTs);
