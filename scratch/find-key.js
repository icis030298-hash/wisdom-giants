const fs = require('fs');
const path = require('path');

const locales = ['en', 'ko', 'ja', 'de', 'es', 'fr', 'it', 'pt'];
const folder = path.join(__dirname, '..', 'messages');

for (const loc of locales) {
  const file = path.join(folder, `${loc}.json`);
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const hasKey = content.includes('"coco-chanel"');
  console.log(`${loc}.json: includes "coco-chanel"? ${hasKey}`);
}
