const fs = require('fs');

const txt = fs.readFileSync('src/data/giants.ts', 'utf-8');
const slugs = [...txt.matchAll(/slug:\s*['"]([^'"]+)['"]/gs)].map(m => m[1]);
const uniqueSlugs = [...new Set(slugs)];

// Previously converted (Phase 1)
const convertedPhase1 = uniqueSlugs.slice(0, 50);

// Phase 2 Batch 1
const convertedPhase2Batch1 = uniqueSlugs.slice(50, 100);

// I manually converted these two today:
const manualConverted = ['behanzin', 'menelik-ii'];

const alreadyConverted = new Set([...convertedPhase1, ...convertedPhase2Batch1, ...manualConverted]);

// The remaining targets are those NOT in alreadyConverted
const remaining = uniqueSlugs.filter(slug => !alreadyConverted.has(slug));

console.log('Total valid giants:', uniqueSlugs.length);
console.log('Already converted:', alreadyConverted.size);
console.log('Remaining to convert:', remaining.length);
console.log('Phase 2 Batch 2 (Next 50):');
console.log(JSON.stringify(remaining.slice(0, 50), null, 2));
