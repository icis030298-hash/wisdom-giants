const fs = require('fs');
const path = require('path');

const hePath = 'src/data/fact-layers/fact-layer-he.json';
const heData = JSON.parse(fs.readFileSync(hePath, 'utf8'));

const finalBatches = [0, 2, 5, 6];
let mergedCount = 0;

for (let batch of finalBatches) {
  const batchFile = `scratch/task_he_out_${batch}.json`;
  if (fs.existsSync(batchFile)) {
    try {
      const batchData = JSON.parse(fs.readFileSync(batchFile, 'utf8'));
      for (let slug of Object.keys(batchData)) {
        heData[slug] = batchData[slug];
        mergedCount++;
      }
    } catch(e) {
      console.error('Error reading batch', batch, e);
    }
  }
}

fs.writeFileSync(hePath, JSON.stringify(heData, null, 2));
console.log('Merged', mergedCount, 'giants into fact-layer-he.json.');

// Scan for Korean
const koRegex = /[\u3131-\uD79D]/;
let koCount = 0;
let infectedSlugs = [];

for (let slug of Object.keys(heData)) {
  const str = JSON.stringify(heData[slug]);
  if (koRegex.test(str)) {
    koCount++;
    infectedSlugs.push(slug);
  }
}
console.log('Korean remnants count:', koCount);
if(koCount > 0) {
    console.log('Infected slugs:', infectedSlugs);
}
