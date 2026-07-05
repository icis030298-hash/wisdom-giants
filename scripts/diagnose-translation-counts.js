const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const slugs = Object.keys(data);

const locales = ['ar','de','el','es','fa','fr','ha','he','hi','id','it','ja','nl','pl','pt','ru','sw','th','tr','uk','vi','zh'];

console.log("=== TRANSLATION COUNTS PER LANGUAGE ===");
locales.forEach(loc => {
  let eraCount = 0;
  let trialsCount = 0;
  let overcomingCount = 0;
  let wisdomCount = 0;
  
  slugs.forEach(slug => {
    const g = data[slug];
    if (g[`era_${loc}`]) eraCount++;
    if (g[`trials_${loc}`]) trialsCount++;
    if (g[`overcoming_${loc}`]) overcomingCount++;
    
    const wisdom = g.wisdom || [];
    const hasWisdom = wisdom.length > 0 && wisdom.every(w => w[`quote_${loc}`]);
    if (hasWisdom) wisdomCount++;
  });
  
  console.log(`${loc}: era=${eraCount}, trials=${trialsCount}, overcoming=${overcomingCount}, wisdom=${wisdomCount} / ${slugs.length}`);
});
