const fs = require('fs');
const path = require('path');

const WIKI_FILE = path.resolve('src/data/wikipedia-links.json');
const data = JSON.parse(fs.readFileSync(WIKI_FILE, 'utf8'));
const keys = Object.keys(data);
console.log("Wikipedia links keys:", keys.slice(0, 10));
console.log("Sample wikipedia link entry:", data[keys[0]]);
