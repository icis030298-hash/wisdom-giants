const fs = require('fs');
const path = require('path');

const he = JSON.parse(fs.readFileSync('src/data/fact-layers/fact-layer-he.json', 'utf8'));
const ko = JSON.parse(fs.readFileSync('src/data/fact-layers/fact-layer-ko.json', 'utf8'));

const koRegex = /[\u3131-\uD79D]/;
let targets = [];

for (let slug of Object.keys(he)) {
  let isKorean = false;
  if (koRegex.test(JSON.stringify(he[slug]))) {
    targets.push(slug);
  }
}

console.log('Found HE targets with Korean:', targets.length);

let chunks = 10;
let size = Math.ceil(targets.length / chunks);

for (let i = 0; i < chunks; i++) {
  let chunk = targets.slice(i * size, (i + 1) * size);
  if(chunk.length === 0) continue;
  let chunkData = {};
  for (let slug of chunk) {
    chunkData[slug] = ko[slug]; // Use KO as source of truth
  }
  fs.writeFileSync(`scratch/task_he_in_${i}.json`, JSON.stringify(chunkData, null, 2));
}

console.log(`Created ${chunks} chunks.`);
