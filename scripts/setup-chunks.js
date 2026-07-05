const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/final-narratives.json'));
const p = JSON.parse(fs.readFileSync('scratch/pilot-narratives-draft.json')).map(x => x.slug);
const b1 = JSON.parse(fs.readFileSync('scratch/batch1-narratives-draft.json')).map(x => x.slug);
const b2 = JSON.parse(fs.readFileSync('scratch/batch2-narratives-draft.json')).map(x => x.slug);

const skip = new Set([...p, ...b1, ...b2]);
const remaining = Object.entries(data).filter(([s, v]) => (v.epic_ko||'').length < 1200 && !skip.has(s)).map(x => x[0]);

console.log('Total remaining slugs:', remaining.length);

const numChunks = 10;
const chunkSize = Math.ceil(remaining.length / numChunks);

for (let i = 0; i < numChunks; i++) {
  const start = i * chunkSize;
  const end = Math.min(start + chunkSize, remaining.length);
  const chunk = remaining.slice(start, end);
  
  if (chunk.length > 0) {
    fs.writeFileSync(`scratch/batch3-chunk-${i + 1}.json`, JSON.stringify(chunk, null, 2));
    console.log(`Created chunk ${i + 1} with ${chunk.length} slugs`);
  }
}
