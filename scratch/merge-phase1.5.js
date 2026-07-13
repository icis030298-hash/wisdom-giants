const fs = require('fs');

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (let i = 1; i <= 4; i++) {
  const file = `scratch/t1.5-out-${i}.json`;
  if (!fs.existsSync(file)) continue;
  
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [slug, fields] of Object.entries(data)) {
    if (!finalNarratives[slug]) finalNarratives[slug] = {};
    for (const [key, val] of Object.entries(fields)) {
      finalNarratives[slug][key] = val;
    }
  }
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2));
console.log('Merge Phase 1.5 complete!');
