const fs = require('fs');
const path = require('path');

const masterNarratives = JSON.parse(fs.readFileSync(path.resolve('src/data/final-narratives.json'), 'utf8'));
const slugs = Object.keys(masterNarratives);
const totalSlugs = slugs.length;

const targetLocales = ['ha', 'th', 'el', 'he'];
const checkpointsDir = path.resolve('scratch/translations/checkpoints');

console.log(`=== Translation Progress Audit (Total Giants: ${totalSlugs}) ===`);

for (const lang of targetLocales) {
  const cpFile = path.join(checkpointsDir, `${lang}.json`);
  if (!fs.existsSync(cpFile)) {
    console.log(`- [${lang}]: Checkpoint file not found. Progress: 0/${totalSlugs} (0%)`);
    continue;
  }
  
  const cp = JSON.parse(fs.readFileSync(cpFile, 'utf8'));
  let completed = 0;
  let failed = 0;
  
  for (const slug of slugs) {
    if (cp[slug]) {
      if (cp[slug].success) {
        completed++;
      } else {
        failed++;
      }
    }
  }
  
  const pct = ((completed / totalSlugs) * 100).toFixed(1);
  console.log(`- [${lang}]: Completed: ${completed}/${totalSlugs} (${pct}%), Failed/Retried: ${failed}`);
}
