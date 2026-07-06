const fs = require('fs');
const path = require('path');

const koDataPath = path.join(__dirname, '../src/data/fact-layers/fact-layer-ko.json');
const outputDir = path.join(__dirname, '../src/data/fact-layers');
const transBaseDir = path.join(__dirname, '../scratch/optimization/translations');

if (!fs.existsSync(koDataPath)) {
  console.error('fact-layer-ko.json not found!');
  process.exit(1);
}

const koData = JSON.parse(fs.readFileSync(koDataPath, 'utf-8'));

// Get all locales that have translation files
if (!fs.existsSync(transBaseDir)) {
  console.log('No translations directory found.');
  process.exit(0);
}

const locales = fs.readdirSync(transBaseDir).filter(f => fs.statSync(path.join(transBaseDir, f)).isDirectory());

locales.forEach(locale => {
  const localeDir = path.join(transBaseDir, locale);
  const transFiles = fs.readdirSync(localeDir).filter(f => f.startsWith('trans_chunk_') && f.endsWith('.json'));

  // Load all unique translations into a single map
  const translationMap = {};
  transFiles.forEach(file => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(localeDir, file), 'utf-8'));
      Object.assign(translationMap, data);
    } catch (e) {
      console.error(`Failed to parse translation file ${file} for locale ${locale}:`, e);
    }
  });

  // Rebuild the fact layer structure
  const localizedData = JSON.parse(JSON.stringify(koData));

  Object.entries(localizedData).forEach(([slug, data]) => {
    if (data.timeline) {
      data.timeline.forEach((item, idx) => {
        if (translationMap[item.year]) item.year = translationMap[item.year];
        if (translationMap[item.event]) item.event = translationMap[item.event];
      });
    }
    if (data.keyAchievements) {
      data.keyAchievements.forEach((item, idx) => {
        if (translationMap[item.title]) item.title = translationMap[item.title];
        if (translationMap[item.description]) item.description = translationMap[item.description];
      });
    }
    if (data.faq) {
      data.faq.forEach((item, idx) => {
        if (translationMap[item.question]) item.question = translationMap[item.question];
        if (translationMap[item.answer]) item.answer = translationMap[item.answer];
      });
    }
  });

  const outputPath = path.join(outputDir, `fact-layer-${locale}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(localizedData, null, 2));
  console.log(`Successfully rebuilt fact-layer-${locale}.json with ${Object.keys(translationMap).length} translations.`);
});

console.log('Rebuild complete.');
