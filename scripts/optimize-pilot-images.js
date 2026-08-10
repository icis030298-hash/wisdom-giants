const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const brainDir = path.join('C:', 'Users', 'natey', '.gemini', 'antigravity', 'brain', 'c0d2e87f-fbf0-44fa-9605-8ed9e74015c5');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const pilotMappings = [
  { prefix: 'pilot_rain_queen_', slug: 'rain-queen' },
  { prefix: 'pilot_ban_zhao_', slug: 'ban-zhao' },
  { prefix: 'pilot_hildegard_of_bingen_', slug: 'hildegard-of-bingen' },
  { prefix: 'pilot_kalidasa_', slug: 'kalidasa' },
  { prefix: 'pilot_aung_san_', slug: 'aung-san' },
  { prefix: 'pilot_diego_rivera_', slug: 'diego-rivera' },
  { prefix: 'pilot_abbas_the_great_', slug: 'abbas-the-great' },
  { prefix: 'pilot_ambroise_pare_notext_', slug: 'ambroise-pare' }
];

console.log('================================================================');
console.log('=== RE-OPTIMIZING PILOT IMAGES (WEBP & JPG < 150 KB) ===');
console.log('================================================================\n');

const files = fs.readdirSync(brainDir);

async function optimizeImages() {
  for (const mapping of pilotMappings) {
    const found = files.find(f => f.startsWith(mapping.prefix) && f.endsWith('.jpg'));
    if (found) {
      const srcPath = path.join(brainDir, found);
      const origSize = fs.statSync(srcPath).size;

      const webpPath = path.join(targetDir, `${mapping.slug}.webp`);
      const jpgPath = path.join(targetDir, `${mapping.slug}.jpg`);

      // Convert to WebP (quality 80)
      const webpBuffer = await sharp(srcPath).webp({ quality: 80 }).toBuffer();
      fs.writeFileSync(webpPath, webpBuffer);

      // Compress JPG (quality 75)
      const jpgBuffer = await sharp(srcPath).jpeg({ quality: 75, progressive: true }).toBuffer();
      fs.writeFileSync(jpgPath, jpgBuffer);

      console.log(`[${mapping.slug}]`);
      console.log(`  - Source Raw: ${(origSize / 1024).toFixed(1)} KB`);
      console.log(`  - Optimized JPG (q75): ${(jpgBuffer.length / 1024).toFixed(1)} KB (Reduced by ${((1 - jpgBuffer.length / origSize) * 100).toFixed(1)}%)`);
      console.log(`  - WebP Format (q80): ${(webpBuffer.length / 1024).toFixed(1)} KB (Reduced by ${((1 - webpBuffer.length / origSize) * 100).toFixed(1)}%)\n`);
    }
  }
}

optimizeImages();
