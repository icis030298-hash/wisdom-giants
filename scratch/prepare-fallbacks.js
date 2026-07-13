const fs = require('fs');

const path = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Fetch English fallbacks
const targets = JSON.parse(fs.readFileSync('scratch/retranslation-targets.json', 'utf8'));

let changes = 0;

targets.forEach(target => {
  const { slug, key, locale } = target;
  const enKey = key.replace(`_${locale}`, '_en');
  
  // Replace the contaminated field with the English fallback
  if (data[slug] && data[slug][enKey]) {
    data[slug][key] = data[slug][enKey];
    changes++;
  } else if (data[slug] && data[slug].wisdom && data[slug].wisdom[enKey]) { // Handle wisdom nested fields
    data[slug].wisdom[key] = data[slug].wisdom[enKey];
    changes++;
  }
});

fs.writeFileSync('scratch/retranslation-fallbacks.json', JSON.stringify(data, null, 2));
console.log(`Replaced ${changes} contaminated fields with English fallbacks in memory (scratch/retranslation-fallbacks.json).`);
