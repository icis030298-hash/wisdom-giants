const fs = require('fs');
const path = require('path');

const GIANTS_PATH = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const content = fs.readFileSync(GIANTS_PATH, 'utf8');

const regex = /slug:\s*["']([^"']+)["']/g;
let match;
const slugs = [];
while ((match = regex.exec(content)) !== null) {
  slugs.push(match[1]);
}

console.log(JSON.stringify(slugs));
