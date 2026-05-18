const fs = require('fs');
const path = require('path');

const ko = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/ko.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/en.json'), 'utf8'));

console.log("=== Korean About Messages ===");
console.log(JSON.stringify(ko.About, null, 2));

console.log("\n=== English About Messages ===");
console.log(JSON.stringify(en.About, null, 2));
