const fs = require('fs');
const path = require('path');

const CHUNK_SIZE = 15;
const languages = ['sw', 'ha', 'nl'];
const koPath = path.join(__dirname, 'src', 'data', 'fact-layers', 'fact-layer-ko.json');
const koData = JSON.parse(fs.readFileSync(koPath, 'utf8'));

languages.forEach(lang => {
  const sourceFile = path.join(__dirname, 'scratch', `task3_${lang}_en_source.json`);
  if (!fs.existsSync(sourceFile)) {
    console.error(`Source list file not found: ${sourceFile}`);
    return;
  }

  // Use the English file ONLY to get the list of keys
  const enData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  const keys = Object.keys(enData);
  let chunkIndex = 0;

  for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
    const chunkKeys = keys.slice(i, i + CHUNK_SIZE);
    const chunkData = {};
    
    chunkKeys.forEach(k => {
      // Ensure we extract the raw Korean text!
      if (koData[k]) {
        chunkData[k] = koData[k];
      } else {
        console.warn(`Key ${k} not found in fact-layer-ko.json`);
      }
    });

    const outFile = path.join(__dirname, 'scratch', `task3_${lang}_ko_chunk_${chunkIndex}.json`);
    fs.writeFileSync(outFile, JSON.stringify(chunkData, null, 2));
    console.log(`Created ${outFile} with ${Object.keys(chunkData).length} items`);
    chunkIndex++;
  }
  console.log(`Language ${lang} split into ${chunkIndex} chunks based on KO source.`);
});
