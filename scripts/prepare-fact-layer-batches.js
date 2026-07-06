const fs = require('fs');
const path = require('path');

const koDataPath = path.join(__dirname, '../src/data/fact-layers/fact-layer-ko.json');
const outputDir = path.join(__dirname, '../scratch/fact_layer_batches');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const koData = JSON.parse(fs.readFileSync(koDataPath, 'utf-8'));

// Only process English for now
const targetLocales = ['en'];
const BATCH_SIZE = 150; // Items per batch

targetLocales.forEach(locale => {
  const localeDir = path.join(outputDir, locale);
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }

  let currentBatch = [];
  let batchIndex = 1;

  const saveBatch = () => {
    if (currentBatch.length > 0) {
      const filename = path.join(localeDir, `batch_${String(batchIndex).padStart(3, '0')}.json`);
      fs.writeFileSync(filename, JSON.stringify(currentBatch, null, 2));
      console.log(`Saved ${filename} with ${currentBatch.length} items`);
      currentBatch = [];
      batchIndex++;
    }
  };

  const addItem = (id, text) => {
    if (text && text.trim().length > 0) {
      currentBatch.push({
        id,
        sourceText: text
      });
      if (currentBatch.length >= BATCH_SIZE) {
        saveBatch();
      }
    }
  };

  Object.entries(koData).forEach(([slug, data]) => {
    if (data.timeline) {
      data.timeline.forEach((item, idx) => {
        addItem(`${slug}.timeline.${idx}.year`, item.year);
        addItem(`${slug}.timeline.${idx}.event`, item.event);
      });
    }
    if (data.keyAchievements) {
      data.keyAchievements.forEach((item, idx) => {
        addItem(`${slug}.keyAchievements.${idx}.title`, item.title);
        addItem(`${slug}.keyAchievements.${idx}.description`, item.description);
      });
    }
    if (data.faq) {
      data.faq.forEach((item, idx) => {
        addItem(`${slug}.faq.${idx}.question`, item.question);
        addItem(`${slug}.faq.${idx}.answer`, item.answer);
      });
    }
  });

  // Save remaining items
  saveBatch();
});

console.log('Batch preparation complete.');
