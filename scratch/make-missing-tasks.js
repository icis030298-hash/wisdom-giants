const fs = require('fs');
const path = require('path');

const giantsFile = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsContent = fs.readFileSync(giantsFile, 'utf8');

let jsContent = giantsContent
  .replace(/export interface \w+ \{[^}]*\}/g, '')
  .replace(/export interface Giant \{[^}]*\}/g, '')
  .replace(/export const giantsData:\s*Giant\[\]\s*=/, 'const giantsData =')
  .replace(/export\s+/g, '');

jsContent += '\nmodule.exports = { giantsData };';

const tempJsFile = path.join(__dirname, 'temp_giants.js');
fs.writeFileSync(tempJsFile, jsContent, 'utf8');

const { giantsData } = require(tempJsFile);
fs.unlinkSync(tempJsFile);

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'giants');
const existingImages = new Set(fs.readdirSync(imagesDir));

const missingImages = [];

giantsData.forEach(giant => {
  const imgUrl = giant.imageUrl;
  const imgFileName = path.basename(imgUrl);
  const exists = existingImages.has(imgFileName);
  
  if (!exists) {
    missingImages.push({
      name: giant.name,
      slug: giant.slug,
      category: giant.category
    });
  }
});

const outputPath = path.join(__dirname, 'missing-images.json');
fs.writeFileSync(outputPath, JSON.stringify(missingImages, null, 2), 'utf8');
console.log(`Saved ${missingImages.length} missing tasks to ${outputPath}`);
