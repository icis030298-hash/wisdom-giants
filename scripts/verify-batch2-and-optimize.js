const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { validateImageText, closeOcrWorker } = require('./ocr-gate');

const brainDir = path.join('C:', 'Users', 'natey', '.gemini', 'antigravity', 'brain', 'c0d2e87f-fbf0-44fa-9605-8ed9e74015c5');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const batch2Mappings = [
  { prefix: 'batch2_aaron_copland_', slug: 'aaron-copland' },
  { prefix: 'batch2_aeschylus_v2_', slug: 'aeschylus' },
  { prefix: 'batch2_ahmad_sanjar_v2_', slug: 'ahmad-sanjar' },
  { prefix: 'batch2_al_zahrawi_', slug: 'al-zahrawi' },
  { prefix: 'batch2_albert_camus_v2_', slug: 'albert-camus' },
  { prefix: 'batch2_alessandro_volta_v3_', slug: 'alessandro-volta' },
  { prefix: 'batch2_alexander_calder_', slug: 'alexander-calder' },
  { prefix: 'batch2_alexandre_dumas_', slug: 'alexandre-dumas' },
  { prefix: 'batch2_alfred_adler_', slug: 'alfred-adler' },
  { prefix: 'batch2_alfred_hitchcock_', slug: 'alfred-hitchcock' }
];

console.log('================================================================');
console.log('=== BATCH 2 (FINAL RE-CHECK) AUTOMATED OCR GATE SCAN & WEBP OPTIMIZATION ===');
console.log('================================================================\n');

async function processBatch2() {
  const files = fs.readdirSync(brainDir);

  for (const mapping of batch2Mappings) {
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

processBatch2().catch(console.error);
