const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const slugs = Object.keys(data);
const g = data[slugs[0]]; // napoleon-bonaparte

console.log("=== NAPOLEON METADATA KEYS ===");
const filteredKeys = Object.keys(g).filter(k => {
  return !k.startsWith('epic_') && 
         !k.startsWith('fact_box_') && 
         !k.startsWith('trials_') && 
         !k.startsWith('overcoming_') && 
         !k.startsWith('era_');
});
console.log(filteredKeys);

for (const key of filteredKeys) {
  console.log(`  ${key}:`, JSON.stringify(g[key]).slice(0, 100));
}
