const fs = require('fs');
const path = require('path');

const enJsonPath = path.join(__dirname, '..', 'messages', 'en.json');
const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

const krRegex = /[가-힣]/;
const results = [];

function checkObject(obj, currentPath = '') {
  if (typeof obj === 'string') {
    if (krRegex.test(obj)) {
      results.push({ path: currentPath, value: obj });
    }
  } else if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      checkObject(obj[i], `${currentPath}[${i}]`);
    }
  } else if (obj !== null && typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      checkObject(val, currentPath ? `${currentPath}.${key}` : key);
    }
  }
}

checkObject(enJson);

console.log('Total entries in en.json containing Korean:', results.length);
if (results.length > 0) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log('No Korean characters found in en.json.');
}
