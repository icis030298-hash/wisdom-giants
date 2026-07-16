const fs = require('fs');
const path = require('path');

const giantsContent = fs.readFileSync('src/data/giants.ts', 'utf8');
const slugs = [];
const regex = /slug:\s*["']([^"']+)["']/g;
let match;
while ((match = regex.exec(giantsContent)) !== null) {
    slugs.push(match[1]);
}

const missing = [];
for (const slug of slugs) {
    const imgPath = path.join('public', 'images', 'giants', slug + '.jpg');
    const pngPath = path.join('public', 'images', 'giants', slug + '.png');
    if (!fs.existsSync(imgPath) && !fs.existsSync(pngPath)) {
        missing.push(slug);
    }
}

console.log('Total missing:', missing.length);
console.log('First 5 missing:', missing.slice(0, 5));
