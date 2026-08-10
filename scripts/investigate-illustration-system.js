const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('=== ILLUSTRATION SYSTEM & IMAGE INFRASTRUCTURE AUDIT ===');
console.log('================================================================\n');

// 1. Check public directories for images
const publicDir = path.join(__dirname, '..', 'public');
function findImageDirs(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(findImageDirs(filePath));
    } else if (/\.(webp|png|jpg|jpeg|svg)$/i.test(file)) {
      results.push(filePath);
    }
  });
  return results;
}

const allPublicImages = findImageDirs(publicDir);
console.log(`1. Total image files found in public/ directory: ${allPublicImages.length}`);

// Group public images by directory
const imagesByFolder = {};
allPublicImages.forEach(img => {
  const relFolder = path.dirname(img).replace(publicDir, '');
  if (!imagesByFolder[relFolder]) imagesByFolder[relFolder] = 0;
  imagesByFolder[relFolder]++;
});

console.log('\nImage Distribution in public/:');
Object.keys(imagesByFolder).forEach(folder => {
  console.log(`  - public${folder}: ${imagesByFolder[folder]} images`);
});

// Sample image files in public/images/giants (if exists) or public/giants
const giantImages = allPublicImages.filter(f => f.includes('giants') || f.includes('portrait'));
console.log(`\n2. Giant specific images count: ${giantImages.length}`);
if (giantImages.length > 0) {
  console.log('Sample Giant Image Paths:');
  giantImages.slice(0, 5).forEach(img => console.log('  -', img.replace(publicDir, '')));
}

// 3. Search for image generation scripts or prompt templates in scratch/ or scripts/
console.log('\n3. Searching for existing image generation scripts in scratch/:');
const scratchDir = path.join(__dirname, '..', 'scratch');
if (fs.existsSync(scratchDir)) {
  const scratchFiles = fs.readdirSync(scratchDir).filter(f => f.includes('image') || f.includes('img') || f.includes('generate'));
  console.log('Matching scratch scripts:', scratchFiles);
  scratchFiles.forEach(f => {
    const fullPath = path.join(scratchDir, f);
    if (fs.statSync(fullPath).isFile()) {
      const code = fs.readFileSync(fullPath, 'utf8');
      console.log(`\n--- Snippet from scratch/${f} (first 30 lines) ---`);
      console.log(code.split('\n').slice(0, 30).join('\n'));
    }
  });
}

// 4. Check how giants.ts references images
const giantsPath = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
if (fs.existsSync(giantsPath)) {
  const code = fs.readFileSync(giantsPath, 'utf8');
  console.log('\n4. Image property check in giants.ts:');
  const imagePropMatches = code.match(/image:\s*['"]([^'"]+)['"]/g) || [];
  console.log(`Total image properties found in giants.ts: ${imagePropMatches.length}`);
  if (imagePropMatches.length > 0) {
    console.log('Sample image references in giants.ts:', imagePropMatches.slice(0, 5));
  }
}
