const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));

const langs = [
  'en', 'es', 'fr', 'de', 'ja', 'zh', 'ar', 'ru', 'pt', 'it', 'hi', 'bn',
  'tr', 'fa', 'pl', 'nl', 'sv', 'vi', 'uk', 'id', 'cs', 'ro', 'hu', 'sw', 'ha',
  'th', 'el'
];

const totalGiants = Object.keys(data).length;
console.log(`Total Giants: ${totalGiants}`);

const report = {};
for (const lang of langs) {
  report[lang] = {
    epic: 0,
    trials: 0,
    overcoming: 0,
    era: 0,
    wisdom: 0
  };
}

for (const slug of Object.keys(data)) {
  const g = data[slug];
  for (const lang of langs) {
    if (g[`epic_${lang}`] && !g[`epic_${lang}`].startsWith('[') && g[`epic_${lang}`].trim().length > 100) {
      report[lang].epic++;
    }
    if (g[`trials_${lang}`] && !g[`trials_${lang}`].startsWith('[') && g[`trials_${lang}`].trim().length > 10) {
      report[lang].trials++;
    }
    if (g[`overcoming_${lang}`] && !g[`overcoming_${lang}`].startsWith('[') && g[`overcoming_${lang}`].trim().length > 10) {
      report[lang].overcoming++;
    }
    if (g[`era_${lang}`] && !g[`era_${lang}`].startsWith('[') && g[`era_${lang}`].trim().length > 0) {
      report[lang].era++;
    }
    let wisdomCount = 0;
    if (g.wisdom && Array.isArray(g.wisdom)) {
      g.wisdom.forEach(w => {
        if (w[`quote_${lang}`] && !w[`quote_${lang}`].startsWith('[') && w[`quote_${lang}`].trim().length > 0) {
          wisdomCount++;
        }
      });
    }
    if (wisdomCount === (g.wisdom ? g.wisdom.length : 0) && wisdomCount > 0) {
      report[lang].wisdom++;
    }
  }
}

console.log('--- Translation Coverage Report ---');
console.table(report);
