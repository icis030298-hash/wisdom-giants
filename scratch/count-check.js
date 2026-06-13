const fs = require('fs');

// 1. Read giants.ts
const content = fs.readFileSync('src/data/giants.ts', 'utf8');
const slugMatches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Number of slugs in giants.ts:', slugMatches.length);
console.log('Unique slugs in giants.ts:', new Set(slugMatches).size);

// 2. Read final-narratives.json
let narratives = {};
try {
  narratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
} catch (e) {
  console.log('Error reading final-narratives.json:', e.message);
}
console.log('Number of keys in final-narratives.json:', Object.keys(narratives).length);

// 3. Read messages/ko.json
let koMessages = {};
try {
  koMessages = JSON.parse(fs.readFileSync('messages/ko.json', 'utf8'));
} catch (e) {
  console.log('Error reading messages/ko.json:', e.message);
}
const koGiantsKeys = Object.keys(koMessages.giants || {});
console.log('Number of giants in messages/ko.json:', koGiantsKeys.length);
