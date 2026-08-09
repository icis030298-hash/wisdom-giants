const fs = require('fs');

const src = fs.readFileSync('src/data/giants.ts', 'utf8');

// Regex match for slug: "...", name: "..."
const slugMatches = [...src.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);
const nameMatches = [...src.matchAll(/name:\s*["']([^"']+)["']/g)].map(m => m[1]);

console.log(`Extracted ${slugMatches.length} existing slugs.`);

const existingSet = new Set(slugMatches.map(s => s.toLowerCase()));

fs.writeFileSync('scratch/existing_slugs.json', JSON.stringify([...existingSet], null, 2));
