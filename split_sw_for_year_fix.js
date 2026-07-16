const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'src/data/fact-layers/fact-layer-sw.json');
const data = JSON.parse(fs.readFileSync(srcFile, 'utf8'));

const yearData = {};
for (const [slug, d] of Object.entries(data)) {
  yearData[slug] = {};
  if (d.timeline) {
    d.timeline.forEach((item, index) => {
      yearData[slug][index] = item.year;
    });
  }
}

const entries = Object.entries(yearData);
const CHUNKS = 5;
const itemsPerChunk = Math.ceil(entries.length / CHUNKS);

for (let i = 0; i < CHUNKS; i++) {
  const chunkEntries = entries.slice(i * itemsPerChunk, (i + 1) * itemsPerChunk);
  const chunkObj = Object.fromEntries(chunkEntries);
  const chunkFile = path.join(__dirname, 'scratch', `sw_year_fix_in_${i}.json`);
  fs.writeFileSync(chunkFile, JSON.stringify(chunkObj, null, 2));
  console.log(`Created chunk ${i} with ${chunkEntries.length} giants.`);
}
