const fs = require('fs');
const path = require('path');

const giantsTsPath = path.resolve('src/data/giants.ts');
if (!fs.existsSync(giantsTsPath)) {
  console.error('giants.ts not found!');
  process.exit(1);
}

const content = fs.readFileSync(giantsTsPath, 'utf8');

// Use String split to count occurrences
const slugCount = content.split(/slug:\s*/).length - 1;
const imageUrlCount = content.split(/imageUrl:\s*/).length - 1;

console.log(`Raw count in giants.ts:`);
console.log(`- 'slug:' occurrences: ${slugCount}`);
console.log(`- 'imageUrl:' occurrences: ${imageUrlCount}`);

// Let's parse JSON-like objects safely
// We can find all matches of slug: "..." and imageUrl: "..." independently and zip them if they align.
const slugs = [];
const slugMatches = [...content.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
slugMatches.forEach(m => slugs.push(m[1]));

const images = [];
const imageMatches = [...content.matchAll(/imageUrl:\s*['"]([^'"]+)['"]/g)];
imageMatches.forEach(m => images.push(m[1]));

console.log(`Independent counts:`);
console.log(`- Extracted slugs: ${slugs.length}`);
console.log(`- Extracted imageUrls: ${images.length}`);

// If they are equal, zip them. If not, investigate.
const giants = [];
for (let i = 0; i < Math.min(slugs.length, images.length); i++) {
  giants.push({
    slug: slugs[i],
    imageUrl: images[i]
  });
}

let existingCount = 0;
let missingCount = 0;
const missingList = [];
const existingList = [];

giants.forEach(g => {
  const relPath = g.imageUrl.startsWith('/') ? g.imageUrl.substring(1) : g.imageUrl;
  const absPath = path.resolve('public', relPath);
  
  if (fs.existsSync(absPath)) {
    existingCount++;
    existingList.push(g);
  } else {
    missingCount++;
    missingList.push(g);
  }
});

console.log(`\nIllustration Statistics (Zipped):`);
console.log(`- Total Giants: ${giants.length}`);
console.log(`- Existing Illustrations: ${existingCount} (${((existingCount/giants.length)*100).toFixed(1)}%)`);
console.log(`- Missing Illustrations: ${missingCount} (${((missingCount/giants.length)*100).toFixed(1)}%)`);
