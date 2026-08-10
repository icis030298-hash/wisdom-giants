const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('=== GIANTS ILLUSTRATION IMAGE AUDIT ===');
console.log('================================================================\n');

const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const giantsImgDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const existingImgFiles = fs.readdirSync(giantsImgDir).map(f => f.toLowerCase());
console.log(`1. Total image files in public/images/giants/: ${existingImgFiles.length}`);

// Read giantsData from giants.ts
const code = fs.readFileSync(giantsPath, 'utf8');
const slugMatches = code.match(/slug:\s*['"]([^'"]+)['"]/g) || [];
const allSlugs = slugMatches.map(m => m.replace(/slug:\s*['"]([^'"]+)['"]/, '$1'));

console.log(`2. Total registered giants in giants.ts: ${allSlugs.length}`);

let hasImageCount = 0;
let missingImageSlugs = [];

allSlugs.forEach(slug => {
  const jpgFile = `${slug}.jpg`.toLowerCase();
  const pngFile = `${slug}.png`.toLowerCase();
  const webpFile = `${slug}.webp`.toLowerCase();

  // Also check special mappings like napoleon -> napoleon.jpg or king-sejong -> king-sejong.jpg
  if (existingImgFiles.includes(jpgFile) || existingImgFiles.includes(pngFile) || existingImgFiles.includes(webpFile)) {
    hasImageCount++;
  } else {
    // Check if slug contains partial match in existing files
    const foundMatch = existingImgFiles.find(f => f.includes(slug.toLowerCase()));
    if (foundMatch) {
      hasImageCount++;
    } else {
      missingImageSlugs.push(slug);
    }
  }
});

console.log(`\n3. Illustration Status Breakdown:`);
console.log(`   - Giants WITH existing images in public/images/giants/: ${hasImageCount} / ${allSlugs.length}`);
console.log(`   - Giants MISSING images in public/images/giants/: ${missingImageSlugs.length} / ${allSlugs.length}`);

if (missingImageSlugs.length > 0) {
  console.log(`\nSample Missing Giant Slugs (First 15):`);
  missingImageSlugs.slice(0, 15).forEach(s => console.log('  -', s));
}
