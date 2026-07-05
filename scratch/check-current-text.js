const fs = require('fs');

const finalNarrativesPath = 'src/data/final-narratives.json';
const fn = JSON.parse(fs.readFileSync(finalNarrativesPath, 'utf-8'));

console.log('=== Hurrem Sultan Roxelana ===');
console.log(fn['hurrem-sultan-roxelana'] ? fn['hurrem-sultan-roxelana'].epic_ko.substring(0, 300) : 'NOT FOUND');

console.log('\n=== Avvakum ===');
console.log(fn['avvakum'] ? fn['avvakum'].epic_ko.substring(0, 300) : 'NOT FOUND');

console.log('\n=== Tamar of Georgia ===');
console.log(fn['tamar-of-georgia'] ? fn['tamar-of-georgia'].epic_ko.substring(0, 300) : 'NOT FOUND');

console.log('\n=== Theodora ===');
console.log(fn['theodora'] ? fn['theodora'].epic_ko.substring(0, 300) : 'NOT FOUND');

