const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const files = fs.readdirSync(MESSAGES_DIR);

const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

console.log('==========================================');
console.log('Starting Translation Audit for Korean Pollution...');
console.log('==========================================');

let totalPollution = 0;

files.forEach(file => {
  if (file === 'ko.json' || !file.endsWith('.json')) return;
  
  const filePath = path.join(MESSAGES_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`Auditing ${file}...`);
  
  const scanObject = (obj, currentPath = '') => {
    for (const key in obj) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      const val = obj[key];
      
      if (typeof val === 'string') {
        if (koreanRegex.test(val)) {
          console.log(`  [POLLUTED] Key: "${fullPath}"`);
          console.log(`             Val: "${val}"`);
          totalPollution++;
        }
      } else if (typeof val === 'object' && val !== null) {
        scanObject(val, fullPath);
      }
    }
  };
  
  scanObject(data);
});

console.log('==========================================');
console.log(`Audit Complete. Found ${totalPollution} polluted entries.`);
console.log('==========================================');
