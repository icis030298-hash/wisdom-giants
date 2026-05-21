const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
const narrativesData = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const missing = [];
Object.keys(narrativesData).forEach(slug => {
  const data = narrativesData[slug];
  if (!data.epic_es || !data.era_es) {
    missing.push(slug);
  }
});

console.log(JSON.stringify(missing));
