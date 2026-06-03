const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '..', 'messages', 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

let count = 0;

for (const [slug, giant] of Object.entries(enData.Giants)) {
  if (typeof giant.title === 'string') {
    let original = giant.title;
    let updated = original
      .replace('성취', 'Achievement')
      .replace('지혜', 'Wisdom')
      .replace('창의', 'Creativity')
      .replace('역경', 'Adversity');
    
    if (original !== updated) {
      giant.title = updated;
      count++;
      console.log(`Updated title for ${slug}: "${original}" -> "${updated}"`);
    }
  }
}

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
console.log(`Successfully fixed ${count} titles in en.json!`);
