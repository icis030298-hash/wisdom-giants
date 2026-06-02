const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');
const files = fs.readdirSync(messagesDir);

const koreanRegex = /[\uac00-\ud7a3\u1100-\u11ff\u3130-\u318f]/;

console.log('--- STARTING ACCURATE KOREAN LEAK SCAN ---');

files.forEach(file => {
  if (file === 'ko.json' || !file.endsWith('.json')) return;
  
  const filePath = path.join(messagesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  try {
    const data = JSON.parse(content);
    
    function scanObject(obj, currentPath = '') {
      if (typeof obj === 'string') {
        if (koreanRegex.test(obj)) {
          console.log(`[LEAK FOUND] File: ${file} | Path: ${currentPath} | Value: "${obj}"`);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
          scanObject(obj[key], currentPath ? `${currentPath}.${key}` : key);
        });
      }
    }
    
    scanObject(data);
  } catch (e) {
    console.error(`Failed to parse ${file}:`, e);
  }
});

console.log('--- SCAN COMPLETE ---');
