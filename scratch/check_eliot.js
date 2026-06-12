const fs = require('fs');
const path = require('path');
const locales = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh'];

locales.forEach(l => {
  const p = path.join(__dirname, `../messages/${l}.json`);
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    console.log(`${l}: ${data.Giants?.['george-eliot']?.name || '❌ 없음'}`);
  }
});
