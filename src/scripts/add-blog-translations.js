const fs = require('fs');
const path = require('path');

const locales = {
  ko: "블로그",
  en: "Blog",
  de: "Blog",
  ja: "ブログ",
  es: "Blog",
  fr: "Blog",
  it: "Blog",
  pt: "Blog"
};

const messagesDir = path.join(__dirname, '..', '..', 'messages');

Object.entries(locales).forEach(([locale, translation]) => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (data.Navigation) {
        data.Navigation.blog = translation;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✓ Added blog translation to ${locale}.json: "${translation}"`);
      } else {
        console.error(`Error: Navigation namespace not found in ${locale}.json`);
      }
    } catch (e) {
      console.error(`Error parsing JSON in ${filePath}:`, e.message);
    }
  } else {
    console.error(`Error: File ${filePath} not found`);
  }
});
