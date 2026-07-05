const fs = require('fs');
const path = require('path');

const FACT_FILE = path.resolve('src/data/fact-layer-all.json');
const data = JSON.parse(fs.readFileSync(FACT_FILE, 'utf8'));
const keys = Object.keys(data);
console.log("Fact layer keys:", keys.slice(0, 10));
console.log("Sample fact layer entry keys:", Object.keys(data[keys[0]] || {}));
console.log("Sample fact layer entry details:", JSON.stringify((data[keys[0]] || {}), null, 2).slice(0, 400));
