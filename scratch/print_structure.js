const fs = require('fs');
const path = require('path');

const livingKeys = ['elon-musk', 'oprah-winfrey', 'jk-rowling', 'malala-yousafzai', 'rigoberta-menchu'];

function printStructure(relPath) {
  const fullPath = path.join(__dirname, '../', relPath);
  if (!fs.existsSync(fullPath)) return;
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  console.log(`\n=== Keys in ${relPath} ===`);
  livingKeys.forEach(key => {
    if (data[key] !== undefined) {
      console.log(`- ${key} exists at root`);
    } else {
      // search recursively or check nested keys
      const foundPaths = [];
      function search(obj, currentPath = '') {
        if (!obj || typeof obj !== 'object') return;
        for (const k in obj) {
          const nextPath = currentPath ? `${currentPath}.${k}` : k;
          if (k === key) {
            foundPaths.push(nextPath);
          } else {
            search(obj[k], nextPath);
          }
        }
      }
      search(data);
      if (foundPaths.length > 0) {
        console.log(`- ${key} exists at paths:`, foundPaths);
      }
    }
  });
}

printStructure('src/data/final-narratives.json');
printStructure('messages/ko.json');
printStructure('messages/en.json');
printStructure('extracted_ko.json');
