const fs = require('fs');
const path = require('path');

const filesToInspect = [
  'src/data/giants.ts',
  'src/data/final-narratives.json',
  'src/data/final-narratives_clean.json',
  'src/data/narratives.json',
  'messages/ko.json',
  'messages/en.json',
  'extracted_ko.json'
];

const livingKeys = ['elon-musk', 'oprah-winfrey', 'jk-rowling', 'malala-yousafzai', 'rigoberta-menchu'];

filesToInspect.forEach(relPath => {
  const fullPath = path.join(__dirname, '../', relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File does not exist: ${relPath}`);
    return;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  console.log(`\n--- Inspecting ${relPath} ---`);
  
  livingKeys.forEach(key => {
    const count = (content.match(new RegExp(key, 'gi')) || []).length;
    if (count > 0) {
      console.log(`  Found "${key}": ${count} times`);
    }
  });
});
