const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const report = {};

files.forEach(file => {
  const langCode = file.replace('.json', '');
  if (langCode === 'en') return;
  
  const content = JSON.parse(fs.readFileSync(path.join(messagesDir, file), 'utf-8'));
  
  for (const [key, value] of Object.entries(content.Giants || {})) {
    if (value && typeof value === 'object' && value.name) {
      const name = value.name;
      
      let isUntranslated = false;
      const hasCyrillic = /[А-Яа-яЁё]/.test(name);
      const hasLatin = /[a-zA-Z]/.test(name);
      
      if (langCode !== 'ru' && langCode !== 'uk' && hasCyrillic) isUntranslated = true;
      if (['ko', 'ja', 'zh', 'th', 'ar', 'he', 'fa', 'hi'].includes(langCode) && hasLatin) isUntranslated = true;
      
      if (isUntranslated) {
        if (!report[langCode]) report[langCode] = [];
        report[langCode].push({ key, name });
      }
    }
  }
});

fs.writeFileSync('missing_names_to_fix.json', JSON.stringify(report, null, 2));
console.log("Dumped 67 names to missing_names_to_fix.json");
