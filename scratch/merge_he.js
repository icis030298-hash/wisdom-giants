const fs = require('fs');
const path = require('path');

const hePath = 'src/data/fact-layers/fact-layer-he.json';
const heData = JSON.parse(fs.readFileSync(hePath, 'utf8'));

const completedBatches = [1, 3, 4, 7, 8, 9];
let mergedCount = 0;

for (let batch of completedBatches) {
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
