const fs = require('fs');
const path = require('path');

const giantsPath = path.join(__dirname, '../src/data/giants.ts');
const narrativesPath = path.join(__dirname, '../src/data/final-narratives.json');
const imgDir = path.join(__dirname, '../public/images/giants');

const giantsContent = fs.readFileSync(giantsPath, 'utf8');

const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
let match;
const slugs = [];
while ((match = slugRegex.exec(giantsContent)) !== null) {
  slugs.push(match[1]);
}

let narratives = {};
try {
  narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
} catch (e) {
  console.log('Error reading JSON', e.message);
}

const missingNarratives = [];
const missingImages = [];

for (const slug of slugs) {
  if (!narratives[slug] || !narratives[slug].epic_ko || !narratives[slug].epic_en) {
    missingNarratives.push(slug);
  }

  const imgJpg = path.join(imgDir, `${slug}.jpg`);
  const imgPng = path.join(imgDir, `${slug}.png`);
  const imgWebp = path.join(imgDir, `${slug}.webp`);
  
  if (!fs.existsSync(imgJpg) && !fs.existsSync(imgPng) && !fs.existsSync(imgWebp)) {
    missingImages.push(slug);
  }
}

console.log(`\nMissing Narratives (${missingNarratives.length}):`);
console.log(missingNarratives.join(', '));

console.log(`\nMissing Images (${missingImages.length}):`);
console.log(missingImages.join(', '));
