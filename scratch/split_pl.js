const fs = require('fs');
const path = require('path');

const giants = JSON.parse(fs.readFileSync(path.join(__dirname, 'task3_pl_en_source.json'), 'utf8'));
const entries = Object.entries(giants);
const chunkSize = 10;
const numChunks = Math.ceil(entries.length / chunkSize);

for (let i = 0; i < numChunks; i++) {
    const chunk = entries.slice(i * chunkSize, (i + 1) * chunkSize);
    const chunkObj = Object.fromEntries(chunk);
    fs.writeFileSync(path.join(__dirname, `task3_pl_chunk_${i}.json`), JSON.stringify(chunkObj, null, 2));
    console.log(`Created chunk ${i} for PL with ${chunk.length} giants.`);
}
