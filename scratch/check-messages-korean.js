const fs = require('fs');
const path = require('path');

const locales = ['de', 'en', 'es', 'fr', 'it', 'ja', 'pt'];
const koreanRegex = /[\uAC00-\uD7A3]/;

locales.forEach(locale => {
  const filePath = path.join(__dirname, `../messages/${locale}.json`);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  
  const contaminated = [];

  function scan(obj, currentPath = '') {
    if (!obj) return;
    if (typeof obj === 'string') {
      if (koreanRegex.test(obj)) {
        contaminated.push({ path: currentPath, value: obj });
      }
    } else if (typeof obj === 'object') {
      for (const [key, val] of Object.entries(obj)) {
        scan(val, currentPath ? `${currentPath}.${key}` : key);
      }
    }
  }

  scan(json);

  console.log(`\nLocale: ${locale} | Contaminated keys count: ${contaminated.length}`);
  if (contaminated.length > 0) {
    console.log(JSON.stringify(contaminated, null, 2));
  }
});
