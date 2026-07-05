const fs = require('fs');
const path = require('path');

const locales = ['ar','de','el','es','fa','fr','ha','he','hi','id','it','ja','ko','nl','pl','pt','ru','sw','th','tr','uk','vi','zh'];
const messagesDir = path.resolve(__dirname, '../messages');
const enMessages = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));

const results = {};

for (const loc of locales) {
  const filePath = path.join(messagesDir, `${loc}.json`);
  if (!fs.existsSync(filePath)) continue;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let totalGiants = 0;
  let missingTrials = 0;
  let missingOvercoming = 0;
  let missingWisdom = 0;
  let missingEra = 0;

  for (const slug of Object.keys(data)) {
    if (slug === 'ui' || slug === 'blog') continue;
    totalGiants++;
    const giant = data[slug];
    const enGiant = enMessages[slug];
    
    if (!enGiant) continue;

    // We assume it is "missing" (untranslated) if the value exactly matches English.
    // Or if it doesn't exist.
    if (!giant.trials || giant.trials === enGiant.trials) missingTrials++;
    if (!giant.overcoming || giant.overcoming === enGiant.overcoming) missingOvercoming++;
    if (!giant.era || giant.era === enGiant.era) missingEra++;
    
    // Wisdom lessons is an array of objects { quote, explanation }
    if (!giant.wisdom_lessons || JSON.stringify(giant.wisdom_lessons) === JSON.stringify(enGiant.wisdom_lessons)) {
      missingWisdom++;
    }
  }

  results[loc] = {
    total: totalGiants,
    missingTrials,
    missingOvercoming,
    missingWisdom,
    missingEra
  };
}

console.log(JSON.stringify(results, null, 2));
