const fs = require('fs');

const originalFile = 'c:/Users/natey/Desktop/wisdom-giants/scratch/th_batch_1.json';
const koStringsFile = 'c:/Users/natey/Desktop/wisdom-giants/scratch/ko_strings_to_translate_all.json';
const translatedFile = 'c:/Users/natey/Desktop/wisdom-giants/scratch/ko_strings_translated_all.json';
const outFile = 'c:/Users/natey/Desktop/wisdom-giants/scratch/th_batch_1_out.json';

const originalData = JSON.parse(fs.readFileSync(originalFile, 'utf8'));
const koStrings = JSON.parse(fs.readFileSync(koStringsFile, 'utf8'));
const translatedStrings = JSON.parse(fs.readFileSync(translatedFile, 'utf8'));

// Build a mapping from original string (containing Korean) to translated string
const koToTh = {};
for (const key in koStrings) {
  koToTh[koStrings[key]] = translatedStrings[key];
}

// Function to recursively replace strings
function traverseAndReplace(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(traverseAndReplace);
  } else if (obj !== null && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        if (koToTh.hasOwnProperty(obj[key])) {
          obj[key] = koToTh[obj[key]];
        }
      } else {
        traverseAndReplace(obj[key]);
      }
    });
  }
}

traverseAndReplace(originalData);

fs.writeFileSync(outFile, JSON.stringify(originalData, null, 2), 'utf8');
console.log('Successfully patched and wrote to ' + outFile);
