const fs = require('fs');
const path = require('path');

const narrativesDir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const files = fs.readdirSync(narrativesDir).map(f => f.replace('.json', ''));

const candidateSearch = [
  { search: 'nzinga', region: 'Africa', category: 'leadership', gender: 'Female', era: '17th Century' },
  { search: 'trung', region: 'Southeast Asia', category: 'leadership', gender: 'Female', era: '1st Century (Ancient)' },
  { search: 'juana', region: 'Latin America', category: 'arts', gender: 'Female', era: '17th Century' },
  { search: 'averroes', region: 'Middle East / Andalusia', category: 'philosophy', gender: 'Male', era: '12th Century (Medieval)' },
  { search: 'aryabhata', region: 'South Asia (India)', category: 'science', gender: 'Male', era: '5th-6th Century (Ancient)' },
  { search: 'solgeo', region: 'East Asia (Korea)', category: 'arts', gender: 'Male', era: '6th Century (Medieval)' },
  { search: 'lumumba', region: 'Africa', category: 'society/leadership', gender: 'Male', era: '20th Century (Modern)' },
  { search: 'hypatia', region: 'Europe / Greco-Roman', category: 'science/philosophy', gender: 'Female', era: '4th-5th Century (Ancient)' }
];

console.log('=== VERIFYING EXACT SLUGS IN SRC/DATA/NARRATIVES/ ===\n');

candidateSearch.forEach(item => {
  const match = files.find(f => f.includes(item.search));
  if (match) {
    const data = JSON.parse(fs.readFileSync(path.join(narrativesDir, `${match}.json`), 'utf8'));
    console.log(`[MATCH FOUND] Slug: "${match}"`);
    console.log(`  - Region: ${item.region} | Category: ${data.category || item.category} | Gender: ${item.gender} | Era: ${data.era_ko || item.era}`);
    console.log(`  - Epic KO snippet: ${(data.epic_ko || '').slice(0, 80)}...\n`);
  } else {
    console.log(`[NO MATCH] Could not find slug containing "${item.search}"\n`);
  }
});
