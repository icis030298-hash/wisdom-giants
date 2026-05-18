const fs = require('fs');
const path = require('path');

const giantsFilePath = path.join(__dirname, '../src/data/giants.ts');
const fileContent = fs.readFileSync(giantsFilePath, 'utf8');

// A crude parser for giants list
const matches = [];
const regex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)",[\s\S]*?slug:\s*"([^"]+)",[\s\S]*?era:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(fileContent)) !== null) {
  matches.push({
    id: match[1],
    name: match[2],
    slug: match[3],
    era: match[4]
  });
}

console.log("Parsed giants using simple regex:", matches.length);
if (matches.length === 0) {
  // Let's do a looser matching
  const nameRegex = /name:\s*"([^"]+)"/g;
  let nMatch;
  while ((nMatch = nameRegex.exec(fileContent)) !== null) {
    console.log(nMatch[1]);
  }
} else {
  matches.forEach(g => {
    console.log(`${g.id}: ${g.name} (${g.slug}) - ${g.era}`);
  });
}
