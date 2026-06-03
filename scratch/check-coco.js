const fs = require('fs');
const path = require('path');

const locales = ['en', 'ko', 'ja', 'de', 'es', 'fr', 'it', 'pt'];
const folder = path.join(__dirname, '..', 'messages');

for (const loc of locales) {
  const file = path.join(folder, `${loc}.json`);
  if (!fs.existsSync(file)) {
    console.log(`${loc}.json: missing file`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const hasCoco = !!data.Giants['coco-chanel'];
  console.log(`${loc}.json: has coco-chanel? ${hasCoco}`);
  if (hasCoco) {
    console.log(`  name: "${data.Giants['coco-chanel'].name}"`);
    console.log(`  headline: "${data.Giants['coco-chanel'].headline}"`);
  }
}
