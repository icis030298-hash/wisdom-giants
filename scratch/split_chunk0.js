const fs = require('fs');
const path = require('path');

const giants = JSON.parse(fs.readFileSync(path.join(__dirname, `task3_id_retry_chunk_0.json`), 'utf8'));
const entries = Object.entries(giants);

for (let i = 0; i < entries.length; i++) {
    const chunkObj = { [entries[i][0]]: entries[i][1] };
    fs.writeFileSync(path.join(__dirname, `task3_id_retry2_chunk_${i}.json`), JSON.stringify(chunkObj, null, 2));
    console.log(`Created retry2 chunk ${i} for ${entries[i][0]}`);
}
