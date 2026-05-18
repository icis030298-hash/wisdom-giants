const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '..', '..', 'messages', 'en.json');
const dePath = path.join(__dirname, '..', '..', 'messages', 'de.json');
const jaPath = path.join(__dirname, '..', '..', 'messages', 'ja.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

function checkKeys(source, target, pathName = '') {
  let missing = [];
  let extra = [];
  
  for (const key in source) {
    const fullPath = pathName ? `${pathName}.${key}` : key;
    if (!(key in target)) {
      missing.push(fullPath);
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      if (typeof target[key] !== 'object' || target[key] === null) {
        console.error(`Type mismatch at ${fullPath}: expected object, got ${typeof target[key]}`);
      } else {
        const nestedResult = checkKeys(source[key], target[key], fullPath);
        missing = missing.concat(nestedResult.missing);
        extra = extra.concat(nestedResult.extra);
      }
    }
  }

  for (const key in target) {
    const fullPath = pathName ? `${pathName}.${key}` : key;
    if (!(key in source)) {
      extra.push(fullPath);
    }
  }

  return { missing, extra };
}

console.log("=== Auditing messages/de.json against messages/en.json ===");
if (fs.existsSync(dePath)) {
  const de = JSON.parse(fs.readFileSync(dePath, 'utf8'));
  const deResult = checkKeys(en, de);
  console.log(`Missing keys in de.json: ${deResult.missing.length}`);
  if (deResult.missing.length > 0) {
    console.error("Missing keys:", deResult.missing);
  } else {
    console.log("✓ de.json matches en.json structure perfectly!");
  }
} else {
  console.log("de.json does not exist yet.");
}

console.log("\n=== Auditing messages/ja.json against messages/en.json ===");
if (fs.existsSync(jaPath)) {
  const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
  const jaResult = checkKeys(en, ja);
  console.log(`Missing keys in ja.json: ${jaResult.missing.length}`);
  if (jaResult.missing.length > 0) {
    console.error("Missing keys:", jaResult.missing);
  } else {
    console.log("✓ ja.json matches en.json structure perfectly!");
  }
} else {
  console.log("ja.json does not exist yet.");
}
