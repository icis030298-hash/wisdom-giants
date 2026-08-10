const fs = require('fs');
const path = require('path');

const giantsImgDir = path.join(__dirname, '..', 'public', 'images', 'giants');

if (!fs.existsSync(giantsImgDir)) {
  console.log('public/images/giants directory does NOT exist!');
  process.exit(0);
}

const files = fs.readdirSync(giantsImgDir);
console.log(`================================================================`);
console.log(`=== PUBLIC/IMAGES/GIANTS AUDIT ===`);
console.log(`================================================================\n`);
console.log(`Total image files in public/images/giants/: ${files.length}\n`);

const extensionCounts = {};
files.forEach(f => {
  const ext = path.extname(f).toLowerCase();
  if (!extensionCounts[ext]) extensionCounts[ext] = 0;
  extensionCounts[ext]++;
});

console.log('Extension Breakdown:');
Object.keys(extensionCounts).forEach(ext => {
  console.log(`  - ${ext}: ${extensionCounts[ext]} files`);
});

console.log('\nSample File Basenames (First 10):');
files.slice(0, 10).forEach(f => console.log('  -', f));
