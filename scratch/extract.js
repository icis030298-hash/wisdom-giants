const fs = require('fs');
const data = require('./missing-blogs-2.json');
fs.writeFileSync('./extracted.json', JSON.stringify(data.slice(6, 8), null, 2));
