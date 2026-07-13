const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, '../src/data/final-narratives.json');
const narrativesDir = path.join(__dirname, '../src/data/narratives');
const summaryFile = path.join(__dirname, '../src/data/giants-summary.json');

if (!fs.existsSync(narrativesDir)) {
  fs.mkdirSync(narrativesDir, { recursive: true });
}

console.log('Reading 85MB JSON file...');
const rawData = fs.readFileSync(srcFile, 'utf8');
const finalNarratives = JSON.parse(rawData);

const locales = ['ko', 'en', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'fa', 'pl', 'pt', 'ru', 'es', 'sw', 'th', 'tr', 'uk', 'vi'];

const summaryData = {};
let count = 0;

for (const slug of Object.keys(finalNarratives)) {
  const giantData = finalNarratives[slug];
  
  // 1. Write individual file
  fs.writeFileSync(
    path.join(narrativesDir, `${slug}.json`),
    JSON.stringify(giantData)
  );

  // 2. Build summary for homepage
  const summaryGiant = {};
  
  // Keep only fact_box and era for all locales
  for (const loc of locales) {
    if (giantData[`fact_box_${loc}`]) {
      summaryGiant[`fact_box_${loc}`] = giantData[`fact_box_${loc}`];
    }
    
    if (giantData[`era_${loc}`]) {
      summaryGiant[`era_${loc}`] = giantData[`era_${loc}`];
    }
  }
  // also keep default fact_box and era
  if (giantData.fact_box) summaryGiant.fact_box = giantData.fact_box;
  if (giantData.fact_box_ko) summaryGiant.fact_box_ko = giantData.fact_box_ko;
  if (giantData.fact_box_en) summaryGiant.fact_box_en = giantData.fact_box_en;
  if (giantData.era) summaryGiant.era = giantData.era;
  
  // Only keep the first wisdom quote for each locale (for the homepage card)
  if (giantData.wisdom && giantData.wisdom.length > 0) {
    const firstWisdom = giantData.wisdom[0];
    const newWisdom = {};
    for (const loc of locales) {
      if (firstWisdom[`quote_${loc}`]) {
        newWisdom[`quote_${loc}`] = firstWisdom[`quote_${loc}`];
      }
    }
    if (firstWisdom.quote_en) newWisdom.quote_en = firstWisdom.quote_en;
    summaryGiant.wisdom = [newWisdom];
  } else {
    summaryGiant.wisdom = [];
  }

  summaryData[slug] = summaryGiant;
  count++;
}

// 3. Write summary file
console.log('Writing giants-summary.json...');
fs.writeFileSync(summaryFile, JSON.stringify(summaryData));

console.log(`Successfully split ${count} giants.`);
console.log('Summary file size:', (fs.statSync(summaryFile).size / 1024 / 1024).toFixed(2), 'MB');
