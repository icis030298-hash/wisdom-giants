const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { validateImageText, closeOcrWorker } = require('./ocr-gate');

const brainDir = path.join('C:', 'Users', 'natey', '.gemini', 'antigravity', 'brain', 'c0d2e87f-fbf0-44fa-9605-8ed9e74015c5');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const batch7Mappings = [
  { prefix: 'batch7_camille_claudel_', slug: 'camille-claudel' },
  { prefix: 'batch7_cao_cao_', slug: 'cao-cao' },
  { prefix: 'batch7_caracalla_v3_', slug: 'caracalla' },
  { prefix: 'batch7_caravaggio_', slug: 'caravaggio' },
  { prefix: 'batch7_carl_friedrich_gauss_', slug: 'carl-friedrich-gauss' },
  { prefix: 'batch7_caroline_herschel_', slug: 'caroline-herschel' },
  { prefix: 'batch7_cecilia_payne_gaposchkin_', slug: 'cecilia-payne-gaposchkin' },
  { prefix: 'batch7_ch_oe_ch_iwon_', slug: 'ch-oe-ch-iwon' },
  { prefix: 'batch7_ch_oe_muson_', slug: 'ch-oe-muson' },
  { prefix: 'batch7_chanakya_v2_', slug: 'chanakya' }
];

console.log('================================================================');
console.log('=== BATCH 7 (FINAL RE-CHECK) AUTOMATED OCR GATE SCAN & WEBP OPTIMIZATION ===');
console.log('================================================================\n');

async function processBatch7() {
  const files = fs.readdirSync(brainDir);

  for (const mapping of batch7Mappings) {
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

processBatch7().catch(console.error);
