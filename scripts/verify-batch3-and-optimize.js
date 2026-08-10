const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { validateImageText, closeOcrWorker } = require('./ocr-gate');

const brainDir = path.join('C:', 'Users', 'natey', '.gemini', 'antigravity', 'brain', 'c0d2e87f-fbf0-44fa-9605-8ed9e74015c5');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const batch3Mappings = [
  { prefix: 'batch3_alfred_nobel_', slug: 'alfred-nobel' },
  { prefix: 'batch3_alfred_russel_wallace_', slug: 'alfred-russel-wallace' },
  { prefix: 'batch3_alhazen_ibn_al_haytham_', slug: 'alhazen-ibn-al-haytham' },
  { prefix: 'batch3_ali_ibn_abi_talib_', slug: 'ali-ibn-abi-talib' },
  { prefix: 'batch3_alonso_de_ercilla_', slug: 'alonso-de-ercilla' },
  { prefix: 'batch3_alphonse_daudet_', slug: 'alphonse-daudet' },
  { prefix: 'batch3_alvar_aalto_', slug: 'alvar-aalto' },
  { prefix: 'batch3_ambrose_bierce_', slug: 'ambrose-bierce' }
];

console.log('================================================================');
console.log('=== BATCH 3 AUTOMATED OCR GATE SCAN & WEBP OPTIMIZATION ===');
console.log('================================================================\n');

async function processBatch3() {
  const files = fs.readdirSync(brainDir);

  for (const mapping of batch3Mappings) {
    const found = files.find(f => f.startsWith(mapping.prefix) && f.endsWith('.jpg'));
    if (found) {
      const srcPath = path.join(brainDir, found);
      const res = await validateImageText(srcPath);

      const webpPath = path.join(targetDir, `${mapping.slug}.webp`);
      const jpgPath = path.join(targetDir, `${mapping.slug}.jpg`);

      const webpBuffer = await sharp(srcPath).webp({ quality: 80 }).toBuffer();
      const jpgBuffer = await sharp(srcPath).jpeg({ quality: 75, progressive: true }).toBuffer();

      fs.writeFileSync(webpPath, webpBuffer);
      fs.writeFileSync(jpgPath, jpgBuffer);

      console.log(`[${mapping.slug}]`);
      console.log(`  - OCR Gate Status: ${res.clean ? '✅ PASS (100% Clean Image, No Text)' : '🔴 FAIL (Embedded text detected)'}`);
      if (!res.clean) console.log(`  -> Words detected: "${res.text}"`);
      console.log(`  - Optimized JPG Size: ${(jpgBuffer.length / 1024).toFixed(1)} KB`);
      console.log(`  - WebP Format Size: ${(webpBuffer.length / 1024).toFixed(1)} KB\n`);
    }
  }

  await closeOcrWorker();
}

processBatch3().catch(console.error);
