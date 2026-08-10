const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('=== SAMPLE EXISTING GIANTS IMAGE SPEC INSPECTION ===');
console.log('================================================================\n');

const imgDir = path.join(__dirname, '..', 'public', 'images', 'giants');
const samples = ['king-sejong.jpg', 'napoleon.jpg', 'genghis-khan.jpg', 'alexander-the-great.jpg', 'ada-lovelace.jpg', 'steve-jobs.jpg'];

samples.forEach(file => {
  const filePath = path.join(imgDir, file);
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    console.log(`[FILE] ${file}: ${stat.size} bytes (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    // Search for case-insensitive or alternate extensions
    const found = fs.readdirSync(imgDir).find(f => f.toLowerCase() === file.toLowerCase() || f.toLowerCase().startsWith(file.split('.')[0]));
    if (found) {
      const stat = fs.statSync(path.join(imgDir, found));
      console.log(`[FILE] ${found}: ${stat.size} bytes (${(stat.size / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`[FILE] ${file}: NOT FOUND`);
    }
  }
});

// Check extensions across all 625 image files
const files = fs.readdirSync(imgDir);
let jpgCount = 0;
let pngCount = 0;
let webpCount = 0;

files.forEach(f => {
  if (f.endsWith('.jpg') || f.endsWith('.jpeg')) jpgCount++;
  else if (f.endsWith('.png')) pngCount++;
  else if (f.endsWith('.webp')) webpCount++;
});

console.log('\n--- FORMAT DISTRIBUTION ACROSS ALL 625 IMAGES ---');
console.log(`  - JPG: ${jpgCount} (${(jpgCount / files.length * 100).toFixed(1)}%)`);
console.log(`  - PNG: ${pngCount} (${(pngCount / files.length * 100).toFixed(1)}%)`);
console.log(`  - WEBP: ${webpCount} (${(webpCount / files.length * 100).toFixed(1)}%)`);
