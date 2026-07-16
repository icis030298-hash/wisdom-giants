const fs = require('fs');
const path = require('path');

function splitLanguage(loc, chunkSize) {
    const inputFile = path.join(__dirname, `task3_${loc}_en_source.json`);
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    
    const entries = Object.entries(data);
    const numChunks = Math.ceil(entries.length / chunkSize);
    
    for (let i = 0; i < numChunks; i++) {
        const chunk = entries.slice(i * chunkSize, (i + 1) * chunkSize);
        const chunkObj = Object.fromEntries(chunk);
        fs.writeFileSync(path.join(__dirname, `task3_${loc}_chunk_${i}.json`), JSON.stringify(chunkObj, null, 2));
        console.log(`Created chunk ${i} for ${loc} with ${chunk.length} giants.`);
    }
    return numChunks;
}

const chunks = splitLanguage('id', 20);
console.log(`ID split into ${chunks} chunks.`);
