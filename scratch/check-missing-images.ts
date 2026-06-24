import fs from 'fs';
import path from 'path';

const giantsFile = fs.readFileSync(path.resolve('src/data/giants.ts'), 'utf8');
const slugs = [...giantsFile.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

const imagesDir = path.resolve('public/images/giants');
const missingSlugs = [];

for (const slug of slugs) {
  if (!fs.existsSync(path.join(imagesDir, `${slug}.png`)) && !fs.existsSync(path.join(imagesDir, `${slug}.jpg`))) {
    missingSlugs.push(slug);
  }
}

console.log(missingSlugs.join(','));
