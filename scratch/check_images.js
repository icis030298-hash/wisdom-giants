const fs = require('fs');
const path = require('path');

// 1. Read and parse giants.ts to extract IDs, names, categories, slugs, and imageUrls
const giantsFile = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsContent = fs.readFileSync(giantsFile, 'utf8');

// A simple regex parser to extract slug and imageUrl from giants.ts
const giantRegex = /slug:\s*["']([^"']+)["'].*?imageUrl:\s*["']([^"']+)["']/gs;
let match;
const giants = [];

// Since JS regex with /gs holds state, we can loop through it.
// Let's do a more robust parsing or just parse the array if we can import it.
// Actually, let's write a small script that loads giants.ts by stripping typescript types or compile it on the fly.
// Let's use ts-node if available, or just evaluate it by converting it to JS.
// We can convert export interface ... export const giantsData: Giant[] = ... to module.exports = ...

let jsContent = giantsContent
  .replace(/export interface \w+ \{[^}]*\}/g, '')
  .replace(/export interface Giant \{[^}]*\}/g, '')
  .replace(/export const giantsData:\s*Giant\[\]\s*=/, 'const giantsData =')
  .replace(/export\s+/g, '');

jsContent += '\nmodule.exports = { giantsData };';

// Write a temp file and require it
const tempJsFile = path.join(__dirname, 'temp_giants.js');
fs.writeFileSync(tempJsFile, jsContent, 'utf8');

const { giantsData } = require(tempJsFile);
fs.unlinkSync(tempJsFile);

console.log(`Total giants loaded from giants.ts: ${giantsData.length}`);

// 2. Scan public/images/giants directory
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'giants');
const existingImages = new Set(fs.readdirSync(imagesDir));

const missingImages = [];
const existingMap = [];

giantsData.forEach(giant => {
  const imgUrl = giant.imageUrl;
  const imgFileName = path.basename(imgUrl);
  const exists = existingImages.has(imgFileName);
  
  if (!exists) {
    missingImages.push({
      id: giant.id,
      name: giant.name,
      slug: giant.slug,
      category: giant.category,
      imageUrl: imgUrl,
      imgFileName: imgFileName
    });
  } else {
    existingMap.push({
      name: giant.name,
      slug: giant.slug,
      imageUrl: imgUrl
    });
  }
});

console.log('\n--- Missing Images (' + missingImages.length + ') ---');
missingImages.forEach(m => {
  console.log(`ID: ${m.id} | Name: ${m.name} | Category: ${m.category} | Slug: ${m.slug} | Path: ${m.imageUrl}`);
});

console.log(`\nExisting illustrations: ${existingMap.length}`);
