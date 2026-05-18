const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log("All keys in final-narratives.json:", Object.keys(data));
console.log("Count:", Object.keys(data).length);
