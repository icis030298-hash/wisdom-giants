const fs = require('fs');
const path = require('path');

const chunksToRetry = [0, 1, 2, 6];
let newChunkIdx = 0;

for (const oldIdx of chunksToRetry) {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, `task3_pl_chunk_${oldIdx}.json`), 'utf8'));
    const entries = Object.entries(data);
    
    // Half 1
    const half1 = Object.fromEntries(entries.slice(0, 5));
    fs.writeFileSync(path.join(__dirname, `task3_pl_retry_chunk_${newChunkIdx}.json`), JSON.stringify(half1, null, 2));
    newChunkIdx++;
    
    // Half 2
    const half2 = Object.fromEntries(entries.slice(5, 10));
    fs.writeFileSync(path.join(__dirname, `task3_pl_retry_chunk_${newChunkIdx}.json`), JSON.stringify(half2, null, 2));
    newChunkIdx++;
}
console.log(`Created ${newChunkIdx} retry chunks for PL.`);
