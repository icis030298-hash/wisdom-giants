const fs = require('fs');
const path = require('path');

const locales = ['de', 'en', 'es', 'fr', 'it', 'ja', 'pt'];
const koreanRegex = /[\uAC00-\uD7A3]/;

const summary = {};
const details = {};

locales.forEach(locale => {
  const filePath = path.join(__dirname, `../messages/${locale}.json`);
  if (!fs.existsSync(filePath)) {
    summary[locale] = "File does not exist";
    return;
  }

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

  summary[locale] = `${contaminated.length} contaminated keys`;
  if (contaminated.length > 0) {
    details[locale] = contaminated;
  }
});

console.log("Contamination Summary:");
console.log(JSON.stringify(summary, null, 2));

fs.writeFileSync(
  path.join(__dirname, 'contamination-details.json'),
  JSON.stringify(details, null, 2),
  'utf8'
);
console.log("Details written to scratch/contamination-details.json");
