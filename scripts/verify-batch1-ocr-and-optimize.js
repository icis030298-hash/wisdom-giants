const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createWorker } = require('tesseract.js');

const brainDir = path.join('C:', 'Users', 'natey', '.gemini', 'antigravity', 'brain', 'c0d2e87f-fbf0-44fa-9605-8ed9e74015c5');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const batch1Mappings = [
  { prefix: 'pilot_ban_zhao_v3_', slug: 'ban-zhao' },
  { prefix: 'pilot_hildegard_of_bingen_v2_', slug: 'hildegard-of-bingen' },
  { prefix: 'pilot_kalidasa_v3_', slug: 'kalidasa' },
  { prefix: 'pilot_aung_san_v3_', slug: 'aung-san' }
];

console.log('================================================================');
console.log('=== BATCH 1 (V3) OCR SCAN & WEBP OPTIMIZATION ===');
console.log('================================================================\n');

async function processBatch1() {
  const worker = await createWorker(['eng', 'chi_sim']);
  const files = fs.readdirSync(brainDir);

  for (const mapping of batch1Mappings) {
    const found = files.find(f => f.startsWith(mapping.prefix) && f.endsWith('.jpg'));
    if (found) {
      const srcPath = path.join(brainDir, found);
      const origSize = fs.statSync(srcPath).size;

      // 1. Run Tesseract OCR scan
      const ocrResult = await worker.recognize(srcPath);
      const text = ocrResult.data.text.trim().replace(/\s+/g, ' ');
      const cleanLetters = text.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
      const hasText = cleanLetters.length >= 3;

      // 2. Generate WebP and compressed JPG
      const webpPath = path.join(targetDir, `${mapping.slug}.webp`);
      const jpgPath = path.join(targetDir, `${mapping.slug}.jpg`);

      const webpBuffer = await sharp(srcPath).webp({ quality: 80 }).toBuffer();
      const jpgBuffer = await sharp(srcPath).jpeg({ quality: 75, progressive: true }).toBuffer();

      fs.writeFileSync(webpPath, webpBuffer);
      fs.writeFileSync(jpgPath, jpgBuffer);

      console.log(`[${mapping.slug}]`);
      console.log(`  - OCR Detected Text: "${text}"`);
      console.log(`  - Text Gate Status: ${hasText ? '🔴 FAIL (Text detected)' : '✅ PASS (100% Clean Image)'}`);
      console.log(`  - Optimized JPG Size: ${(jpgBuffer.length / 1024).toFixed(1)} KB`);
      console.log(`  - WebP Format Size: ${(webpBuffer.length / 1024).toFixed(1)} KB\n`);
    } else {
      console.log(`[NOT FOUND] ${mapping.prefix}`);
    }
  }

  await worker.terminate();
}

processBatch1().catch(console.error);
