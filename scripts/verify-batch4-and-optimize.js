const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { validateImageText, closeOcrWorker } = require('./ocr-gate');

const brainDir = path.join('C:', 'Users', 'natey', '.gemini', 'antigravity', 'brain', 'c0d2e87f-fbf0-44fa-9605-8ed9e74015c5');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const batch4Mappings = [
  { prefix: 'batch4_alice_ball_', slug: 'alice-ball' },
  { prefix: 'batch4_alice_hamilton_', slug: 'alice-hamilton' },
  { prefix: 'batch4_amedeo_avogadro_', slug: 'amedeo-avogadro' },
  { prefix: 'batch4_andre_marie_ampere_v2_', slug: 'andre-marie-ampere' },
  { prefix: 'batch4_andreas_vesalius_', slug: 'andreas-vesalius' },
  { prefix: 'batch4_andy_warhol_', slug: 'andy-warhol' },
  { prefix: 'batch4_angelina_grimke_', slug: 'angelina-grimke' },
  { prefix: 'batch4_anne_sullivan_', slug: 'anne-sullivan' },
  { prefix: 'batch4_annie_jump_cannon_', slug: 'annie-jump-cannon' },
  { prefix: 'batch4_antoni_gaudi_', slug: 'antoni-gaudi' }
];

console.log('================================================================');
console.log('=== BATCH 4 (RE-CHECK) AUTOMATED OCR GATE SCAN & WEBP OPTIMIZATION ===');
console.log('================================================================\n');

async function processBatch4() {
  const files = fs.readdirSync(brainDir);

  for (const mapping of batch4Mappings) {
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

processBatch4().catch(console.error);
