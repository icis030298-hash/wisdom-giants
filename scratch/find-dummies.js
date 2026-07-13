const fs = require('fs');
const fn = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));

let dummyCount = 0;
const dummies = [];

for (const [slug, data] of Object.entries(fn)) {
  for (const [key, val] of Object.entries(data)) {
    if (typeof val === 'string' && (val.includes('compiled') || val.includes('정리 중') || val.includes('coming soon'))) {
      dummies.push({slug, key, val});
      dummyCount++;
    }
  }
}

console.log(`Found ${dummyCount} dummy fields.`);
console.log(dummies.slice(0, 3));

// Check missing subfields for the 9 epics
const missing9 = ['ataturk', 'rosa-parks', 'simone-de-beauvoir', 'hannah-arendt', 'agatha-christie', 'queen-elizabeth-i', 'averroes-ibn-rushd', 'avicenna-ibn-sina', 'zarathushtra'];
const missingSubfields = [];

missing9.forEach(slug => {
  const d = fn[slug] || {};
  if (!d.trials_ko || d.trials_ko.trim() === '') missingSubfields.push(`${slug}: trials_ko`);
  if (!d.trials_en || d.trials_en.trim() === '') missingSubfields.push(`${slug}: trials_en`);
  if (!d.overcoming_ko || d.overcoming_ko.trim() === '') missingSubfields.push(`${slug}: overcoming_ko`);
  if (!d.overcoming_en || d.overcoming_en.trim() === '') missingSubfields.push(`${slug}: overcoming_en`);
  if (!d.wisdom || d.wisdom.trim() === '') missingSubfields.push(`${slug}: wisdom`);
});

console.log(`Missing subfields for the 9 giants:`, missingSubfields.slice(0, 5));
console.log(`Total missing subfields: ${missingSubfields.length}`);

fs.writeFileSync('scratch/dummy-targets.json', JSON.stringify({ dummies, missingSubfields: missing9 }, null, 2));
