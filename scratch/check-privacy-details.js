const fs = require('fs');
const path = require('path');

const locales = ['de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pt'];
locales.forEach(locale => {
  const filePath = path.join(__dirname, `../messages/${locale}.json`);
  if (!fs.existsSync(filePath)) return;
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`\n--- Locale: ${locale} ---`);
  console.log(json.Privacy.adsenseDesc);
});
