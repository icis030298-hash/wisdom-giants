const fs = require('fs');

const extracted = JSON.parse(fs.readFileSync('extracted_ko.json', 'utf8'));
const narratives = JSON.parse(fs.readFileSync('src/data/narratives.json', 'utf8'));

const extractedNames = Object.values(extracted).map(v => v.name);
const narrativesNames = Object.keys(narratives);

const allNames = new Set([...extractedNames, ...narrativesNames]);

const output = `Total Unique Names: ${allNames.size}\nNames: ${Array.from(allNames).join(', ')}`;
fs.writeFileSync('scratch/unique_names.txt', output);
console.log('Output written to scratch/unique_names.txt');
