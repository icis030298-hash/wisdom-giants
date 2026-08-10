const fs = require('fs');
const path = require('path');

function getJpgDimensions(buffer) {
  let i = 4;
  while (i < buffer.length) {
    while (buffer[i] !== 0xFF) i++;
    if (buffer[i + 1] === 0xC0 || buffer[i + 1] === 0xC2) {
      const height = buffer.readUInt16BE(i + 5);
      const width = buffer.readUInt16BE(i + 7);
      return { width, height };
    }
    i += 2 + buffer.readUInt16BE(i + 2);
  }
  return null;
}

const imgDir = path.join(__dirname, '..', 'public', 'images', 'giants');
const samples = ['king-sejong.jpg', 'napoleon.jpg', 'genghis-khan.jpg', 'alexander-the-great.jpg', 'ada-lovelace.jpg'];

console.log('================================================================');
console.log('=== IMAGE DIMENSIONS & ASPECT RATIO INSPECTION ===');
console.log('================================================================\n');

samples.forEach(file => {
  const filePath = path.join(imgDir, file);
  if (fs.existsSync(filePath)) {
    const buffer = fs.readFileSync(filePath);
    const dim = getJpgDimensions(buffer);
    if (dim) {
      console.log(`[${file}] Dimensions: ${dim.width} x ${dim.height} px (Aspect ratio: ${(dim.width / dim.height).toFixed(2)})`);
    } else {
      console.log(`[${file}] Could not parse JPG header`);
    }
  }
});
