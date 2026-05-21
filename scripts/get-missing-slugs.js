const fs = require('fs');
const path = require('path');

const narrativesPath = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
const narrativesData = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

const slugs = Object.keys(narrativesData);
const missing = slugs.filter(s => !narrativesData[s].epic_es);

console.log(JSON.stringify(missing));
