const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'giants');

const testImages = [
  'rain-queen.jpg',
  'ban-zhao.jpg',
  'hildegard-of-bingen.jpg',
  'kalidasa.jpg',
  'aung-san.jpg',
  'diego-rivera.jpg',
  'abbas-the-great.jpg',
  'ambroise-pare.jpg'
];

console.log('================================================================');
console.log('=== AUTOMATED OCR SCAN TEST (TESSERACT.JS) ===');
console.log('================================================================\n');

async function runOcrScan() {
  const worker = await createWorker('eng');

  for (const imgName of testImages) {
    const imgPath = path.join(targetDir, imgName);
    if (fs.existsSync(imgPath)) {
      const ret = await worker.recognize(imgPath);
      const text = ret.data.text.trim().replace(/\s+/g, ' ');
      const hasText = text.length > 3;

      console.log(`[${imgName}] OCR Result: "${text}"`);
      console.log(`  - Text Detected: ${hasText ? '🔴 YES (Writing/Text found!)' : '✅ NO (Clean image)'}\n`);
    }
  }

  await worker.terminate();
}

runOcrScan().catch(console.error);
