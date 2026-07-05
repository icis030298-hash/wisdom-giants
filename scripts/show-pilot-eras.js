const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));

const testSlugs = [
  'timur-tamerlane',
  'pyotr-ilyich-tchaikovsky',
  'alexander-graham-bell',
  'andrew-carnegie',
  'johannes-gutenberg'
];

console.log("=== Pilot Generated Eras (Stage 1) ===");
testSlugs.forEach(slug => {
  const g = data[slug];
  console.log(`${slug}:`);
  console.log(`  era_ko: ${g.era_ko}`);
  console.log(`  era_en: ${g.era_en}`);
});
