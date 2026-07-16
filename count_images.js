const fs = require('fs');
const content = fs.readFileSync('src/data/giants.ts', 'utf8');
const regex = /imageUrl:\s*["']([^"']+)["']/g;
let match;
const counts = {};
const slugsByUrl = {};

const slugRegex = /slug:\s*["']([^"']+)["']/g;
let slugMatch;
const slugs = [];
while ((slugMatch = slugRegex.exec(content)) !== null) {
    slugs.push(slugMatch[1]);
}

let i = 0;
while ((match = regex.exec(content)) !== null) {
    const url = match[1];
    counts[url] = (counts[url] || 0) + 1;
    if (!slugsByUrl[url]) slugsByUrl[url] = [];
    slugsByUrl[url].push(slugs[i]);
    i++;
}

for (const [url, count] of Object.entries(counts)) {
    if (count > 1) {
        console.log(url, count);
        console.log('First 5:', slugsByUrl[url].slice(0, 5));
    }
}
