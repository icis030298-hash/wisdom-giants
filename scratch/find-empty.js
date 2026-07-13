const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/final-narratives.json', 'utf8'));
let emptyFields = [];
Object.entries(data).forEach(([slug, giant]) => {
  Object.entries(giant).forEach(([key, val]) => {
    if (typeof val === 'string' && val.trim() === '') {
      emptyFields.push({slug, key});
    }
  });
});
console.log(`Empty fields found: ${emptyFields.length}`);
if (emptyFields.length > 0) {
  console.log(emptyFields);
}
