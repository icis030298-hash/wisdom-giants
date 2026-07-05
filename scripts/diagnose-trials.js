const fs = require('fs');
const path = require('path');

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));

let emptyTrialsKo = 0;
let emptyTrialsEn = 0;
let emptyOvercomingKo = 0;
let emptyOvercomingEn = 0;

const emptySlugs = [];

for (const slug in data) {
  const g = data[slug];
  const tKo = !g.trials_ko || g.trials_ko.trim() === '';
  const tEn = !g.trials_en || g.trials_en.trim() === '';
  const oKo = !g.overcoming_ko || g.overcoming_ko.trim() === '';
  const oEn = !g.overcoming_en || g.overcoming_en.trim() === '';

  if (tKo) emptyTrialsKo++;
  if (tEn) emptyTrialsEn++;
  if (oKo) emptyOvercomingKo++;
  if (oEn) emptyOvercomingEn++;

  if (tKo || tEn || oKo || oEn) {
    emptySlugs.push(slug);
  }
}

console.log("Empty trials_ko:", emptyTrialsKo);
console.log("Empty trials_en:", emptyTrialsEn);
console.log("Empty overcoming_ko:", emptyOvercomingKo);
console.log("Empty overcoming_en:", emptyOvercomingEn);
console.log("Giants with empty trials/overcoming:", emptySlugs.length);
console.log("Sample slugs:", emptySlugs.slice(0, 10));
