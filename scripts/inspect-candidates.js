const fs = require('fs');
const candidates = JSON.parse(fs.readFileSync('scripts/candidates-approval.json', 'utf8'));

console.log('--- Candidate list for review ---');
candidates.forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.region.toUpperCase()}] ${c.nameEn} (${c.slug}) - Bio: ${c.briefBio}`);
});
