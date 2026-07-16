const fs = require('fs');
const path = require('path');

const trPath = 'src/data/fact-layers/fact-layer-tr.json';
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));
const scratchDir = 'scratch';

const files = fs.readdirSync(scratchDir).filter(f => f.startsWith('task_tr_out_') && f.endsWith('.json'));
let mergedCount = 0;
let mergedSlugs = new Set();

for (let file of files) {
  const filePath = path.join(scratchDir, file);
  try {
    const batchData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (let slug of Object.keys(batchData)) {
      trData[slug] = batchData[slug];
      mergedSlugs.add(slug);
      mergedCount++;
    }
  } catch(e) {
    console.error('Error reading file', file, e);
  }
}

fs.writeFileSync(trPath, JSON.stringify(trData, null, 2));
console.log('Merged', mergedSlugs.size, 'unique giants from', files.length, 'files into fact-layer-tr.json.');

// Scan for Korean
const koRegex = /[\uAC00-\uD7A3\u1100-\u11FF\u3130-\u318F]/;
let koCount = 0;
let infectedSlugs = [];

for (let slug of Object.keys(trData)) {
  const str = JSON.stringify(trData[slug]);
  if (koRegex.test(str)) {
    koCount++;
    infectedSlugs.push(slug);
  }
}
console.log('Korean remnants count:', koCount);
if(koCount > 0) {
    console.log('Infected slugs:', infectedSlugs);
}
