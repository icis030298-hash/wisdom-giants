const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');

const translations = {
  ko: "지혜를 지탱하는 세 기둥",
  en: "The Pillars of Wisdom",
  de: "Die Säulen der Weisheit",
  ja: "知恵を支える柱",
  es: "Los Pilares de la Sabiduría",
  fr: "Les Piliers de la Sagesse",
  it: "I Pilastri della Saggezza",
  pt: "Os Pilares da Sabedoria"
};

console.log('Injecting pillarsOfWisdom into About namespace in all JSON files...');

for (const lang in translations) {
  const filePath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (data.About) {
    data.About.pillarsOfWisdom = translations[lang];
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`  [SUCCESS] Injected pillarsOfWisdom in ${lang}.json`);
  } else {
    console.log(`  [WARNING] About namespace not found in ${lang}.json`);
  }
}

console.log('Injection complete!');
