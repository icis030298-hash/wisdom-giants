const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/narratives/agatha-christie.json', 'utf8'));
console.log('agatha-christie.json keys:', Object.keys(data));
console.log('agatha-christie.json wisdom:', JSON.stringify(data.wisdom, null, 2));
