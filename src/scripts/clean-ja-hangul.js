const fs = require('fs');
const path = require('path');

const jaJsonPath = path.join(__dirname, '../../messages/ja.json');
let jaJson = fs.readFileSync(jaJsonPath, 'utf8');

// List of known Hangul replacements
// 1. Korean possessive particle '의' (ui) to Japanese 'の' (no)
jaJson = jaJson.replace(/의/g, 'の');

// 2. Korean '나' (na) accidentally mixed in Japanese 'パーソナライズ'
jaJson = jaJson.replace(/パーソ나ライズ/g, 'パーソナライズ');

// Let's audit if there are any other Hangul characters in the file
const hangulRegex = /[\uac00-\ud7a3\u1100-\u11ff\u3130-\u318f]/g;
const matches = jaJson.match(hangulRegex);

if (matches) {
  console.log(`Found ${matches.length} Hangul characters remaining in ja.json:`);
  const uniqueMatches = [...new Set(matches)];
  console.log('Unique characters:', uniqueMatches.join(', '));
  
  // Find which lines contain these Hangul characters
  const lines = jaJson.split('\n');
  lines.forEach((line, index) => {
    if (hangulRegex.test(line)) {
      console.log(`Line ${index + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log('No Hangul characters found in ja.json! Clean!');
}

fs.writeFileSync(jaJsonPath, jaJson, 'utf8');
console.log('Successfully saved ja.json updates.');
