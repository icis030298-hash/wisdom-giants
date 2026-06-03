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

const tempJsFile = path.join(__dirname, 'temp_giants_detail.js');
fs.writeFileSync(tempJsFile, jsContent, 'utf8');

const { giantsData } = require(tempJsFile);
fs.unlinkSync(tempJsFile);

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'giants');
const existingImages = new Set(fs.readdirSync(imagesDir));

const missing = [];
giantsData.forEach(g => {
  const imgUrl = g.imageUrl;
  const imgFileName = path.basename(imgUrl);
  const exists = existingImages.has(imgFileName);
  
  if (!exists) {
    missing.push({
      id: g.id,
      name: g.name,
      slug: g.slug,
      category: g.category,
      imageUrl: g.imageUrl,
      ext: path.extname(imgUrl)
    });
  }
});

console.log(JSON.stringify(missing, null, 2));
