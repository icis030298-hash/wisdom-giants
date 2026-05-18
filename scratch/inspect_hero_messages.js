const fs = require('fs');
const path = require('path');

const ko = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/ko.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/en.json'), 'utf8'));

console.log("=== Korean Hero Messages ===");
console.log(JSON.stringify(ko.Hero, null, 2));

console.log("\n=== English Hero Messages ===");
console.log(JSON.stringify(en.Hero, null, 2));
