const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images/giants');
const progressPath = path.join(__dirname, 'image-generation-progress.json');

if (!fs.existsSync(imagesDir)) {
  console.error("images directory not found");
  process.exit(1);
}

const files = fs.readdirSync(imagesDir);
const completedSlugs = [];

files.forEach(file => {
  if (file.endsWith('.jpg') || file.endsWith('.png')) {
    // Extract slug (name without extension)
    const slug = path.parse(file).name;
    completedSlugs.push(slug);
  }
});

fs.writeFileSync(progressPath, JSON.stringify(completedSlugs, null, 2), 'utf8');
console.log(`Updated image-generation-progress.json with ${completedSlugs.length} completed slugs.`);
