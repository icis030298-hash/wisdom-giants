const fs = require('fs');
const path = require('path');

const locales = ['en', 'ko', 'ja', 'de', 'es', 'fr', 'it', 'pt'];
const folder = path.join(__dirname, '..', 'messages');

const krRegex = /[가-힣]/;
const jpRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/; // Hiragana, Katakana, Kanji

const reports = {};

for (const loc of locales) {
  const file = path.join(folder, `${loc}.json`);
  if (!fs.existsSync(file)) continue;
  
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const issues = [];
  
  function scan(obj, currentPath = '') {
    if (typeof obj === 'string') {
      // Rule 1: en.json should not contain Korean or Japanese
      if (loc === 'en') {
        if (krRegex.test(obj)) {
          issues.push({ path: currentPath, problem: 'Contains Korean', value: obj });
        }
      }
      // Rule 2: ja.json should not contain Korean
      if (loc === 'ja') {
        if (krRegex.test(obj)) {
          issues.push({ path: currentPath, problem: 'Contains Korean', value: obj });
        }
      }
      // Rule 3: ko.json should not contain untranslated English sentences
      if (loc === 'ko') {
        // If it starts with English letters and has spaces (longer sentence), it might be untranslated
        if (/^[A-Za-z\s.,'!?-]{15,}$/.test(obj.trim())) {
          issues.push({ path: currentPath, problem: 'Looks like untranslated English', value: obj });
        }
      }
    } else if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        scan(obj[i], `${currentPath}[${i}]`);
      }
    } else if (obj !== null && typeof obj === 'object') {
      for (const [key, val] of Object.entries(obj)) {
        scan(val, currentPath ? `${currentPath}.${key}` : key);
      }
    }
  }
  
  scan(data);
  if (issues.length > 0) {
    reports[loc] = issues;
  }
}

console.log('Language audit issues found:');
console.log(JSON.stringify(reports, null, 2));
