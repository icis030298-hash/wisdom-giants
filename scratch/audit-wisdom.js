const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const missingWisdom = [];

for (const [slug, data] of Object.entries(narratives)) {
  if (!data.wisdom || data.wisdom.length === 0) {
    missingWisdom.push(slug);
  }
}

console.log('Total giants in final-narratives:', Object.keys(narratives).length);
console.log('Giants missing wisdom in final-narratives:', missingWisdom.length);
console.log('List of giants missing wisdom:', missingWisdom);
