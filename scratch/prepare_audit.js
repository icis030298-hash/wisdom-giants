const fs = require('fs');

const priorityLocales = ['fr', 'ko', 'en', 'id', 'fa', 'es', 'ru', 'zh', 'ja'];
const roster = JSON.parse(fs.readFileSync('scratch/existing_493_roster.json', 'utf8'));

const messages = {};
for (const l of priorityLocales) {
  messages[l] = JSON.parse(fs.readFileSync(`messages/${l}.json`, 'utf8'));
}

const auditData = roster.map(g => {
  const giantData = {
    slug: g.slug,
    nameEn: g.nameEn,
    names: {}
  };
  for (const l of priorityLocales) {
    giantData.names[l] = messages[l]?.Giants?.[g.slug]?.name || '';
  }
  return giantData;
});

// Split into 10 batches
const batchSize = Math.ceil(auditData.length / 10);
for (let i = 0; i < 10; i++) {
  const batch = auditData.slice(i * batchSize, (i + 1) * batchSize);
  fs.writeFileSync(`scratch/name_audit_batch_${i + 1}.json`, JSON.stringify(batch, null, 2), 'utf8');
}

console.log(`Created 10 batches of size ~${batchSize} in scratch/name_audit_batch_X.json`);
