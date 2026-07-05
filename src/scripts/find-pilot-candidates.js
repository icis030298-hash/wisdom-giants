const fs = require('fs');
const path = require('path');

const narrativesPath = path.resolve('src/data/final-narratives.json');
const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const shortGiants = [
  'antonio-gramsci', 'piye', 'alexander-pushkin', 'bumin-qaghan',
  'samuel-ajayi-crowther', 'rabindranath-tagore', 'franz-schubert', 'prempeh-i'
];

console.log('Short Giants Current Lengths (epic_ko):');
shortGiants.forEach(slug => {
  const data = narratives[slug];
  if (data) {
    console.log(`- ${slug}: ${data.epic_ko ? data.epic_ko.length : 0} chars`);
  } else {
    console.log(`- ${slug}: NOT FOUND in narratives`);
  }
});

console.log('\nCandidates in 897~999 range:');
const candidates = [];
Object.entries(narratives).forEach(([slug, data]) => {
  if (shortGiants.includes(slug)) return;
  const len = data.epic_ko ? data.epic_ko.length : 0;
  if (len >= 897 && len <= 999) {
    candidates.push({ slug, length: len, category: data.category });
  }
});

console.log(JSON.stringify(candidates, null, 2));
