const fs = require('fs');

const data = JSON.parse(fs.readFileSync('extracted_simplified.json', 'utf-8'));
const targets = JSON.parse(fs.readFileSync('retranslation-targets.json', 'utf-8'));
const narratives = JSON.parse(fs.readFileSync('../src/data/final-narratives.json', 'utf-8'));

for (let i = 0; i < data.length; i++) {
  const item = data[i];
  if (item.enText === "") {
    const narrative = narratives[item.slug];
    if (narrative && narrative.wisdom) {
      for (const w of narrative.wisdom) {
        const q_loc = w['quote_' + item.locale];
        const m_loc = w['meaning_' + item.locale];
        if (q_loc && q_loc.substring(0, 30).includes(targets[i].preview.substring(0, 10))) {
          item.enText = w.quote_en;
          break;
        }
      }
    }
  }
}

fs.writeFileSync('extracted_simplified_2.json', JSON.stringify(data, null, 2));
console.log('done2');
