const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('scripts/new-giants-59.json');
if (fs.existsSync(targetPath)) {
  const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  console.log('Original keys in new-giants-59.json:', Object.keys(data));
  if (data['augustus-caesar']) {
    delete data['augustus-caesar'];
    console.log('Deleted augustus-caesar key.');
  }
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved keys in new-giants-59.json:', Object.keys(data));
} else {
  console.log('new-giants-59.json does not exist.');
}
