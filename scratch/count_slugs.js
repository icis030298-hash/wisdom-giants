const fs = require('fs');
const path = require('path');

const tsFile = path.resolve(process.cwd(), "src/data/giants.ts");
const content = fs.readFileSync(tsFile, "utf8");
const blocks = content.split(/{\s*id:\s*/).slice(1);
const slugs = blocks.map(b => {
  const match = b.match(/slug:\s*['"]([^'"]+)['"]/);
  return match ? match[1] : null;
}).filter(Boolean);

console.log('Total Slugs in giants.ts:', slugs.length);
console.log(JSON.stringify(slugs, null, 2));
