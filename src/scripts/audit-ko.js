const fs = require('fs');
const path = require('path');

const koJsonPath = path.join(__dirname, '../../messages/ko.json');
const koJson = fs.readFileSync(koJsonPath, 'utf8');

const lines = koJson.split('\n');
const queries = [/테스트/, /시작/, /위인/, /거인/];

lines.forEach((line, index) => {
  queries.forEach(query => {
    if (query.test(line)) {
      console.log(`[ko.json] Line ${index + 1}: ${line.trim()}`);
    }
  });
});
