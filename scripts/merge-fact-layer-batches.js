const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../scratch/fact_layer_batches');
const outputDir = path.join(__dirname, '../src/data/fact-layers');
const koDataPath = path.join(outputDir, 'fact-layer-ko.json');

if (!fs.existsSync(koDataPath)) {
  console.error("fact-layer-ko.json not found!");
  process.exit(1);
}

const koData = JSON.parse(fs.readFileSync(koDataPath, 'utf-8'));
const targetLocales = ['en'];

targetLocales.forEach(locale => {
  const localeDir = path.join(inputDir, locale);
  if (!fs.existsSync(localeDir)) return;

  const translatedFiles = fs.readdirSync(localeDir).filter(f => f.startsWith('translated_batch_'));
  
  if (translatedFiles.length === 0) {
    console.log(`No translated batches found for ${locale}.`);
    return;
  }

  // Create a deep copy of koData structure to fill with translations
  const localizedData = JSON.parse(JSON.stringify(koData));

  // Build a map of translations
  const translationsMap = {};
  let totalTranslatedItems = 0;

  translatedFiles.forEach(file => {
    const filePath = path.join(localeDir, file);
    try {
      const batchData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      batchData.forEach(item => {
        if (item.id && item.translatedText) {
          translationsMap[item.id] = item.translatedText;
          totalTranslatedItems++;
        }
      });
    } catch (e) {
      console.error(`Failed to parse ${file}:`, e);
    }
  });

  // Apply translations to the localizedData
  Object.entries(localizedData).forEach(([slug, data]) => {
    if (data.timeline) {
      data.timeline.forEach((item, idx) => {
        const yearId = `${slug}.timeline.${idx}.year`;
        const eventId = `${slug}.timeline.${idx}.event`;
        if (translationsMap[yearId]) item.year = translationsMap[yearId];
        if (translationsMap[eventId]) item.event = translationsMap[eventId];
      });
    }
    if (data.keyAchievements) {
      data.keyAchievements.forEach((item, idx) => {
        const titleId = `${slug}.keyAchievements.${idx}.title`;
        const descId = `${slug}.keyAchievements.${idx}.description`;
        if (translationsMap[titleId]) item.title = translationsMap[titleId];
        if (translationsMap[descId]) item.description = translationsMap[descId];
      });
    }
    if (data.faq) {
      data.faq.forEach((item, idx) => {
        const questionId = `${slug}.faq.${idx}.question`;
        const answerId = `${slug}.faq.${idx}.answer`;
        if (translationsMap[questionId]) item.question = translationsMap[questionId];
        if (translationsMap[answerId]) item.answer = translationsMap[answerId];
      });
    }
  });

  const outputPath = path.join(outputDir, `fact-layer-${locale}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(localizedData, null, 2));
  console.log(`Created ${outputPath} with ${totalTranslatedItems} translated items.`);
});

console.log('Fact layer merge complete.');
