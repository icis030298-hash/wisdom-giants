const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'data', 'narratives');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let totalNarratives = files.length;
let post1990Giants = [];
let pre1990Giants = [];

function parseDeathYear(eraStr, epicKo) {
  const text = (eraStr + ' ' + (epicKo || '')).toLowerCase();
  const match = text.match(/~(\d{4})/);
  if (match) return parseInt(match[1], 10);
  const match2 = text.match(/(\d{4})년/);
  if (match2) return parseInt(match2[1], 10);
  return null;
}

files.forEach(f => {
  const slug = f.replace('.json', '');
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const deathYear = parseDeathYear(data.era_ko, data.epic_ko);
    if (deathYear && deathYear > 1990) {
      post1990Giants.push({ slug, deathYear, era_ko: data.era_ko });
    } else {
      pre1990Giants.push({ slug, deathYear, era_ko: data.era_ko });
    }
  } catch (e) {}
});

console.log('================================================================');
console.log('=== DEATH YEAR FILTER AUDIT (<= 1990 RELAXED RULE) ===');
console.log('================================================================\n');

console.log(`Total Narrative JSON files: ${totalNarratives}`);
console.log(`- Allowed Figures (Died <= 1990 or Ancient/Medieval): ${pre1990Giants.length}명`);
console.log(`- Excluded Figures (Died > 1990): ${post1990Giants.length}명\n`);

if (post1990Giants.length > 0) {
  console.log(`Excluded Post-1990 Figures (${post1990Giants.length}명):`);
  post1990Giants.forEach(g => console.log(`  - [${g.slug}] (${g.deathYear}년 사망): ${g.era_ko}`));
}
