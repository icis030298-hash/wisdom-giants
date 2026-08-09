const fs = require('fs');

const allLocales = ['ar', 'de', 'el', 'en', 'es', 'fa', 'fr', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'sw', 'th', 'tr', 'uk', 'vi', 'zh'];
const completedLocales = ['fr', 'ko', 'en', 'id', 'fa', 'es', 'ru', 'zh', 'ja'];
const remainingLocales = allLocales.filter(l => !completedLocales.includes(l));

console.log('Remaining locales to audit:', remainingLocales);

const roster = JSON.parse(fs.readFileSync('scratch/existing_493_roster.json', 'utf8'));

const messages = {};
for (const l of remainingLocales) {
  messages[l] = JSON.parse(fs.readFileSync(`messages/${l}.json`, 'utf8'));
}

const auditData = roster.map(g => {
  const giantData = {
    slug: g.slug,
    nameEn: g.nameEn,
    names: {}
  };
  for (const l of remainingLocales) {
    giantData.names[l] = messages[l]?.Giants?.[g.slug]?.name || '';
  }
  return giantData;
});

// Split into 10 batches
const batchSize = Math.ceil(auditData.length / 10);
for (let i = 0; i < 10; i++) {
  const batch = auditData.slice(i * batchSize, (i + 1) * batchSize);
  fs.writeFileSync(`scratch/name_audit_remaining_batch_${i + 1}.json`, JSON.stringify(batch, null, 2), 'utf8');
}

console.log(`Created 10 batches of size ~${batchSize} in scratch/name_audit_remaining_batch_X.json`);
