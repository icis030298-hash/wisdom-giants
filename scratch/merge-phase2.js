const fs = require('fs');

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

for (let i = 1; i <= 10; i++) {
  const file = `scratch/t2-p2-out-${i}.json`;
  if (!fs.existsSync(file)) continue;

  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const item of data) {
    if (item.type === 'narrative') {
      if (!finalNarratives[item.slug]) finalNarratives[item.slug] = {};
      finalNarratives[item.slug][item.key] = item.translated;
    } else if (item.type === 'fact-layer') {
      const flPath = `src/data/fact-layers/fact-layer-${item.loc}.json`;
      let flData = {};
      if (fs.existsSync(flPath)) {
        flData = JSON.parse(fs.readFileSync(flPath, 'utf8'));
      }
      if (!flData[item.slug]) flData[item.slug] = { slug: item.slug };
      flData[item.slug].timeline = item.translated;
      fs.writeFileSync(flPath, JSON.stringify(flData, null, 2));
      
      const flAllPath = `src/data/fact-layer-all.json`;
      const flAllData = JSON.parse(fs.readFileSync(flAllPath, 'utf8'));
      if (!flAllData[item.slug]) flAllData[item.slug] = { slug: item.slug };
      flAllData[item.slug][item.loc] = item.translated;
      fs.writeFileSync(flAllPath, JSON.stringify(flAllData, null, 2));
    }
  }
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2));
console.log('Phase 2 merge complete!');
