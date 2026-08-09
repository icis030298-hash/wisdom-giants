const fs = require('fs');
const path = require('path');

const batchDir = 'scratch/narrative_batches';
const narrativeDir = 'src/data/narratives';
const locales = ['de', 'es', 'fr', 'ha', 'he', 'id', 'it', 'ja', 'nl', 'pl', 'pt', 'sw', 'tr', 'vi'];

let totalInjected = 0;
let totalFailed = 0;
const failureReport = [];

locales.forEach(loc => {
  const outFile = path.join(batchDir, `out_narrative_${loc}.json`);
  if (!fs.existsSync(outFile)) {
    console.error(`Missing output file for ${loc}`);
    return;
  }

  const items = JSON.parse(fs.readFileSync(outFile, 'utf8'));
  items.forEach(item => {
    const { slug, epic, trials, overcoming } = item;
    
    // Gate validation
    const valid = epic && String(epic).trim().length > 50 &&
                  trials && String(trials).trim().length > 30 &&
                  overcoming && String(overcoming).trim().length > 30;

    if (!valid) {
      totalFailed++;
      failureReport.push({ slug, loc, reason: 'Empty or too short fields' });
      return;
    }

    const narrativeFile = path.join(narrativeDir, `${slug}.json`);
    if (!fs.existsSync(narrativeFile)) {
      totalFailed++;
      failureReport.push({ slug, loc, reason: 'Target narrative file not found' });
      return;
    }

    const data = JSON.parse(fs.readFileSync(narrativeFile, 'utf8'));
    data[`epic_${loc}`] = epic;
    data[`trials_${loc}`] = trials;
    data[`overcoming_${loc}`] = overcoming;

    fs.writeFileSync(narrativeFile, JSON.stringify(data, null, 2), 'utf8');
    totalInjected++;
  });
});

console.log(`=== Injection Summary ===`);
console.log(`Successful Pairs Injected: ${totalInjected} / 134`);
console.log(`Failed Pairs: ${totalFailed}`);
if (failureReport.length > 0) {
  console.log('Failures:', failureReport);
}
