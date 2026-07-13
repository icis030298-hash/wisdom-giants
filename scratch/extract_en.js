const fs = require('fs');
const path = require('path');

const targets = JSON.parse(fs.readFileSync(path.join(__dirname, 'retranslation-targets.json'), 'utf-8'));
const narratives = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/final-narratives.json'), 'utf-8'));

const out = targets.map(t => {
  const enKey = t.key.replace(/_[a-z]{2,3}$/, '_en');
  const narrative = narratives[t.slug];
  
  let enText = 'NOT FOUND';
  if (narrative) {
    if (enKey.startsWith('quote_')) {
      // Find the quote in wisdom array that has a meaning_en (usually wisdom is an array)
      // Since there could be multiple quotes, we'll try to find the one matching the prefix or just grab all English quotes for this character if it's tricky, but let's see how wisdom is structured. 
      // Actually, let's just grab the wisdom array and we'll translate it manually or return the first matching one. Wait, we need the exact english source for the specific quote.
      enText = JSON.stringify(narrative.wisdom);
    } else {
      enText = narrative[enKey];
    }
  }
  
  return {
    slug: t.slug,
    key: t.key,
    locale: t.locale,
    enText: enText
  };
});

fs.writeFileSync(path.join(__dirname, 'extracted_texts.json'), JSON.stringify(out, null, 2));
console.log('done');
