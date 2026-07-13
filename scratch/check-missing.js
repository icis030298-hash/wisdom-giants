const fs = require('fs');

const dataPath = 'src/data/final-narratives.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const missingKo = [];

Object.entries(data).forEach(([slug, giant]) => {
  if (!giant.epic_ko || !giant.trials_ko || !giant.overcoming_ko) {
    missingKo.push(slug);
  }
});

console.log('Missing KO:', missingKo);
