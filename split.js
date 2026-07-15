const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/korean_strings.json', 'utf8'));

const CHUNK_SIZE = 250;
let chunkIndex = 1;
for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    fs.writeFileSync(`scratch/korean_chunk_${chunkIndex}.json`, JSON.stringify(chunk, null, 2));
    chunkIndex++;
}
