const fs = require('fs');

const narrativesPath = 'src/data/final-narratives.json';
const retranslatedPath = 'scratch/retranslated.json';

const data = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
const retranslated = JSON.parse(fs.readFileSync(retranslatedPath, 'utf8'));

let applied = 0;
let skipped = 0;

retranslated.forEach(item => {
  const { slug, key, translatedText } = item;
  
  if (!translatedText || translatedText.trim() === '') {
    skipped++;
    return;
  }
  
  if (!data[slug]) {
    console.warn(`Slug not found: ${slug}`);
    skipped++;
    return;
  }
  
  // Handle flat keys like trials_fa, overcoming_el
  if (data[slug].hasOwnProperty(key)) {
    data[slug][key] = translatedText;
    applied++;
  } else {
    // Try nested wisdom object
    if (data[slug].wisdom && typeof data[slug].wisdom === 'object') {
      const wisdomFound = Object.values(data[slug].wisdom).find(w => w && w[key] !== undefined);
      if (wisdomFound) {
        wisdomFound[key] = translatedText;
        applied++;
        return;
      }
    }
    console.warn(`Key not found: ${slug}.${key}`);
    skipped++;
  }
});

fs.writeFileSync(narrativesPath, JSON.stringify(data, null, 2));
console.log(`Applied: ${applied} | Skipped: ${skipped}`);
