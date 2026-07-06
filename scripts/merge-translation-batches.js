const fs = require('fs');
const path = require('path');

const TARGET_LANGS = [
  'ha', 'sw', 'vi', 'id', 'nl', 'tr', 'pl', 'fa', 'el', 'uk', 'he', 'th', 'hi', 'fr'
];

function main() {
  const narrativesPath = path.join(process.cwd(), 'src/data/final-narratives.json');
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
  
  const messagesDir = path.join(process.cwd(), 'messages');
  const batchesDir = path.join(process.cwd(), 'scratch/translation_batches');

  let mergedMessagesCount = 0;
  let mergedNarrativesCount = 0;

  TARGET_LANGS.forEach(lang => {
    const langDir = path.join(batchesDir, lang);
    if (!fs.existsSync(langDir)) return;

    // Load message file
    const msgPath = path.join(messagesDir, `${lang}.json`);
    if (!fs.existsSync(msgPath)) {
      console.log(`Warning: Message file not found for ${lang}`);
      return;
    }
    const msg = JSON.parse(fs.readFileSync(msgPath, 'utf8'));
    if (!msg.Giants) msg.Giants = {};

    const files = fs.readdirSync(langDir).filter(f => f.startsWith('translated_'));

    files.forEach(file => {
      const filePath = path.join(langDir, file);
      const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      items.forEach(item => {
        const { type, slug, field, translatedText } = item;
        if (!translatedText || translatedText.trim() === '') return;

        if (type === 'message') {
          if (!msg.Giants[slug]) msg.Giants[slug] = {};
          msg.Giants[slug][field] = translatedText;
          mergedMessagesCount++;
        } else if (type === 'narrative') {
          if (!narratives[slug]) narratives[slug] = {};
          narratives[slug][`${field}_${lang}`] = translatedText;
          mergedNarrativesCount++;
        } else if (type === 'wisdom_quote' || type === 'wisdom_meaning') {
          if (!narratives[slug]) narratives[slug] = {};
          if (!narratives[slug].wisdom) narratives[slug].wisdom = [];
          
          // Parse "wisdom.0.quote" or "wisdom.0.meaning"
          const parts = field.split('.');
          const idx = parseInt(parts[1], 10);
          const subField = parts[2]; // "quote" or "meaning"

          // Ensure wisdom array elements exist up to idx
          while (narratives[slug].wisdom.length <= idx) {
            narratives[slug].wisdom.push({});
          }

          narratives[slug].wisdom[idx][`${subField}_${lang}`] = translatedText;
          mergedNarrativesCount++;
        }
      });
    });

    // Write back messages file
    fs.writeFileSync(msgPath, JSON.stringify(msg, null, 2), 'utf8');
  });

  // Write back narratives file
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');

  console.log(`Successfully merged ${mergedMessagesCount} message fields and ${mergedNarrativesCount} narrative fields.`);
}

main();
