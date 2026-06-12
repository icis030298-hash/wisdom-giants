import fs from 'fs';
import path from 'path';

const filePath = path.resolve(process.cwd(), 'src/data/final-narratives.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Print keys
console.log("Keys in final-narratives.json:", Object.keys(data).slice(0, 10));

// Print napoleon-bonaparte structure
const napoleon = data['napoleon-bonaparte'];
if (napoleon) {
  console.log("Napoleon keys:", Object.keys(napoleon));
  // print sub-objects
  console.log("Napoleon wisdom:", napoleon.wisdom ? napoleon.wisdom.slice(0, 1) : null);
} else {
  console.log("Napoleon not found, let's check first key:", Object.keys(data)[0]);
  console.log("First key details:", Object.keys(data[Object.keys(data)[0]]));
}
