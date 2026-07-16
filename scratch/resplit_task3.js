const fs = require('fs');
const path = require('path');

const giants = {};

for (let i = 0; i < 3; i++) {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, `task3_id_chunk_${i}.json`), 'utf8'));
    Object.assign(giants, data);
}

const entries = Object.entries(giants);
const chunkSize = 5;
const numChunks = Math.ceil(entries.length / chunkSize);

for (let i = 0; i < numChunks; i++) {
    const chunk = entries.slice(i * chunkSize, (i + 1) * chunkSize);
    const chunkObj = Object.fromEntries(chunk);
    fs.writeFileSync(path.join(__dirname, `task3_id_retry_chunk_${i}.json`), JSON.stringify(chunkObj, null, 2));
    console.log(`Created retry chunk ${i} with ${chunk.length} giants.`);
}
