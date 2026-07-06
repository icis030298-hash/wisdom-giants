const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../src/data/fact-layers');
const koDataPath = path.join(outputDir, 'fact-layer-ko.json');
const koData = JSON.parse(fs.readFileSync(koDataPath, 'utf-8'));
const enData = JSON.parse(JSON.stringify(koData));

const transFile = path.join(__dirname, '../scratch/fact_layer_batches/en/trans_001.json');
if (fs.existsSync(transFile)) {
  const transMap = JSON.parse(fs.readFileSync(transFile, 'utf-8'));
  Object.entries(enData).forEach(([slug, data]) => {
    if (data.timeline) {
      data.timeline.forEach((item, idx) => {
        const yearId = `${slug}.timeline.${idx}.year`;
        const eventId = `${slug}.timeline.${idx}.event`;
        if (transMap[yearId]) item.year = transMap[yearId];
        if (transMap[eventId]) item.event = transMap[eventId];
      });
    }
    if (data.keyAchievements) {
      data.keyAchievements.forEach((item, idx) => {
        const titleId = `${slug}.keyAchievements.${idx}.title`;
        const descId = `${slug}.keyAchievements.${idx}.description`;
        if (transMap[titleId]) item.title = transMap[titleId];
        if (transMap[descId]) item.description = transMap[descId];
      });
    }
    if (data.faq) {
      data.faq.forEach((item, idx) => {
        const questionId = `${slug}.faq.${idx}.question`;
        const answerId = `${slug}.faq.${idx}.answer`;
        if (transMap[questionId]) item.question = transMap[questionId];
        if (transMap[answerId]) item.answer = transMap[answerId];
      });
    }
  });
}

fs.writeFileSync(path.join(outputDir, 'fact-layer-en.json'), JSON.stringify(enData, null, 2));
console.log('Created fact-layer-en.json with partial translations for testing.');
