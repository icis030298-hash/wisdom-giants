const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../scratch/optimization/unique-texts-ko.json');
const textsArray = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

const CHUNK_SIZE = 300;
const chunksDir = path.join(__dirname, '../scratch/optimization/chunks');

if (!fs.existsSync(chunksDir)) {
  fs.mkdirSync(chunksDir, { recursive: true });
}

let chunkIndex = 1;
for (let i = 0; i < textsArray.length; i += CHUNK_SIZE) {
  const chunk = textsArray.slice(i, i + CHUNK_SIZE);
  const chunkFilename = `chunk_${String(chunkIndex).padStart(3, '0')}.json`;
  fs.writeFileSync(path.join(chunksDir, chunkFilename), JSON.stringify(chunk, null, 2));
  chunkIndex++;
}

console.log(`Created ${chunkIndex - 1} chunks of size ${CHUNK_SIZE}.`);
