const fs = require('fs');
const path = require('path');

const translatedData = JSON.parse(fs.readFileSync('task3_pl_translated.json', 'utf8'));
const masterFile = path.join(__dirname, 'src', 'data', 'fact-layers', 'fact-layer-pl.json');
const masterData = JSON.parse(fs.readFileSync(masterFile, 'utf8'));

let updatedCount = 0;
for (const [slug, data] of Object.entries(translatedData)) {
  if (!masterData[slug]) {
    masterData[slug] = data; // fallback, but shouldn't happen
  } else {
    // Merge translated fields
    if (data.timeline) masterData[slug].timeline = data.timeline;
    if (data.keyAchievements) masterData[slug].keyAchievements = data.keyAchievements;
    if (data.faq) masterData[slug].faq = data.faq;
    if (data.missingDataNote !== undefined) masterData[slug].missingDataNote = data.missingDataNote;
  }
  updatedCount++;
}

fs.writeFileSync(masterFile, JSON.stringify(masterData, null, 2));
console.log(`Merged ${updatedCount} items into fact-layer-pl.json`);
