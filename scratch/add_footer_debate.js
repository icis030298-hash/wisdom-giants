const fs = require('fs');
const path = require('path');

const locales = {
  ko: 'AI 토론방',
  en: 'AI Debate Room',
  de: 'AI-Debattenraum',
  ja: 'AI討論室',
  es: 'Sala de debate IA',
  fr: 'Salon de débat IA',
  it: 'Sala di dibattito IA',
  pt: 'Sala de Debate IA'
};

const messagesDir = path.join(__dirname, '..', 'messages');

for (const [locale, translation] of Object.entries(locales)) {
  const filePath = path.join(messagesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    continue;
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    if (data.Footer && data.Footer.links) {
      data.Footer.links.debate = translation;
      
      // JSON 포맷을 깨뜨리지 않고 공백 2칸 스타일로 저장
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Successfully added 'Footer.links.debate' to ${locale}.json: "${translation}"`);
    } else {
      console.log(`Could not find Footer.links in ${locale}.json`);
    }
  } catch (err) {
    console.error(`Error processing ${locale}.json:`, err);
  }
}
