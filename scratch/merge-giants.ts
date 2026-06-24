import fs from 'fs';
import path from 'path';

const scratchDir = path.resolve('scratch');
const outputPath = path.resolve('scripts/new-giants-50.json');

let generatedData = {};
if (fs.existsSync(outputPath)) {
  try {
    generatedData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  } catch (e) {
    console.error('Failed to parse existing new-giants-50.json, starting fresh.');
  }
}

const files = fs.readdirSync(scratchDir).filter(f => f.startsWith('giant-') && f.endsWith('.json'));

let mergedCount = 0;
for (const file of files) {
  try {
    const filePath = path.join(scratchDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(rawContent);
    
    // Extract slug from filename: giant-charlemagne.json -> charlemagne
    const slug = file.replace('giant-', '').replace('.json', '');
    
    if (!generatedData[slug]) {
      // Add category if possible, though we don't have it natively in the JSON.
      // We can look it up from add-50-giants.ts or just merge the data.
      generatedData[slug] = parsed;
      mergedCount++;
      console.log(`Merged ${slug}`);
    }
  } catch (err) {
    console.error(`Failed to parse ${file}: ${err.message}`);
  }
}

if (mergedCount > 0) {
  fs.writeFileSync(outputPath, JSON.stringify(generatedData, null, 2), 'utf8');
  console.log(`Successfully merged ${mergedCount} new giants into new-giants-50.json`);
} else {
  console.log('No new giants to merge.');
}
