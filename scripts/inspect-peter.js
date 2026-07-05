const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const g = data['peter-the-great'];

console.log("=== Peter the Great Era Fields ===");
for (const key of Object.keys(g)) {
  if (key.startsWith('era_')) {
    console.log(`  ${key}: ${g[key]}`);
  }
}
