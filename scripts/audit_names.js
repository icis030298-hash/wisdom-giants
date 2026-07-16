const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

let totalUntranslated = 0;
const report = {};

files.forEach(file => {
  const langCode = file.replace('.json', '');
  // English is the source, no need to audit its translation
  if (langCode === 'en') return;
  
  const content = JSON.parse(fs.readFileSync(path.join(messagesDir, file), 'utf-8'));
  let untranslatedCount = 0;
  
  // We assume translation objects have structure:
  // "albert-einstein": { "name": "...", "headline": "..." }
  // We will check all top-level keys that have a "name" property
  
  for (const [key, value] of Object.entries(content.Giants || {})) {
    if (value && typeof value === 'object' && value.name) {
      const name = value.name;
      
      // Basic heuristic: check if the name still has Russian/Cyrillic characters in non-Russian languages
      // Or check if it has Latin characters in non-Latin languages (e.g. ko, ja, zh, th, ar, he)
      let isUntranslated = false;
      
      const hasCyrillic = /[А-Яа-яЁё]/.test(name);
      const hasLatin = /[a-zA-Z]/.test(name);
      
      if (langCode !== 'ru' && langCode !== 'uk' && hasCyrillic) {
        isUntranslated = true;
      }
      
      if (['ko', 'ja', 'zh', 'th', 'ar', 'he', 'fa', 'hi'].includes(langCode) && hasLatin) {
        isUntranslated = true;
      }
      
      if (isUntranslated) {
        untranslatedCount++;
      }
    }
  }
  
  report[langCode] = untranslatedCount;
  totalUntranslated += untranslatedCount;
});

console.log(`Total untranslated/mismatched names found: ${totalUntranslated}`);
console.log("Breakdown by language:");
for (const [lang, count] of Object.entries(report)) {
  if (count > 0) {
    console.log(`${lang}: ${count} names`);
  }
}
