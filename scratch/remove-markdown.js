const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/data/final-narratives.json');
let data = fs.readFileSync(filePath, 'utf8');

// Replace all occurrences of ** and ### with empty strings
// Or, if it's **text**, maybe just remove the **.
const initialLength = data.length;
data = data.replace(/\*\*/g, '');
data = data.replace(/###/g, '');

fs.writeFileSync(filePath, data, 'utf8');
console.log(`Removed markdown asterisks and hashes. File length changed from ${initialLength} to ${data.length}`);
