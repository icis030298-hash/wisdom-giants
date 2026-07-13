const fs = require('fs');

const finalNarratives = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
const factLayerEn = JSON.parse(fs.readFileSync('src/data/fact-layers/fact-layer-en.json', 'utf8'));
const factLayerKo = JSON.parse(fs.readFileSync('src/data/fact-layers/fact-layer-ko.json', 'utf8'));
const factLayerAll = JSON.parse(fs.readFileSync('src/data/fact-layer-all.json', 'utf8'));
const koMessages = JSON.parse(fs.readFileSync('messages/ko.json', 'utf8'));

// 1. Merge Task 1
for (let i = 1; i <= 3; i++) {
  const file = `scratch/t1-out-${i}.json`;
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  if (data.epic) {
    for (const [slug, trans] of Object.entries(data.epic)) {
      if (!finalNarratives[slug]) finalNarratives[slug] = {};
      finalNarratives[slug].epic_en = trans.en;
      finalNarratives[slug].epic_ko = trans.ko;
    }
  }

  if (data.factLayer) {
    for (const [slug, trans] of Object.entries(data.factLayer)) {
      factLayerEn[slug] = { slug, timeline: trans.en };
      factLayerKo[slug] = { slug, timeline: trans.ko };
      factLayerAll[slug] = { slug, timeline: trans.ko }; // original structure kept ko in all
    }
  }
}

// 2. Merge Task 2
for (let i = 1; i <= 3; i++) {
  const file = `scratch/t2-out-${i}.json`;
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));

  for (const item of data) {
    const slug = item.slug;
    if (item.type === 'headline') {
      koMessages.Giants[slug].headline = item.ko;
    } else if (item.type === 'epic') {
      if (finalNarratives[slug]) finalNarratives[slug].epic_ko = item.ko;
    } else if (item.type === 'trials') {
      if (finalNarratives[slug]) finalNarratives[slug].trials_ko = item.ko;
    } else if (item.type === 'fact-layer') {
      if (factLayerKo[slug]) factLayerKo[slug].timeline = item.ko;
      if (factLayerAll[slug]) factLayerAll[slug].timeline = item.ko;
    }
  }
}

fs.writeFileSync('src/data/final-narratives.json', JSON.stringify(finalNarratives, null, 2));
fs.writeFileSync('src/data/fact-layers/fact-layer-en.json', JSON.stringify(factLayerEn, null, 2));
fs.writeFileSync('src/data/fact-layers/fact-layer-ko.json', JSON.stringify(factLayerKo, null, 2));
fs.writeFileSync('src/data/fact-layer-all.json', JSON.stringify(factLayerAll, null, 2));
fs.writeFileSync('messages/ko.json', JSON.stringify(koMessages, null, 2));

console.log('Merge complete!');
