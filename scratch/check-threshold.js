const fs = require('fs');
const path = require('path');
const TRANSLATIONS_DIR = path.resolve('scratch/translations');
const files = fs.readdirSync(TRANSLATIONS_DIR).filter(f => f.startsWith('final-') && f.endsWith('.json'));
const engStopWords = /\b(the|of|with|that|this|it|for)\b/gi;

let countAbove8 = 0;
let maxMatches = 0;
let maxFile = '';

for (const f of files) {
  const langCode = f.replace('final-', '').replace('.json', '');
  if (langCode === 'ko' || langCode === 'en') continue;
  const transData = JSON.parse(fs.readFileSync(path.join(TRANSLATIONS_DIR, f), 'utf8'));
  for (const slug of Object.keys(transData)) {
    const trans = transData[slug];
    const matches = trans.narrative.match(engStopWords) || [];
    if (matches.length > maxMatches) {
      maxMatches = matches.length;
      maxFile = `${langCode} - ${slug}`;
    }
    if (matches.length >= 8) countAbove8++;
  }
}
console.log('above 8:', countAbove8);
console.log('max matches:', maxMatches, 'in', maxFile);
