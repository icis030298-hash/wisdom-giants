const fs = require('fs');
const path = require('path');

const jaJsonPath = path.join(__dirname, '../../messages/ja.json');
const jaJson = fs.readFileSync(jaJsonPath, 'utf8');

const lines = jaJson.split('\n');
lines.forEach((line, index) => {
  if (line.includes('yu-gwan-sun')) {
    console.log(`Found yu-gwan-sun starting at line ${index + 1}:`);
    for (let i = 0; i < 15; i++) {
      if (lines[index + i]) {
        console.log(`${index + i + 1}: ${lines[index + i]}`);
      }
    }
  }
});
