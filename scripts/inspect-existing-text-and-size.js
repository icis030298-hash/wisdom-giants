const fs = require('fs');
const path = require('path');

const giantsImgDir = path.join(__dirname, '..', 'public', 'images', 'giants');
const files = fs.readdirSync(giantsImgDir);

console.log('================================================================');
console.log('=== EXISTING 493 GIANTS IMAGE FILE SIZE & SPEC AUDIT ===');
console.log('================================================================\n');

let totalBytes = 0;
let fileCount = 0;
let minSize = Infinity;
let maxSize = 0;

files.forEach(f => {
  if (/\.(jpg|jpeg|png)$/i.test(f)) {
    const stat = fs.statSync(path.join(giantsImgDir, f));
    totalBytes += stat.size;
    fileCount++;
    if (stat.size < minSize) minSize = stat.size;
    if (stat.size > maxSize) maxSize = stat.size;
  }
});

const avgKb = (totalBytes / fileCount / 1024).toFixed(1);
const minKb = (minSize / 1024).toFixed(1);
const maxKb = (maxSize / 1024).toFixed(1);

console.log(`Total image files audited: ${fileCount}`);
console.log(`Average File Size: ${avgKb} KB`);
console.log(`Min File Size: ${minKb} KB | Max File Size: ${maxKb} KB`);
console.log(`Total Directory Size: ${(totalBytes / (1024 * 1024)).toFixed(1)} MB`);
