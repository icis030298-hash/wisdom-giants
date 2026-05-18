const fs = require('fs');
const path = require('path');

const ko = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/ko.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../messages/en.json'), 'utf8'));

console.log("=== Korean Stats Messages ===");
console.log(JSON.stringify(ko.Stats, null, 2));

console.log("\n=== English Stats Messages ===");
console.log(JSON.stringify(en.Stats, null, 2));
