const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { validateImageText, closeOcrWorker } = require('./ocr-gate');

const brainDir = path.join('C:', 'Users', 'natey', '.gemini', 'antigravity', 'brain', 'c0d2e87f-fbf0-44fa-9605-8ed9e74015c5');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const batch6Mappings = [
  { prefix: 'batch6_august_kekule_', slug: 'august-kekule' },
  { prefix: 'batch6_auguste_comte_', slug: 'auguste-comte' },
  { prefix: 'batch6_aurangzeb_v4_', slug: 'aurangzeb' },
  { prefix: 'batch6_b_f_skinner_', slug: 'b-f-skinner' },
  { prefix: 'batch6_bang_jeong_hwan_', slug: 'bang-jeong-hwan' },
  { prefix: 'batch6_bessie_coleman_', slug: 'bessie-coleman' },
  { prefix: 'batch6_bhaskara_ii_', slug: 'bhaskara-ii' },
  { prefix: 'batch6_c_s_lewis_', slug: 'c-s-lewis' },
  { prefix: 'batch6_c_v_raman_', slug: 'c-v-raman' },
  { prefix: 'batch6_cai_lun_', slug: 'cai-lun' }
];

console.log('================================================================');
console.log('=== BATCH 6 (FINAL RE-CHECK) AUTOMATED OCR GATE SCAN & WEBP OPTIMIZATION ===');
console.log('================================================================\n');

async function processBatch6() {
  const files = fs.readdirSync(brainDir);

  for (const mapping of batch6Mappings) {
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

processBatch6().catch(console.error);
