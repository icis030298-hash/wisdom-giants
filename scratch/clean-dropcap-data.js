const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

let totalFixed = 0;

for (const [slug, data] of Object.entries(narratives)) {
  for (const key of Object.keys(data)) {
    if (key.startsWith('epic_') && typeof data[key] === 'string') {
      let original = data[key];
      let cleaned = original;
      
      // Clean leading special characters and whitespaces
      cleaned = cleaned.trim();
      
      // Strip leading markdown formatting characters (*, #, _, ~)
      cleaned = cleaned.replace(/^[\s*#_~`]+/g, '');
      
      // Remove double asterisks (markdown bold) completely as they are not parsed
      if (cleaned.includes('**')) {
        cleaned = cleaned.replace(/\*\*/g, '');
      }
      
      // Remove single asterisks if they are at the very beginning of the paragraph
      cleaned = cleaned.replace(/^[*]+/g, '');

      if (original !== cleaned) {
        data[key] = cleaned;
        totalFixed++;
        console.log(`Fixed ${slug} (${key}): "${original.slice(0, 40)}..." -> "${cleaned.slice(0, 40)}..."`);
      }
    }
  }
}

fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf8');
console.log(`\nClean-up completed. Total epic fields modified: ${totalFixed}`);
