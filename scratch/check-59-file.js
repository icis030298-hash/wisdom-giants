const fs = require('fs');
const content = fs.readFileSync('scripts/add-59-giants.ts', 'utf8');

// parse the GIANTS_TO_ADD array using a simple regex or parser
const matches = [...content.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log('Total slugs in add-59-giants.ts list:', matches.length);
console.log('Unique slugs in add-59-giants.ts list:', new Set(matches).size);
console.log('Slugs:', matches);
