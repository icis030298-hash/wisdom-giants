const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/narratives/agatha-christie.json', 'utf8'));
console.log('agatha-christie.json 전체 키:');
console.log(Object.keys(data));
