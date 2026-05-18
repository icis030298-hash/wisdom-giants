const fs = require('fs');
const path = require('path');
const https = require('https');

const enPath = path.join(__dirname, '..', '..', 'messages', 'en.json');
const dePath = path.join(__dirname, '..', '..', 'messages', 'de.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const de = JSON.parse(fs.readFileSync(dePath, 'utf8'));

function translateText(text, sl = 'en', tl = 'de') {
  if (!text) return Promise.resolve('');
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          const parsed = JSON.parse(data);
          if (parsed && parsed[0]) {
            const result = parsed[0].map(item => item[0]).join('');
            resolve(result);
          } else {
            reject(new Error("Invalid response format"));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function setNestedValue(obj, pathArray, value) {
  let current = obj;
  for (let i = 0; i < pathArray.length - 1; i++) {
    const part = pathArray[i];
    if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {};
    }
    current = current[part];
  }
  current[pathArray[pathArray.length - 1]] = value;
}

// Deep clone/translate an object structure
async function translateObject(sourceObj) {
  if (typeof sourceObj === 'string') {
    return await translateText(sourceObj);
  } else if (Array.isArray(sourceObj)) {
    const arr = [];
    for (const item of sourceObj) {
      arr.push(await translateObject(item));
    }
    return arr;
  } else if (typeof sourceObj === 'object' && sourceObj !== null) {
    const obj = {};
    for (const key in sourceObj) {
      obj[key] = await translateObject(sourceObj[key]);
    }
    return obj;
  }
  return sourceObj;
}

const missingKeys = [
  'Stats',
  'QuoteSection',
  'About',
  'Cookie.title',
  'Cookie.description',
  'Cookie.necessary',
  'Cookie.analytics',
  'Cookie.advertising'
];

async function run() {
  console.log("Starting missing German keys repair...");
  
  for (const fullKey of missingKeys) {
    console.log(`Translating: ${fullKey}`);
    const parts = fullKey.split('.');
    
    // Find source value in en.json
    let sourceVal = en;
    for (const p of parts) {
      sourceVal = sourceVal[p];
    }
    
    // Translate recursively
    const translatedVal = await translateObject(sourceVal);
    
    // Set in de.json
    setNestedValue(de, parts, translatedVal);
    console.log(`✓ Completed: ${fullKey}`);
    
    // Polite delay
    await new Promise(r => setTimeout(r, 200));
  }
  
  fs.writeFileSync(dePath, JSON.stringify(de, null, 2), 'utf8');
  console.log("\n🎉 German keys successfully repaired and written to messages/de.json!");
}

run().catch(console.error);
