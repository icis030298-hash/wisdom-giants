const fs = require('fs');
const path = 'c:/Users/user/OneDrive/바탕 화면/wisdom-giants-20260512T091146Z-3-001/wisdom-giants/src/data/giants.ts';
const content = fs.readFileSync(path, 'utf8');

// Match objects in the array
const regex = /\{\s*id:\s*"(\d+)",[\s\S]*?name:\s*"([^"]+)",[\s\S]*?slug:\s*"([^"]+)"/g;
const giants = [];
let match;

while ((match = regex.exec(content)) !== null) {
  giants.push({
    id: parseInt(match[1]),
    name: match[2],
    slug: match[3]
  });
}

console.log(JSON.stringify(giants, null, 2));
