const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));

const testSlugs = ['imhotep', 'amina-of-zazzau'];

console.log("=== Pilot Generated Wisdom Lessons (Stage 1) ===");
testSlugs.forEach(slug => {
  const g = data[slug];
  console.log(`\n[${slug}] wisdom:`);
  console.log(JSON.stringify(g.wisdom, null, 2));
});
