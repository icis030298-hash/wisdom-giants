const fs = require('fs');
const path = require('path');
const outData = {};

for(let i=0; i<10; i++) {
  const retryFile = path.join(__dirname, 'scratch', `task3_pl_retry_out_${i}.json`);
  const chunkFile = path.join(__dirname, 'scratch', `task3_pl_out_${i}.json`); // I think the earlier chunks were pl_out
  const sourceChunkFile = path.join(__dirname, 'scratch', `task3_pl_chunk_${i}.json`);
  
  if (fs.existsSync(retryFile)) {
    const data = JSON.parse(fs.readFileSync(retryFile, 'utf8'));
    Object.assign(outData, data);
    console.log(`Merged retry chunk ${i} (${Object.keys(data).length} items)`);
  } else if (fs.existsSync(chunkFile)) {
    const data = JSON.parse(fs.readFileSync(chunkFile, 'utf8'));
    Object.assign(outData, data);
    console.log(`Merged original out chunk ${i} (${Object.keys(data).length} items)`);
  } else {
    console.log(`WARNING: Missing output for chunk ${i}`);
  }
}

fs.writeFileSync('task3_pl_translated.json', JSON.stringify(outData, null, 2));
console.log('Merged PL successfully, total keys:', Object.keys(outData).length);
