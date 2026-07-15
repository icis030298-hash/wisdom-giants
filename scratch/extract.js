const fs = require('fs');

const data = JSON.parse(fs.readFileSync('c:/Users/natey/Desktop/wisdom-giants/scratch/el_batch_10.json', 'utf8'));
const koreanStrings = new Set();
const hangulRegex = /[\u3131-\uD79D]/;

function traverse(obj) {
  if (typeof obj === 'string') {
    if (hangulRegex.test(obj)) {
      koreanStrings.add(obj);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(traverse);
  } else if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      traverse(obj[key]);
    }
  }
}

traverse(data);
console.log(JSON.stringify(Array.from(koreanStrings), null, 2));
