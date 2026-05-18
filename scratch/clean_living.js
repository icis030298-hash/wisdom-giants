const fs = require('fs');
const path = require('path');

const livingKeys = ['elon-musk', 'oprah-winfrey', 'jk-rowling', 'malala-yousafzai', 'rigoberta-menchu'];

function cleanFile(relPath, isNestedInGiants = false) {
  const filePath = path.join(__dirname, '../', relPath);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${relPath}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  let data = JSON.parse(content);
  
  let removedCount = 0;
  
  if (isNestedInGiants) {
    if (data.Giants) {
      livingKeys.forEach(key => {
        if (data.Giants[key] !== undefined) {
          delete data.Giants[key];
          removedCount++;
        }
      });
    }
  } else {
    livingKeys.forEach(key => {
      if (data[key] !== undefined) {
        delete data[key];
        removedCount++;
      }
    });
  }
  
  if (removedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Cleaned ${relPath}: removed ${removedCount} keys`);
  } else {
    console.log(`No keys to clean in ${relPath}`);
  }
}

cleanFile('src/data/final-narratives.json', false);
cleanFile('messages/ko.json', true);
cleanFile('messages/en.json', true);
cleanFile('extracted_ko.json', false);
