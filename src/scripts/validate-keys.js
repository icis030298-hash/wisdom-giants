const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '..', '..', 'messages', 'en.json');
const esPath = path.join(__dirname, '..', '..', 'messages', 'es.json');

if (!fs.existsSync(esPath)) {
  console.log("⚠️ messages/es.json does not exist yet (waiting for translation script to save progress).");
  process.exit(0);
}

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const esData = JSON.parse(fs.readFileSync(esPath, 'utf8'));

let errors = 0;

function compareObjects(objRef, objTar, currentPath = '') {
  for (const key in objRef) {
    const fullPath = currentPath ? `${currentPath}.${key}` : key;
    
    if (!(key in objTar)) {
      // Giants details can be filled dynamically, but let's check top-level UI namespaces
      if (!fullPath.startsWith('Giants.')) {
        console.error(`❌ Missing key in es.json: "${fullPath}"`);
        errors++;
      }
      continue;
    }

    if (typeof objRef[key] === 'object' && objRef[key] !== null) {
      if (typeof objTar[key] !== 'object' || objTar[key] === null) {
        console.error(`❌ Type mismatch for key "${fullPath}": expected object, got ${typeof objTar[key]}`);
        errors++;
      } else {
        compareObjects(objRef[key], objTar[key], fullPath);
      }
    }
  }
}

console.log("Starting Key Structure Validation...");
compareObjects(enData, esData);

if (errors === 0) {
  console.log("🎉 All UI translation keys in es.json are perfectly aligned with en.json!");
  process.exit(0);
} else {
  console.error(`❌ Key validation failed with ${errors} error(s).`);
  process.exit(1);
}
