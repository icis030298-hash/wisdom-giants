const fs = require('fs');

const code = fs.readFileSync('scratch/generate_500_final.js', 'utf8');

// Match objects in rawList
// e.g. { nameEn: "Seok Ga-mo-ni (Park Eun-sik)", nameKo: "박은식", ... }

const entryRegex = /{\s*nameEn:\s*["']([^"']+)["'],\s*nameKo:\s*["']([^"']+)["']/g;

let match;
const suspicious = [];

while ((match = entryRegex.exec(code)) !== null) {
  const nameEn = match[1];
  const nameKo = match[2];
  
  if (nameEn.includes('(') && nameEn.includes(')')) {
    const insideParen = nameEn.substring(nameEn.indexOf('(') + 1, nameEn.indexOf(')')).trim();
    suspicious.push({
      nameEn,
      insideParen,
      nameKo
    });
  }
}

console.log(`Total entries with parentheses in nameEn: ${suspicious.length}`);
console.log(JSON.stringify(suspicious, null, 2));
