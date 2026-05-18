const fs = require('fs');
const path = require('path');

const giantsTsPath = path.join(__dirname, '../src/data/giants.ts');
const giantsContent = fs.readFileSync(giantsTsPath, 'utf8');

// Let's find all occurrences of name: "..." or similar
const nameRegex = /name:\s*["']([^"']+)["']/g;
let match;
const names = [];
while ((match = nameRegex.exec(giantsContent)) !== null) {
  names.push(match[1]);
}

console.log("All giant names in giants.ts:", names);
console.log("Count:", names.length);
