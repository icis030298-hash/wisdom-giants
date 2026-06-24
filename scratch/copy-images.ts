import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\natey\\.gemini\\antigravity\\brain\\3fcbb9bb-a7eb-4334-9502-8fef36add9b0';
const targetDir = path.resolve('public/images/giants');

const mappings = [
  { prefix: 'hannah_arendt', target: 'hannah-arendt.png' },
  { prefix: 'soren_kierkegaard', target: 'soren-kierkegaard.png' },
  { prefix: 'arthur_schopenhauer', target: 'arthur-schopenhauer.png' },
  { prefix: 'galileo_galilei', target: 'galileo-galilei.png' },
  { prefix: 'charles_darwin', target: 'charles-darwin.png' }
];

const files = fs.readdirSync(artifactsDir);

for (const mapping of mappings) {
  const file = files.find(f => f.startsWith(mapping.prefix) && f.endsWith('.png'));
  if (file) {
    fs.copyFileSync(path.join(artifactsDir, file), path.join(targetDir, mapping.target));
    console.log(`Copied ${file} to ${mapping.target}`);
  } else {
    console.log(`Not found for ${mapping.prefix}`);
  }
}
