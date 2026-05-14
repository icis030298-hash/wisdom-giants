const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/narratives.json', 'utf8'));
Object.keys(data).forEach(k => console.log(k));
