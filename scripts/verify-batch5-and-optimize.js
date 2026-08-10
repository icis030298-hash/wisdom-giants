const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { validateImageText, closeOcrWorker } = require('./ocr-gate');

const brainDir = path.join('C:', 'Users', 'natey', '.gemini', 'antigravity', 'brain', 'c0d2e87f-fbf0-44fa-9605-8ed9e74015c5');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const batch5Mappings = [
  { prefix: 'batch5_antonie_van_leeuwenhoek_v2_', slug: 'antonie-van-leeuwenhoek' },
  { prefix: 'batch5_antoninus_pius_', slug: 'antoninus-pius' },
  { prefix: 'batch5_antonio_vivaldi_', slug: 'antonio-vivaldi' },
  { prefix: 'batch5_aristophanes_', slug: 'aristophanes' },
  { prefix: 'batch5_arnold_schoenberg_', slug: 'arnold-schoenberg' },
  { prefix: 'batch5_arthur_conan_doyle_', slug: 'arthur-conan-doyle' },
  { prefix: 'batch5_arthur_rimbaud_', slug: 'arthur-rimbaud' },
  { prefix: 'batch5_arthur_wellesley_', slug: 'arthur-wellesley' },
  { prefix: 'batch5_aryabhata_', slug: 'aryabhata' },
  { prefix: 'batch5_atahualpa_v2_', slug: 'atahualpa' }
];

console.log('================================================================');
console.log('=== BATCH 5 (RE-CHECK) AUTOMATED OCR GATE SCAN & WEBP OPTIMIZATION ===');
console.log('================================================================\n');

async function processBatch5() {
  const files = fs.readdirSync(brainDir);

  for (const mapping of batch5Mappings) {
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

processBatch5().catch(console.error);
