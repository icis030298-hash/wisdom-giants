import fs from 'fs';
import path from 'path';

const content = fs.readFileSync(path.resolve('src/data/giants.ts'), 'utf8');

const giantRegex = /{\s*id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*['"]([^'"]+)['"][\s\S]*?slug:\s*['"]([^'"]+)['"][\s\S]*?dnaCode:\s*['"]([^'"]+)['"]/g;
let match;
const result = [];

while ((match = giantRegex.exec(content)) !== null) {
  result.push({
    id: match[1],
    name: match[2],
    slug: match[3],
    mbti: match[4]
  });
}

fs.writeFileSync('scratch/mbti-list.json', JSON.stringify(result, null, 2));
console.log(`Extracted ${result.length} giants.`);
