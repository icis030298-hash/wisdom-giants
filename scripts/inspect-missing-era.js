const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const slugs = Object.keys(data);

for (const slug of slugs) {
  const g = data[slug];
  if (!g.era_ko) {
    console.log(`=== Giant missing era_ko: ${slug} ===`);
    console.log("Keys:", Object.keys(g));
    console.log("fact_box (ko):", JSON.stringify(g.fact_box, null, 2));
    console.log("fact_box_en:", JSON.stringify(g.fact_box_en, null, 2));
    break;
  }
}
