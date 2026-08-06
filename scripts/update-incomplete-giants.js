const fs = require('fs');
const path = require('path');

const narrativesDir = path.join(process.cwd(), 'src/data/narratives');
const files = fs.readdirSync(narrativesDir).filter(f => f.endsWith('.json'));

const incompleteSlugs = [];

for (const file of files) {
  const slug = file.replace('.json', '');
  try {
    const data = JSON.parse(fs.readFileSync(path.join(narrativesDir, file), 'utf8'));
    const isComplete = Array.isArray(data?.wisdom) && data.wisdom.length > 0 && !!data?.fact_box;
    if (!isComplete) {
      incompleteSlugs.push(slug);
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
  }
}

incompleteSlugs.sort();

const outputPath = path.join(process.cwd(), 'src/config/incomplete-giants.json');
fs.writeFileSync(outputPath, JSON.stringify(incompleteSlugs, null, 2), 'utf8');

console.log(`[Manifest Updated] Total narratives: ${files.length}, Incomplete giants: ${incompleteSlugs.length}`);
console.log('Incomplete slugs:', incompleteSlugs);
