const fs = require('fs');
const path = require('path');

const batchDir = 'scratch/narrative_batches';
const locales = ['de', 'es', 'fr', 'ha', 'he', 'id', 'it', 'ja', 'nl', 'pl', 'pt', 'sw', 'tr', 'vi'];

let grandTotal = 0;
locales.forEach(loc => {
  const outFile = path.join(batchDir, `out_narrative_${loc}.json`);
  if (fs.existsSync(outFile)) {
    const items = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    console.log(`${loc}: ${items.length} items`);
    grandTotal += items.length;
  } else {
    console.log(`${loc}: file missing`);
  }
});

console.log(`\nGrand Total across all 14 locales: ${grandTotal}`);
