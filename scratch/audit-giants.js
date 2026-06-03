const fs = require('fs');
const path = require('path');

const giantsPath = path.join(__dirname, '../src/data/giants.ts');
const narrativesPath = path.join(__dirname, '../src/data/final-narratives.json');
const imgDir = path.join(__dirname, '../public/images/giants');

const giantsContent = fs.readFileSync(giantsPath, 'utf8');

// Extract slugs from giants.ts
const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
let match;
const slugs = [];
while ((match = slugRegex.exec(giantsContent)) !== null) {
  slugs.push(match[1]);
}

console.log(`Total giants found in giants.ts: ${slugs.length}`);

// Check narratives
let narratives = {};
try {
  narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));
} catch (e) {
  console.log('Error reading final-narratives.json', e.message);
}

const missingNarratives = [];
const missingImages = [];

for (const slug of slugs) {
  // Check narrative
  if (!narratives[slug] || !narratives[slug].epic) {
    missingNarratives.push(slug);
  } else {
    // Check if epic has ko, en at least
    const epic = narratives[slug].epic;
    if (!epic.ko || epic.ko.length === 0 || !epic.en || epic.en.length === 0) {
      missingNarratives.push(slug);
    }
  }

  // Check image
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
