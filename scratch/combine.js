const fs = require('fs');

const p1 = fs.readFileSync('scratch/part1.json', 'utf8').trim();
const p2 = fs.readFileSync('scratch/part2.json', 'utf8').trim();
const p3 = fs.readFileSync('scratch/part3.json', 'utf8').trim();
const p4 = fs.readFileSync('scratch/part4.json', 'utf8').trim();

const finalJson = p1 + ',\n' + p2 + ',\n' + p3 + ',\n' + p4 + '\n}';

fs.writeFileSync('scratch/th_batch_10_out.json', finalJson, 'utf8');

try {
  JSON.parse(finalJson);
  console.log('Valid JSON. Successfully wrote to scratch/th_batch_10_out.json');
} catch (e) {
  console.error('Invalid JSON: ' + e.message);
}
