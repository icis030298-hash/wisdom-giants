const fs = require('fs');
const path = require('path');

const locales = ['de', 'es', 'fr', 'it', 'pt'];
const giantsToRemove = [
  'wright-brothers',
  'robert-oppenheimer',
  'chandragupta-maurya',
  'swami-vivekananda',
  'srinivasa-ramanujan',
  'br-ambedkar',
  'saladin',
  'suleiman-the-magnificent',
  'al-khwarizmi',
  'omar-khayyam'
];

locales.forEach(locale => {
  const filePath = path.join(__dirname, `../messages/${locale}.json`);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);

  if (json.Giants) {
    let removedCount = 0;
    giantsToRemove.forEach(slug => {
      if (json.Giants[slug]) {
        delete json.Giants[slug];
        removedCount++;
      }
    });
    console.log(`Locale ${locale}: Removed ${removedCount} giant entries.`);
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
});

console.log("Cleanup complete!");
