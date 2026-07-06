const fs = require('fs');
const path = require('path');

const koDataPath = path.join(__dirname, '../src/data/fact-layers/fact-layer-ko.json');
const koData = JSON.parse(fs.readFileSync(koDataPath, 'utf-8'));
const uniqueTexts = new Set();
const dateRegex = /^\d+년\s\d+월\s\d+일$|^기원전\s\d+년\s\d+월\s\d+일$|^\d+년\s\d+월$|^기원전\s\d+년\s\d+월$|^\d+년$|^기원전\s\d+년$/;

Object.values(koData).forEach(g => {
  if (g.timeline) {
    g.timeline.forEach(t => { 
      if (t.year && !dateRegex.test(t.year.trim())) uniqueTexts.add(t.year); 
      if (t.event) uniqueTexts.add(t.event); 
    });
  }
  if (g.keyAchievements) {
    g.keyAchievements.forEach(a => { 
      if (a.title) uniqueTexts.add(a.title); 
      if (a.description) uniqueTexts.add(a.description); 
    });
  }
  if (g.faq) {
    g.faq.forEach(f => { 
      if (f.question) uniqueTexts.add(f.question); 
      if (f.answer) uniqueTexts.add(f.answer); 
    });
  }
});

const textsArray = Array.from(uniqueTexts);
const outputDir = path.join(__dirname, '../scratch/optimization');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'unique-texts-ko.json'), JSON.stringify(textsArray, null, 2));
console.log(`Extracted ${textsArray.length} unique strings for translation (dates excluded).`);
