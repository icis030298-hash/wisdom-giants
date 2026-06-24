const fs = require('fs');
const path = require('path');

const artifactsDir = 'C:\\Users\\natey\\.gemini\\antigravity\\brain\\3fcbb9bb-a7eb-4334-9502-8fef36add9b0';
const targetDir = path.resolve('public/images/giants');

const files = fs.readdirSync(artifactsDir);

const mappings = [
  { prefix: 'giant_charlemagne_v2', target: 'charlemagne.png' },
  { prefix: 'giant_akbar_the_great_v2', target: 'akbar-the-great.png' },
  { prefix: 'giant_queen_nzinga_v2', target: 'queen-nzinga.png' },
  { prefix: 'giant_cyrus_the_great_v2', target: 'cyrus-the-great.png' },
  { prefix: 'giant_pachacuti_v2', target: 'pachacuti.png' },
  { prefix: 'giant_ramesses_ii', target: 'ramesses-ii.png' },
  { prefix: 'giant_queen_elizabeth_i', target: 'queen-elizabeth-i.png' },
  { prefix: 'giant_frederick_the_great', target: 'frederick-the-great.png' },
  { prefix: 'giant_hatshepsut', target: 'hatshepsut.png' },
  { prefix: 'giant_michael_faraday_v2', target: 'michael-faraday.png' }
];

for (const mapping of mappings) {
  const file = files.find(f => f.startsWith(mapping.prefix) && f.endsWith('.png'));
  if (file) {
    fs.copyFileSync(path.join(artifactsDir, file), path.join(targetDir, mapping.target));
    console.log(`Copied ${file} to ${mapping.target}`);
  } else {
    console.log(`Not found for prefix: ${mapping.prefix}`);
  }
}
