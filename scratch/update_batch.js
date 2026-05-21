const fs = require('fs');
const path = require('path');

const batchFilePath = process.argv[2];
if (!batchFilePath) {
  console.error("Please provide path to the batch JSON file.");
  process.exit(1);
}

const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
const originalData = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const batchPath = path.resolve(batchFilePath);
const batchData = JSON.parse(fs.readFileSync(batchPath, 'utf8'));

Object.keys(batchData).forEach(slug => {
  if (originalData[slug]) {
    const orig = originalData[slug];
    const trans = batchData[slug];
    
    orig.era_es = trans.era_es;
    orig.epic_es = trans.epic_es;
    orig.trials_es = trans.trials_es;
    orig.overcoming_es = trans.overcoming_es;
    
    if (trans.wisdom && Array.isArray(trans.wisdom)) {
      trans.wisdom.forEach(w => {
        const origW = orig.wisdom[w.idx];
        if (origW) {
          origW.quote_es = w.quote_es;
          origW.meaning_es = w.meaning_es;
        }
      });
    }
    console.log(`Merged translations for: ${slug}`);
  } else {
    console.error(`Slug not found in original: ${slug}`);
  }
});

fs.writeFileSync(narrativesPath, JSON.stringify(originalData, null, 2), 'utf8');
console.log("Successfully wrote updated narratives back to src/data/final-narratives.json");
