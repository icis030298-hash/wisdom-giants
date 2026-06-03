const fs = require('fs');
const path = require('path');

const narrativeFile = path.join(__dirname, '..', 'src', 'data', 'final-narratives.json');
if (fs.existsSync(narrativeFile)) {
  const data = JSON.parse(fs.readFileSync(narrativeFile, 'utf8'));
  if (data['coco-chanel']) {
    delete data['coco-chanel'];
    fs.writeFileSync(narrativeFile, JSON.stringify(data, null, 2), 'utf8');
    console.log('Successfully removed coco-chanel from final-narratives.json!');
  } else {
    console.log('coco-chanel not found in final-narratives.json.');
  }
}
